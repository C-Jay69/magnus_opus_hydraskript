/**
 * Resilience Utilities
 * Provides retry logic, exponential backoff, and connection pooling
 * for handling network instability and API timeouts
 */

interface RetryOptions {
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
  jitterFactor: number
}

interface ConnectionPoolConfig {
  maxConnections: number
  timeout: number
  keepAliveTimeout: number
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
}

/**
 * Connection pool for managing API connections
 */
class ConnectionPool {
  private activeConnections: Map<string, number> = new Map()
  private config: ConnectionPoolConfig

  constructor(config: Partial<ConnectionPoolConfig> = {}) {
    this.config = {
      maxConnections: config.maxConnections || 10,
      timeout: config.timeout || 30000,
      keepAliveTimeout: config.keepAliveTimeout || 60000,
    }
  }

  /**
   * Check if we can acquire a connection
   */
  canAcquire(provider: string): boolean {
    const current = this.activeConnections.get(provider) || 0
    return current < this.config.maxConnections
  }

  /**
   * Acquire a connection
   */
  acquire(provider: string): void {
    const current = this.activeConnections.get(provider) || 0
    this.activeConnections.set(provider, current + 1)
    console.log(`[ConnectionPool] Acquired connection for ${provider} (${current + 1}/${this.config.maxConnections})`)
  }

  /**
   * Release a connection
   */
  release(provider: string): void {
    const current = this.activeConnections.get(provider) || 0
    if (current > 0) {
      this.activeConnections.set(provider, current - 1)
      console.log(`[ConnectionPool] Released connection for ${provider} (${current - 1}/${this.config.maxConnections})`)
    }
  }

  /**
   * Get current connection count
   */
  getActiveConnections(provider: string): number {
    return this.activeConnections.get(provider) || 0
  }

  /**
   * Wait for a connection to become available
   */
  async waitForAvailableConnection(provider: string, maxWaitMs: number = 60000): Promise<void> {
    const startTime = Date.now()

    while (!this.canAcquire(provider)) {
      if (Date.now() - startTime > maxWaitMs) {
        throw new Error(`Connection pool timeout for ${provider} (waited ${maxWaitMs}ms)`)
      }

      // Wait 100ms before checking again
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
}

/**
 * Calculate exponential backoff delay with jitter
 */
export function calculateBackoffDelay(
  attemptNumber: number,
  options: Partial<RetryOptions> = {}
): number {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options }

  // Calculate exponential backoff: initialDelay * (multiplier ^ attemptNumber)
  let delay = opts.initialDelayMs * Math.pow(opts.backoffMultiplier, attemptNumber)

  // Cap at max delay
  delay = Math.min(delay, opts.maxDelayMs)

  // Add jitter: ±10% of delay
  const jitter = delay * opts.jitterFactor * (Math.random() * 2 - 1)
  delay = Math.max(delay + jitter, opts.initialDelayMs)

  return Math.round(delay)
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  fnName: string,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      console.log(`[Retry] Attempt ${attempt + 1}/${opts.maxRetries + 1} for ${fnName}`)

      const result = await fn()

      if (attempt > 0) {
        console.log(`[Retry] ✅ Success on attempt ${attempt + 1}`)
      }

      return result
    } catch (error: any) {
      lastError = error

      if (attempt < opts.maxRetries) {
        const delay = calculateBackoffDelay(attempt, opts)
        console.log(
          `[Retry] ❌ Attempt ${attempt + 1} failed: ${error.message}. Retrying in ${delay}ms...`
        )

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        console.error(`[Retry] ❌ All ${opts.maxRetries + 1} attempts failed for ${fnName}`)
      }
    }
  }

  throw lastError || new Error(`Failed after ${opts.maxRetries + 1} attempts`)
}

/**
 * Retry with connection pool management
 */
export async function retryWithConnectionPool<T>(
  fn: () => Promise<T>,
  fnName: string,
  provider: string,
  pool: ConnectionPool,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      console.log(`[Retry] Attempt ${attempt + 1}/${opts.maxRetries + 1} for ${fnName}`)

      // Wait for connection to be available
      await pool.waitForAvailableConnection(provider)

      // Acquire connection
      pool.acquire(provider)

      try {
        const result = await fn()

        if (attempt > 0) {
          console.log(`[Retry] ✅ Success on attempt ${attempt + 1}`)
        }

        return result
      } finally {
        // Always release connection
        pool.release(provider)
      }
    } catch (error: any) {
      lastError = error

      if (attempt < opts.maxRetries) {
        const delay = calculateBackoffDelay(attempt, opts)
        console.log(
          `[Retry] ❌ Attempt ${attempt + 1} failed: ${error.message}. Retrying in ${delay}ms...`
        )

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        console.error(`[Retry] ❌ All ${opts.maxRetries + 1} attempts failed for ${fnName}`)
      }
    }
  }

  throw lastError || new Error(`Failed after ${opts.maxRetries + 1} attempts`)
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  const errorMessage = error.message || error.toString()
  const errorName = error.name || ''

  // Network errors that should be retried
  const retryablePatterns = [
    'ECONNREFUSED',
    'ECONNRESET',
    'ETIMEDOUT',
    'EHOSTUNREACH',
    'ENETUNREACH',
    'SocketError',
    'ConnectTimeoutError',
    'timeout',
    'other side closed',
    'ENOTFOUND',
    'ERR_HTTP2_STREAM_CANCEL',
    'ERR_HTTP2_STREAM_ERROR',
    'This operation was aborted',
    'fetch failed',
    'AbortError',
    'network',
    'connection',
    'socket',
    'ECONNABORTED',
    'ERR_SOCKET',
    'UND_ERR_SOCKET',
    'UND_ERR_CONNECT_TIMEOUT',
  ]

  // Check both message and error name
  const isRetryable = retryablePatterns.some(
    (pattern) => errorMessage.toLowerCase().includes(pattern.toLowerCase()) || 
                  errorName.toLowerCase().includes(pattern.toLowerCase())
  )

  return isRetryable
}

/**
 * Check if an error is rate limit related
 */
export function isRateLimitError(error: any): boolean {
  const errorMessage = error.message || error.toString()
  const status = error.status || error.statusCode

  return status === 429 || errorMessage.includes('rate limit') || errorMessage.includes('too many requests')
}

/**
 * Exponential backoff for rate limits (longer delays)
 */
export function calculateRateLimitBackoff(attemptNumber: number): number {
  // For rate limits, use longer delays: 5s, 10s, 20s, 40s, etc.
  const initialDelay = 5000
  const multiplier = 2
  const maxDelay = 120000 // 2 minutes max

  let delay = initialDelay * Math.pow(multiplier, attemptNumber)
  delay = Math.min(delay, maxDelay)

  // Add jitter
  const jitter = delay * 0.1 * (Math.random() * 2 - 1)
  delay = Math.max(delay + jitter, initialDelay)

  return Math.round(delay)
}

/**
 * Retry with smart error handling
 */
export async function smartRetry<T>(
  fn: () => Promise<T>,
  fnName: string,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options }

  let lastError: Error | null = null
  let rateLimitAttempts = 0

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      console.log(`[SmartRetry] Attempt ${attempt + 1}/${opts.maxRetries + 1} for ${fnName}`)

      const result = await fn()

      if (attempt > 0) {
        console.log(`[SmartRetry] ✅ Success on attempt ${attempt + 1}`)
      }

      return result
    } catch (error: any) {
      lastError = error

      if (isRateLimitError(error)) {
        // Rate limit error - use longer backoff
        rateLimitAttempts++
        if (rateLimitAttempts > 2) {
          console.error(`[SmartRetry] ❌ Too many rate limit errors, giving up`)
          throw error
        }

        const delay = calculateRateLimitBackoff(rateLimitAttempts - 1)
        console.log(`[SmartRetry] ⚠️ Rate limited. Waiting ${delay}ms before retry...`)

        await new Promise((resolve) => setTimeout(resolve, delay))
      } else if (isRetryableError(error)) {
        // Retryable network error
        if (attempt < opts.maxRetries) {
          const delay = calculateBackoffDelay(attempt, opts)
          console.log(
            `[SmartRetry] ❌ Retryable error: ${error.message}. Retrying in ${delay}ms...`
          )

          await new Promise((resolve) => setTimeout(resolve, delay))
        } else {
          console.error(`[SmartRetry] ❌ All ${opts.maxRetries + 1} attempts failed`)
        }
      } else {
        // Non-retryable error - fail immediately
        console.error(`[SmartRetry] ❌ Non-retryable error: ${error.message}`)
        throw error
      }
    }
  }

  throw lastError || new Error(`Failed after ${opts.maxRetries + 1} attempts`)
}

/**
 * Create a global connection pool instance
 */
let globalConnectionPool: ConnectionPool | null = null

export function getGlobalConnectionPool(): ConnectionPool {
  if (!globalConnectionPool) {
    globalConnectionPool = new ConnectionPool({
      maxConnections: 10,
      timeout: 30000,
      keepAliveTimeout: 60000,
    })
  }
  return globalConnectionPool
}

/**
 * Reset global connection pool (for testing)
 */
export function resetGlobalConnectionPool(): void {
  globalConnectionPool = null
}

/**
 * Export ConnectionPool class for advanced usage
 */
export { ConnectionPool, RetryOptions, ConnectionPoolConfig }
