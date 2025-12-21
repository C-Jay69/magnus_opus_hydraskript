import { NextRequest, NextResponse } from 'next/server'
import llmClient from '@/llm'

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

Be meticulous and help the author maintain internal consistency.`
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
      return NextResponse.json(
        { error: 'Manuscript and editing mode are required' },
        { status: 400 }
      )
    }

    // Build the prompt
    let systemPrompt = EDITING_PROMPTS[mode]
    
    let userPrompt = `Here is the manuscript to analyze:\n\n${manuscript}`

    // Add supporting files if provided
    if (supportingFiles && supportingFiles.length > 0) {
      userPrompt += '\n\n--- SUPPORTING REFERENCE FILES ---\n'
      supportingFiles.forEach(file => {
        userPrompt += `\n[${file.name}]\n${file.content}\n`
      })
      userPrompt += '\nUse these reference files to inform your analysis (e.g., check character consistency against character sheets, verify plot points against outlines, etc.).'
    }

    // Add additional instructions if provided
    if (additionalInstructions && additionalInstructions.trim()) {
      userPrompt += `\n\n--- AUTHOR'S SPECIFIC REQUESTS ---\n${additionalInstructions}`
    }

    // Combine system and user prompts
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`

    console.log(`[Editorial Analyze] Starting ${mode} analysis with FREE LLM...`)

    // Use the FREE LLM client (OpenRouter with free models)
    const result = await llmClient.generateText(fullPrompt, {
      maxTokens: 4000,
      temperature: 0.7
    })

    if (!result.success) {
      console.error('[Editorial Analyze] LLM generation failed')
      return NextResponse.json(
        { error: 'Failed to analyze manuscript. Please try again.' },
        { status: 500 }
      )
    }

    console.log(`[Editorial Analyze] Success! Model: ${result.model}, Tokens: ${result.tokensUsed}, Time: ${result.responseTime}ms`)

    return NextResponse.json({ 
      feedback: result.text,
      metadata: {
        model: result.model,
        tokensUsed: result.tokensUsed,
        responseTime: result.responseTime
      }
    })
  } catch (error: any) {
    console.error('Error in editorial analysis:', error)
    return NextResponse.json(
      { error: 'Failed to analyze manuscript', details: error.message },
      { status: 500 }
    )
  }
}
