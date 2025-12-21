import { NextRequest, NextResponse } from 'next/server'
import llmClient from '@/llm'

interface SupportingFile {
  name: string
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, targetLength, supportingFiles, manuscriptDraft } = body as {
      title: string
      description?: string
      targetLength: 'short' | 'medium' | 'long' | 'epic'
      supportingFiles: SupportingFile[]
      manuscriptDraft?: string
    }

    if (!title || !supportingFiles || supportingFiles.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one supporting file are required' },
        { status: 400 }
      )
    }

    // Determine chapter count based on target length
    const chapterCounts = {
      short: '5-10',
      medium: '10-20',
      long: '20-30',
      epic: '30-40'
    }
    const chapterCount = chapterCounts[targetLength] || '10-20'

    // Build comprehensive context from supporting files
    let contextSection = '=== REFERENCE MATERIALS ===\n\n'
    supportingFiles.forEach(file => {
      contextSection += `--- ${file.name} ---\n${file.content}\n\n`
    })

    // Add manuscript draft if provided
    if (manuscriptDraft && manuscriptDraft.trim()) {
      contextSection += `--- EXISTING MANUSCRIPT DRAFT ---\n${manuscriptDraft}\n\n`
    }

    // Create the generation prompt
    const prompt = `You are a professional book author and creative writer. You will generate a complete, well-structured book based on the reference materials provided.

${contextSection}

=== BOOK DETAILS ===
Title: ${title}
${description ? `Description: ${description}` : ''}
Target Length: ${chapterCount} chapters

=== YOUR TASK ===
1. Carefully read ALL reference materials (outlines, character bibles, style guides, plot notes, etc.)
2. Use these materials to inform your writing - maintain consistency with character descriptions, plot points, world-building details, and writing style guidelines
3. Generate a cohesive, engaging book that follows the outline and incorporates all key elements from the reference materials
4. Write in a professional, publishable style unless the style guide specifies otherwise
5. Ensure character consistency, plot coherence, and narrative flow throughout
6. Create ${chapterCount} chapters with clear chapter breaks

=== FORMAT ===
- Use "CHAPTER X: [Title]" for chapter headings
- Write complete, fully-developed chapters (not summaries or outlines)
- Include vivid descriptions, engaging dialogue, and compelling narrative
- Maintain consistent tone and style throughout

Begin writing the book now:`

    console.log('[Generate Book] Starting generation with FREE LLM...')
    
    // Use the FREE LLM client (OpenRouter with free models)
    const result = await llmClient.generateText(prompt, {
      maxTokens: 16000,
      temperature: 0.8
    })

    if (!result.success) {
      console.error('[Generate Book] LLM generation failed')
      return NextResponse.json(
        { error: 'Failed to generate book. Please try again.' },
        { status: 500 }
      )
    }

    console.log(`[Generate Book] Success! Model: ${result.model}, Tokens: ${result.tokensUsed}, Time: ${result.responseTime}ms`)

    return NextResponse.json({ 
      content: result.text,
      metadata: {
        model: result.model,
        tokensUsed: result.tokensUsed,
        responseTime: result.responseTime
      }
    })
  } catch (error: any) {
    console.error('Error in book generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate book', details: error.message },
      { status: 500 }
    )
  }
}
