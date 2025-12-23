// Shared utility functions

// Generates a short, prefixed random ID with timestamp for traceability
// Example: generateRandomId('llm') -> llm_20251222_3f9a1c7b
export function generateRandomId(prefix: string = 'id'): string {
  const ts = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, '')
    .slice(0, 14) // YYYYMMDDHHMMSS
  const rand = Math.random().toString(16).slice(2, 10)
  return `${prefix}_${ts}_${rand}`
}

// Simple sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Retry helper with backoff
export async function retry<T>(fn: () => Promise<T>, retries = 3, delayMs = 500): Promise<T> {
  let lastErr: any
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt < retries - 1) {
        await sleep(delayMs)
      }
    }
  }
  throw lastErr
}
