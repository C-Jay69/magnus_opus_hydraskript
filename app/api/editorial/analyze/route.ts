import { NextRequest, NextResponse } from 'next/server'
import {
  chunkManuscript,
  createChunkAnalysisPrompt,
  aggregateChunkResults,
  estimateManuscriptTokens,
  getChunkingStats,
} from '@/lib/manuscript-chunking-utils'
import {
  recordSuccess,
  recordRateLimit,
  recordFailure,
  shouldSkipProvider,
  getOptimizedProviderOrder,
  getOptimizedTimeout,
  getProviderStatsSummary,
} from '@/lib/provider-optimization-utils'
import {
  callMiniMaxAPI,
  createMiniMaxAggregationPrompt,
  estimateAggregationTokens,
  getMiniMaxStatus,
} from '@/lib/minimax-integration-utils'

type EditingMode = 'proofread' | 'style' | 'character' | 'chapter' | 'creative' | 'continuity'

interface SupportingFile {
  name: string
  content: string
}

const EDITING_PROMPTS: Record<EditingMode, string> = {
  proofread: `You are a professional proofreader and copy editor. Carefully review this manuscript for:
- Grammar errors
- Spelling mistakes
- Punctuation issues
- Sentence structure problems
- Typos and formatting inconsistencies

Provide a detailed report with:
1. Overall assessment of writing quality
2. Specific errors found (with line/paragraph references if possible)
3. Suggestions for corrections
4. Any patterns you notice in the errors

Be thorough but constructive. Focus on helping the author improve.`,

  style: `You are a literary editor specializing in style and voice. Analyze this manuscript for:
- Sentence flow and rhythm
- Word choice and vocabulary
- Clarity and readability
- Tone consistency
- Repetitive phrases or clichés
- Opportunities for more vivid or precise language

Provide a detailed report with:
1. Overall style assessment
2. Strengths in the writing
3. Areas that could be enhanced
4. Specific examples with suggestions for improvement
5. General recommendations for elevating the prose

Be encouraging while offering actionable feedback.`,

  character: `You are a character development specialist. Analyze this manuscript for:
- Character voice consistency
- Character behavior and motivation
- Dialogue authenticity
- Character development arcs
- Distinguishable character personalities
- Character relationships and dynamics

Provide a detailed report with:
1. Overview of main characters identified
2. Character voice consistency analysis
3. Strengths in character development
4. Areas where characters feel flat or inconsistent
5. Suggestions for deepening character authenticity
6. Dialogue improvements

Focus on helping characters feel real and distinct.`,

  chapter: `You are a structural editor specializing in narrative structure. Analyze this manuscript for:
- Chapter structure and organization
- Pacing (too fast, too slow, uneven)
- Plot progression and logic
- Scene transitions
- Chapter hooks and endings
- Story momentum
- Plot holes or inconsistencies

Provide a detailed report with:
1. Overall structural assessment
2. Pacing analysis (chapter by chapter if applicable)
3. Strengths in structure
4. Areas where pacing drags or rushes
5. Plot issues or gaps
6. Suggestions for improving structure and flow

Be specific about what works and what needs adjustment.`,

  creative: `You are a creative writing consultant. Analyze this manuscript and provide:
- Alternative phrasings for key passages
- Creative suggestions for scene development
- Ideas for enhancing imagery and description
- Possibilities for deeper emotional resonance
- Fresh angles on existing scenes
- Metaphors, similes, or literary devices that could enhance the writing

Provide a detailed report with:
1. Overall creative assessment
2. Specific passages that could be elevated (with alternatives)
3. Scenes that could be expanded or reimagined
4. Creative techniques the author could employ
5. Inspirational suggestions for taking the work further

Be imaginative and inspiring while respecting the author's vision.`,

  continuity: `You are a continuity editor. Analyze this manuscript for:
- Timeline inconsistencies
- Contradictions in plot details
- Character detail inconsistencies (appearance, background, abilities)
- Setting/world-building contradictions
- Factual errors
- Logic gaps
- Forgotten plot threads

Provide a detailed report with:
1. Overall continuity assessment
2. Specific inconsistencies found (with references)
3. Timeline issues
4. Character detail contradictions
5. Plot logic problems
6. Suggestions for resolving inconsistencies

Be meticulous and help the author maintain internal consistency.`,
}

/**
 * Ultra-optimized AI call with provider caching and smart fallback
 */
async function callAIWithOptimizedFallback(
  prompt: string
): Promise<{ success: boolean; text: string; model: string; provider: string }> {
  const groqApiKey = process.env.GROQ_API_KEY
  const openrouterApiKey = process.env.OPENROUTER_API_KEY

  // Build available providers list
  const availableProviders: string[] = []
  if (groqApiKey) availableProviders.push('groq')
  if (openrouterApiKey) availableProviders.push('openrouter')

  // Get optimized provider order
  const providerOrder = getOptimizedProviderOrder(availableProviders)

  console.log(`[Editorial Analyze] Trying providers in order: ${providerOrder.join(' → ')}`)

  // Try each provider in optimized order
  for (const provider of providerOrder) {
    if (provider === 'groq') {
      if (!groqApiKey) continue

      const groqModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant']

      for (const model of groqModels) {
        const startTime = Date.now()

        try {
          const timeout = getOptimizedTimeout('groq')
          console.log(`[Editorial Analyze] Trying Groq ${model} (timeout: ${timeout}ms)...`)

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), timeout)

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7,
              max_tokens: 3000,
            }),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)
          const responseTime = Date.now() - startTime

          if (response.ok) {
            const data = await response.json()
            const text = data.choices?.[0]?.message?.content || 'No feedback generated'
            recordSuccess('groq', responseTime)
            console.log(`[Editorial Analyze] ✅ Success with Groq ${model} (${responseTime}ms)`)
            return { success: true, text, model: model, provider: 'Groq' }
          }

          const error = await response.json()
          if (error.error?.code === 'rate_limit_exceeded' || error.error?.message?.includes('rate')) {
            recordRateLimit('groq')
            console.log(`[Editorial Analyze] ⚠️ Groq ${model} rate limited, trying next...`)
            continue
          }

          if (error.error?.message?.includes('reduce the length')) {
            recordFailure('groq')
            console.log(`[Editorial Analyze] ⚠️ Groq ${model} message too long, trying next...`)
            continue
          }

          recordFailure('groq')
          console.error(`[Editorial Analyze] ❌ Groq ${model} error:`, error)
        } catch (err: any) {
          if (err.name === 'AbortError') {
            recordFailure('groq')
            console.error(`[Editorial Analyze] ❌ Groq ${model} timeout`)
          } else {
            recordFailure('groq')
            console.error(`[Editorial Analyze] ❌ Groq ${model} failed:`, err)
          }
        }
      }
    }

    if (provider === 'openrouter') {
      if (!openrouterApiKey) continue

      const openrouterModels = ['meta-llama/llama-3.1-70b-instruct', 'mistralai/mistral-7b-instruct:free']

      for (const model of openrouterModels) {
        const startTime = Date.now()

        try {
          const timeout = getOptimizedTimeout('openrouter')
          console.log(`[Editorial Analyze] Trying OpenRouter ${model} (timeout: ${timeout}ms)...`)

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), timeout)

          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${openrouterApiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'Magnus Opus',
            },
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7,
              max_tokens: 3000,
            }),
            signal: controller.signal,
          })

          clearTimeout(timeoutId)
          const responseTime = Date.now() - startTime

          if (response.ok) {
            const data = await response.json()
            const text = data.choices?.[0]?.message?.content || 'No feedback generated'
            recordSuccess('openrouter', responseTime)
            console.log(`[Editorial Analyze] ✅ Success with OpenRouter ${model} (${responseTime}ms)`)
            return { success: true, text, model: model, provider: 'OpenRouter' }
          }

          const error = await response.json()
          if (error.error?.code === 429 || error.error?.message?.includes('rate')) {
            recordRateLimit('openrouter')
            console.log(`[Editorial Analyze] ⚠️ OpenRouter ${model} rate limited, trying next...`)
            continue
          }

          recordFailure('openrouter')
          console.error(`[Editorial Analyze] ❌ OpenRouter ${model} error:`, error)
        } catch (err: any) {
          if (err.name === 'AbortError') {
            recordFailure('openrouter')
            console.error(`[Editorial Analyze] ❌ OpenRouter ${model} timeout`)
          } else {
            recordFailure('openrouter')
            console.error(`[Editorial Analyze] ❌ OpenRouter ${model} failed:`, err)
          }
        }
      }
    }
  }

  // All providers failed
  console.log(getProviderStatsSummary())
  return {
    success: false,
    text: 'All available AI models are currently rate limited or unavailable. Please try again in a few minutes.',
    model: 'none',
    provider: 'none',
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { manuscript, mode, supportingFiles, additionalInstructions } = body as {
      manuscript: string
      mode: EditingMode
      supportingFiles?: SupportingFile[]
      additionalInstructions?: string
    }

    if (!manuscript || !mode) {
      return NextResponse.json({ error: 'Manuscript and editing mode are required' }, { status: 400 })
    }

    console.log(`[Editorial Analyze] Starting ${mode} analysis...`)

    // Check manuscript size and determine if chunking is needed
    const manuscriptTokens = estimateManuscriptTokens(manuscript)
    console.log(`[Editorial Analyze] Manuscript size: ~${manuscriptTokens} tokens`)

    // If manuscript is small enough, analyze directly
    if (manuscriptTokens <= 6000) {
      console.log(`[Editorial Analyze] Manuscript is small enough for direct analysis`)

      const systemPrompt = EDITING_PROMPTS[mode]
      let userPrompt = `Here is the manuscript to analyze:\n\n${manuscript}`

      if (supportingFiles && supportingFiles.length > 0) {
        userPrompt += '\n\n--- SUPPORTING REFERENCE FILES ---\n'
        supportingFiles.forEach((file) => {
          userPrompt += `\n[${file.name}]\n${file.content.substring(0, 5000)}\n`
        })
        userPrompt += '\nUse these reference files to inform your analysis.'
      }

      if (additionalInstructions && additionalInstructions.trim()) {
        userPrompt += `\n\n--- AUTHOR'S SPECIFIC REQUESTS ---\n${additionalInstructions}`
      }

      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`
      const result = await callAIWithOptimizedFallback(fullPrompt)

      if (!result.success) {
        return NextResponse.json({ error: result.text }, { status: 503 })
      }

      return NextResponse.json({
        feedback: result.text,
        metadata: {
          model: result.model,
          provider: result.provider,
          cost: '$0.00 (FREE!)',
          backupChainUsed: 'Groq + OpenRouter (Optimized)',
          manuscriptSize: 'Small',
          chunked: false,
        },
      })
    }

    // Large manuscript - use chunking
    console.log(`[Editorial Analyze] Manuscript is large (${manuscriptTokens} tokens) - using chunking strategy`)

    const chunks = chunkManuscript(manuscript, {
      maxTokensPerChunk: 6000,
      maxCharsPerChunk: 24000,
      overlapChars: 500,
      preserveChapterBoundaries: true,
    })

    const stats = getChunkingStats(chunks)
    console.log(
      `[Editorial Analyze] Split into ${stats.totalChunks} chunks (avg ${stats.avgTokensPerChunk} tokens/chunk)`
    )

    // Analyze each chunk
    const chunkResults: Array<{ chunkId: number; analysis: string }> = []

    for (const chunk of chunks) {
      console.log(`[Editorial Analyze] Analyzing chunk ${chunk.chunkId + 1}/${chunks.length}...`)

      const chunkPrompt = createChunkAnalysisPrompt(chunk, chunks.length, mode)
      const result = await callAIWithOptimizedFallback(chunkPrompt)

      if (result.success) {
        chunkResults.push({
          chunkId: chunk.chunkId,
          analysis: result.text,
        })
        console.log(`[Editorial Analyze] ✅ Chunk ${chunk.chunkId + 1} analyzed successfully`)
      } else {
        console.error(`[Editorial Analyze] ❌ Failed to analyze chunk ${chunk.chunkId + 1}`)
        return NextResponse.json(
          { error: `Failed to analyze chunk ${chunk.chunkId + 1}: ${result.text}` },
          { status: 503 }
        )
      }
    }

    // Aggregate results
    console.log(`[Editorial Analyze] Aggregating results from ${chunkResults.length} chunks...`)

    // Check if aggregation prompt will exceed Groq's limit
    const estimatedAggregationTokens = estimateAggregationTokens(chunkResults)
    const miniMaxStatus = getMiniMaxStatus(estimatedAggregationTokens)

    console.log(
      `[Editorial Analyze] Aggregation prompt size: ~${estimatedAggregationTokens} tokens`
    )
    console.log(`[Editorial Analyze] ${miniMaxStatus.recommendation}`)

    let finalResult: { success: boolean; text: string; model: string; provider: string }

    // If aggregation exceeds Groq limit, try MiniMax first
    if (!miniMaxStatus.canUseGroq && miniMaxStatus.canUseMiniMax) {
      console.log(`[Editorial Analyze] Aggregation prompt too large for Groq, trying MiniMax...`)

      const miniMaxPrompt = createMiniMaxAggregationPrompt(chunkResults, mode)
      const miniMaxResult = await callMiniMaxAPI(miniMaxPrompt)

      if (miniMaxResult.success) {
        finalResult = {
          success: true,
          text: miniMaxResult.text,
          model: 'abab7-preview',
          provider: 'MiniMax',
        }
      } else {
        console.log(`[Editorial Analyze] MiniMax failed, falling back to standard aggregation...`)

        // Fallback to standard aggregation with Groq/OpenRouter
        const aggregationPrompt = aggregateChunkResults(chunkResults, mode)
        finalResult = await callAIWithOptimizedFallback(aggregationPrompt)
      }
    } else {
      // Aggregation fits in Groq, use standard aggregation
      const aggregationPrompt = aggregateChunkResults(chunkResults, mode)
      finalResult = await callAIWithOptimizedFallback(aggregationPrompt)
    }

    if (!finalResult.success) {
      return NextResponse.json({ error: 'Failed to aggregate results: ' + finalResult.text }, { status: 503 })
    }

    // Log final statistics
    console.log(getProviderStatsSummary())

    return NextResponse.json({
      feedback: finalResult.text,
      metadata: {
        model: finalResult.model,
        provider: finalResult.provider,
        cost: '$0.00 (FREE!)',
        backupChainUsed: 'Groq + OpenRouter + MiniMax (Optimized)',
        manuscriptSize: 'Large',
        chunked: true,
        chunksProcessed: chunks.length,
        totalTokensEstimated: stats.totalTokens,
        averageTokensPerChunk: stats.avgTokensPerChunk,
        aggregationTokensEstimated: estimatedAggregationTokens,
        aggregationProvider: finalResult.provider,
      },
    })
  } catch (error: any) {
    console.error('Error in editorial analysis:', error)
    return NextResponse.json(
      { error: 'Failed to analyze manuscript', details: error.message },
      { status: 500 }
    )
  }
}
