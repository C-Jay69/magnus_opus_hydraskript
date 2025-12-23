/**
 * MiniMax Integration Utilities
 * Handles MiniMax API calls for large aggregation tasks (500K+ tokens)
 * MiniMax-M1 supports 1 MILLION token context window - perfect for aggregation!
 */

interface MiniMaxMessage {
  role: 'user' | 'assistant'
  content: string
}

interface MiniMaxResponse {
  reply: string
  finish_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

/**
 * Call MiniMax API for large aggregation prompts
 * Uses MiniMax-M1 which supports 1 MILLION token context window
 */
export async function callMiniMaxAPI(
  prompt: string,
  model: string = 'abab7-preview'
): Promise<{ success: boolean; text: string; tokensUsed: number }> {
  const apiKey = process.env.MINIMAX_API_KEY

  if (!apiKey) {
    console.log('[MiniMax] No API key found, skipping MiniMax')
    return { success: false, text: 'MiniMax API key not configured', tokensUsed: 0 }
  }

  try {
    console.log(`[MiniMax] Calling MiniMax ${model} for aggregation...`)

    const messages: MiniMaxMessage[] = [
      {
        role: 'user',
        content: prompt,
      },
    ]

    const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 8000,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error(`[MiniMax] Error (${response.status}):`, error)

      // Log specific error details
      if (error.error_code === 'invalid_request_error') {
        console.error('[MiniMax] Invalid request - check API key or request format')
      } else if (error.error_code === 'rate_limit_error') {
        console.error('[MiniMax] Rate limited - try again later')
      } else if (error.error_code === 'server_error') {
        console.error('[MiniMax] Server error - MiniMax API is having issues')
      }

      return {
        success: false,
        text: `MiniMax error: ${error.message || 'Unknown error'}`,
        tokensUsed: 0,
      }
    }

    const data = (await response.json()) as MiniMaxResponse
    const text = data.reply || 'No response generated'
    const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)

    console.log(
      `[MiniMax] ✅ Success! Used ${tokensUsed} tokens (input: ${data.usage?.input_tokens}, output: ${data.usage?.output_tokens})`
    )

    return { success: true, text, tokensUsed }
  } catch (error: any) {
    console.error('[MiniMax] Exception:', error.message)
    return { success: false, text: `MiniMax error: ${error.message}`, tokensUsed: 0 }
  }
}

/**
 * Create aggregation prompt for MiniMax
 * Optimized for MiniMax's 1M token context window
 */
export function createMiniMaxAggregationPrompt(
  chunkResults: Array<{ chunkId: number; analysis: string }>,
  editingMode: string
): string {
  const aggregationPrompt = `You are an expert editor combining analysis results from ${chunkResults.length} chunks of a large manuscript.

IMPORTANT: This is a comprehensive analysis combining results from all chunks. Treat the manuscript as a COMPLETE WHOLE.

CHUNK ANALYSES (${chunkResults.length} chunks total):
${chunkResults
  .map(
    (result) => `
=== CHUNK ${result.chunkId + 1} ===
${result.analysis}
`
  )
  .join('\n')}

Your task: Create a comprehensive, unified report that:
1. Consolidates findings across ALL ${chunkResults.length} chunks
2. Identifies patterns and recurring issues throughout the manuscript
3. Highlights cross-chunk inconsistencies (CRITICAL for continuity analysis)
4. Prioritizes the most critical issues
5. Provides actionable recommendations

For ${editingMode} analysis, focus on:
${
  editingMode === 'continuity'
    ? `
- Timeline inconsistencies across the ENTIRE manuscript
- Character detail contradictions that span multiple chunks
- Plot logic problems that emerge across sections
- Forgotten plot threads throughout the book
- World-building contradictions
- Provide a COMPREHENSIVE continuity report treating the entire manuscript as one cohesive work
- Identify issues that would only be visible when viewing the manuscript as a whole
`
    : editingMode === 'proofread'
    ? `
- Recurring grammar patterns and errors
- Spelling and punctuation consistency issues
- Formatting problems that appear throughout
- Provide a comprehensive proofreading report with prioritized corrections
`
    : editingMode === 'style'
    ? `
- Overall writing style consistency across the manuscript
- Recurring style issues and patterns
- Voice consistency throughout the book
- Provide recommendations for elevating the entire manuscript's style
`
    : editingMode === 'character'
    ? `
- Character consistency across the ENTIRE manuscript
- Character development arcs from beginning to end
- Character voice consistency throughout
- Relationships and interactions across all sections
- Provide a comprehensive character analysis for the complete work
`
    : editingMode === 'chapter'
    ? `
- Overall pacing across the entire manuscript
- Chapter structure consistency
- Plot progression from start to finish
- Provide structural recommendations for the complete book
`
    : editingMode === 'creative'
    ? `
- Creative opportunities throughout the manuscript
- Recurring themes that could be enhanced
- Scenes that could be elevated across the book
- Provide creative suggestions for the entire work
`
    : ''
}

Format your response as a professional, comprehensive report suitable for an author.
Include:
1. Executive Summary (2-3 paragraphs)
2. Key Findings (organized by category)
3. Patterns and Recurring Issues
4. Critical Issues Requiring Attention
5. Recommendations for Improvement
6. Conclusion

Be thorough, specific, and actionable.`

  return aggregationPrompt
}

/**
 * Estimate tokens in aggregation prompt
 * Rough estimate: 1 token ≈ 4 characters
 */
export function estimateAggregationTokens(
  chunkResults: Array<{ chunkId: number; analysis: string }>
): number {
  const totalChars = chunkResults.reduce((sum, result) => sum + result.analysis.length, 0)
  return Math.ceil(totalChars / 4)
}

/**
 * Check if aggregation prompt exceeds Groq's limit
 * Groq has ~131K token limit, we use 6K for safety
 */
export function exceedsGroqLimit(estimatedTokens: number): boolean {
  const groqSafeLimit = 6000
  return estimatedTokens > groqSafeLimit
}

/**
 * Check if aggregation prompt is within MiniMax's limit
 * MiniMax-M1 has 1M token context window
 */
export function withinMiniMaxLimit(estimatedTokens: number): boolean {
  const miniMaxLimit = 1000000
  return estimatedTokens < miniMaxLimit
}

/**
 * Get MiniMax status and recommendations
 */
export function getMiniMaxStatus(estimatedTokens: number): {
  canUseGroq: boolean
  canUseMiniMax: boolean
  recommendation: string
} {
  const canUseGroq = !exceedsGroqLimit(estimatedTokens)
  const canUseMiniMax = withinMiniMaxLimit(estimatedTokens)

  let recommendation = ''

  if (canUseGroq) {
    recommendation = 'Can use Groq (aggregation prompt is small enough)'
  } else if (canUseMiniMax) {
    recommendation = 'Use MiniMax (aggregation prompt exceeds Groq limit but within MiniMax capacity)'
  } else {
    recommendation = 'ERROR: Aggregation prompt exceeds all available models!'
  }

  return { canUseGroq, canUseMiniMax, recommendation }
}

/**
 * Create multi-stage aggregation as fallback
 * Splits large aggregations into batches
 */
export function createBatchAggregationPlan(
  chunkResults: Array<{ chunkId: number; analysis: string }>,
  batchSize: number = 50
): Array<Array<{ chunkId: number; analysis: string }>> {
  const batches: Array<Array<{ chunkId: number; analysis: string }>> = []

  for (let i = 0; i < chunkResults.length; i += batchSize) {
    batches.push(chunkResults.slice(i, i + batchSize))
  }

  console.log(`[MiniMax] Created ${batches.length} batches for multi-stage aggregation`)

  return batches
}
