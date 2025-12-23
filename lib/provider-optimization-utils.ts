/**
 * Provider Optimization Utilities
 * Manages provider caching, rate limit detection, and timeout optimization
 * Eliminates wasted time on consistently rate-limited providers
 */

interface ProviderStats {
  name: string
  successCount: number
  failureCount: number
  rateLimitCount: number
  lastUsed: number
  isRateLimited: boolean
  avgResponseTime: number
  lastRateLimitTime?: number
}

interface ProviderCache {
  [key: string]: ProviderStats
}

// In-memory cache for provider stats (persists during server session)
let providerCache: ProviderCache = {
  gemini: {
    name: 'Gemini 2.0 Flash',
    successCount: 0,
    failureCount: 0,
    rateLimitCount: 0,
    lastUsed: 0,
    isRateLimited: false,
    avgResponseTime: 0,
  },
  groq: {
    name: 'Groq',
    successCount: 0,
    failureCount: 0,
    rateLimitCount: 0,
    lastUsed: 0,
    isRateLimited: false,
    avgResponseTime: 0,
  },
  openrouter: {
    name: 'OpenRouter',
    successCount: 0,
    failureCount: 0,
    rateLimitCount: 0,
    lastUsed: 0,
    isRateLimited: false,
    avgResponseTime: 0,
  },
}

/**
 * Record a successful API call
 */
export function recordSuccess(provider: string, responseTime: number): void {
  if (!providerCache[provider]) return

  const stats = providerCache[provider]
  stats.successCount++
  stats.lastUsed = Date.now()
  stats.isRateLimited = false

  // Update average response time (exponential moving average)
  if (stats.avgResponseTime === 0) {
    stats.avgResponseTime = responseTime
  } else {
    stats.avgResponseTime = stats.avgResponseTime * 0.7 + responseTime * 0.3
  }

  console.log(
    `[Provider Cache] ${stats.name}: Success (${stats.successCount} successes, ${stats.rateLimitCount} rate limits)`
  )
}

/**
 * Record a rate limit error
 */
export function recordRateLimit(provider: string): void {
  if (!providerCache[provider]) return

  const stats = providerCache[provider]
  stats.rateLimitCount++
  stats.lastUsed = Date.now()
  stats.lastRateLimitTime = Date.now()

  // Mark as rate limited if it fails 3+ times in a row
  if (stats.rateLimitCount >= 3) {
    stats.isRateLimited = true
    console.log(
      `[Provider Cache] ${stats.name}: RATE LIMITED (${stats.rateLimitCount} consecutive rate limits) - will skip for 60 seconds`
    )
  } else {
    console.log(
      `[Provider Cache] ${stats.name}: Rate limit detected (${stats.rateLimitCount}/3 before skip)`
    )
  }
}

/**
 * Record a failure (not rate limit)
 */
export function recordFailure(provider: string): void {
  if (!providerCache[provider]) return

  const stats = providerCache[provider]
  stats.failureCount++
  stats.lastUsed = Date.now()

  console.log(`[Provider Cache] ${stats.name}: Failure (${stats.failureCount} failures)`)
}

/**
 * Check if provider should be skipped
 * Returns true if provider is rate limited and skip timeout hasn't expired
 */
export function shouldSkipProvider(provider: string): boolean {
  if (!providerCache[provider]) return false

  const stats = providerCache[provider]

  // If not marked as rate limited, don't skip
  if (!stats.isRateLimited) return false

  // If rate limited, check if timeout has expired (60 seconds)
  const timeSinceRateLimit = Date.now() - (stats.lastRateLimitTime || 0)
  const skipTimeout = 60000 // 60 seconds

  if (timeSinceRateLimit > skipTimeout) {
    // Timeout expired, reset rate limit status
    stats.isRateLimited = false
    stats.rateLimitCount = 0
    console.log(`[Provider Cache] ${stats.name}: Rate limit timeout expired, retrying...`)
    return false
  }

  // Still in timeout period, skip this provider
  const secondsRemaining = Math.ceil((skipTimeout - timeSinceRateLimit) / 1000)
  console.log(
    `[Provider Cache] ${stats.name}: Skipped (rate limited, ${secondsRemaining}s remaining)`
  )
  return true
}

/**
 * Get optimized provider order
 * Returns providers sorted by success rate and response time
 * Skips providers that are rate limited
 */
export function getOptimizedProviderOrder(availableProviders: string[]): string[] {
  return availableProviders
    .filter((provider) => !shouldSkipProvider(provider))
    .sort((a, b) => {
      const statsA = providerCache[a]
      const statsB = providerCache[b]

      if (!statsA || !statsB) return 0

      // Calculate success rate
      const totalA = statsA.successCount + statsA.failureCount + statsA.rateLimitCount
      const totalB = statsB.successCount + statsB.failureCount + statsB.rateLimitCount

      const successRateA = totalA === 0 ? 0 : statsA.successCount / totalA
      const successRateB = totalB === 0 ? 0 : statsB.successCount / totalB

      // Sort by success rate (descending), then by response time (ascending)
      if (successRateA !== successRateB) {
        return successRateB - successRateA
      }

      return statsA.avgResponseTime - statsB.avgResponseTime
    })
}

/**
 * Get provider statistics for logging/debugging
 */
export function getProviderStats(): ProviderCache {
  return { ...providerCache }
}

/**
 * Reset provider cache (for testing)
 */
export function resetProviderCache(): void {
  Object.keys(providerCache).forEach((key) => {
    providerCache[key] = {
      name: providerCache[key].name,
      successCount: 0,
      failureCount: 0,
      rateLimitCount: 0,
      lastUsed: 0,
      isRateLimited: false,
      avgResponseTime: 0,
    }
  })
  console.log('[Provider Cache] Cache reset')
}

/**
 * Get human-readable provider stats summary
 */
export function getProviderStatsSummary(): string {
  const stats = getProviderStats()
  const lines: string[] = []

  lines.push('\n=== PROVIDER STATISTICS ===')

  Object.values(stats).forEach((stat) => {
    const total = stat.successCount + stat.failureCount + stat.rateLimitCount
    const successRate = total === 0 ? 0 : ((stat.successCount / total) * 100).toFixed(1)
    const status = stat.isRateLimited ? '🚫 RATE LIMITED' : '✅ ACTIVE'

    lines.push(
      `${stat.name}: ${status} | Success: ${stat.successCount} | Failures: ${stat.failureCount} | Rate Limits: ${stat.rateLimitCount} | Success Rate: ${successRate}% | Avg Response: ${stat.avgResponseTime.toFixed(0)}ms`
    )
  })

  lines.push('===========================\n')

  return lines.join('\n')
}

/**
 * Optimized timeout for API calls
 * Shorter timeout for providers with high failure rates
 */
export function getOptimizedTimeout(provider: string): number {
  const stats = providerCache[provider]
  if (!stats) return 15000 // Default 15 seconds

  const total = stats.successCount + stats.failureCount + stats.rateLimitCount
  const failureRate = total === 0 ? 0 : (stats.failureCount + stats.rateLimitCount) / total

  // If failure rate > 50%, use shorter timeout
  if (failureRate > 0.5) {
    return 8000 // 8 seconds
  }

  // If failure rate > 25%, use medium timeout
  if (failureRate > 0.25) {
    return 10000 // 10 seconds
  }

  // Default timeout
  return 15000 // 15 seconds
}

/**
 * Log provider statistics periodically
 */
export function logProviderStats(): void {
  console.log(getProviderStatsSummary())
}
