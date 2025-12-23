import { NextRequest, NextResponse } from 'next/server'

interface SupportingFile {
  name: string
  content: string
}

// Smart truncation - AGGRESSIVE to prevent token limit errors
function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars) + '\n\n[... Content truncated due to length ...]'
}

// FIXED 6-way fallback with working models
async function callAIWithFallback(prompt: string): Promise<{ success: boolean, text: string, model: string, provider: string }> {
  const geminiApiKey = process.env.GEMINI_API_KEY
  const groqApiKey = process.env.GROQ_API_KEY
  const openrouterApiKey = process.env.OPENROUTER_API_KEY

  // 1. Try Gemini 2.0 Flash ONLY (other models are deprecated)
  if (geminiApiKey) {
    try {
      console.log(`[Generate Book] Trying Gemini 2.0 Flash...`)
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 6000
            }
          })
        }
      )

      if (response.ok) {
        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated'
        console.log(`[Generate Book] ✅ Success with Gemini 2.0 Flash!`)
        return { success: true, text, model: 'gemini-2.0-flash-exp', provider: 'Google Gemini' }
      }

      const error = await response.json()
      if (error.error?.code === 429) {
        console.log(`[Generate Book] ⚠️ Gemini 2.0 Flash rate limited, trying next...`)
      } else {
        console.error(`[Generate Book] ❌ Gemini error:`, error)
      }
    } catch (err) {
      console.error(`[Generate Book] ❌ Gemini failed:`, err)
    }
  }

  // 2. Try Groq with CURRENT models (not deprecated ones)
  if (groqApiKey) {
    const groqModels = [
      'llama-3.3-70b-versatile',  // CURRENT - replaced llama-3.1-70b-versatile
      'llama-3.1-8b-instant'      // Fast alternative
    ]

    for (const model of groqModels) {
      try {
        console.log(`[Generate Book] Trying Groq ${model}...`)
        
        const response = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.8,
              max_tokens: 6000  // Reduced to prevent token limit errors
            })
          }
        )

        if (response.ok) {
          const data = await response.json()
          const text = data.choices?.[0]?.message?.content || 'No content generated'
          console.log(`[Generate Book] ✅ Success with Groq ${model}!`)
          return { success: true, text, model: model, provider: 'Groq' }
        }

        const error = await response.json()
        if (error.error?.code === 'rate_limit_exceeded' || error.error?.message?.includes('rate')) {
          console.log(`[Generate Book] ⚠️ Groq ${model} rate limited, trying next...`)
          continue
        }
        if (error.error?.message?.includes('decommissioned')) {
          console.log(`[Generate Book] ⚠️ Groq ${model} decommissioned, trying next...`)
          continue
        }
        console.error(`[Generate Book] ❌ Groq ${model} error:`, error)
      } catch (err) {
        console.error(`[Generate Book] ❌ Groq ${model} failed:`, err)
      }
    }
  }

  // 3. Try OpenRouter as fallback (you have the API key!)
  if (openrouterApiKey) {
    const openrouterModels = [
      'meta-llama/llama-3.1-70b-instruct',
      'mistralai/mistral-7b-instruct:free'
    ]

    for (const model of openrouterModels) {
      try {
        console.log(`[Generate Book] Trying OpenRouter ${model}...`)
        
        const response = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openrouterApiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'Magnus Opus'
            },
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.8,
              max_tokens: 6000
            })
          }
        )

        if (response.ok) {
          const data = await response.json()
          const text = data.choices?.[0]?.message?.content || 'No content generated'
          console.log(`[Generate Book] ✅ Success with OpenRouter ${model}!`)
          return { success: true, text, model: model, provider: 'OpenRouter' }
        }

        const error = await response.json()
        if (error.error?.code === 429 || error.error?.message?.includes('rate')) {
          console.log(`[Generate Book] ⚠️ OpenRouter ${model} rate limited, trying next...`)
          continue
        }
        console.error(`[Generate Book] ❌ OpenRouter ${model} error:`, error)
      } catch (err) {
        console.error(`[Generate Book] ❌ OpenRouter ${model} failed:`, err)
      }
    }
  }

  // All models failed
  return {
    success: false,
    text: 'All available AI models are currently rate limited or unavailable. Please try again in a few minutes.',
    model: 'none',
    provider: 'none'
  }
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

    // Determine chapter count
    const chapterCounts = {
      short: '5-10',
      medium: '10-20',
      long: '20-30',
      epic: '30-40'
    }
    const chapterCount = chapterCounts[targetLength] || '10-20'

    // Build context from supporting files with AGGRESSIVE truncation
    let contextSection = '=== REFERENCE MATERIALS ===\n\n'
    supportingFiles.forEach(file => {
      const truncatedContent = truncateText(file.content, 10000)  // Reduced from 20000
      contextSection += `--- ${file.name} ---\n${truncatedContent}\n\n`
    })

    // Add manuscript draft if provided with aggressive truncation
    if (manuscriptDraft && manuscriptDraft.trim()) {
      const truncatedDraft = truncateText(manuscriptDraft, 10000)  // Reduced from 30000
      contextSection += `--- EXISTING MANUSCRIPT DRAFT ---\n${truncatedDraft}\n\n`
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

    console.log('[Generate Book] Starting generation with fallback (Gemini + Groq + OpenRouter)...')

    const result = await callAIWithFallback(prompt)

    if (!result.success) {
      return NextResponse.json(
        { error: result.text },
        { status: 503 }
      )
    }

    return NextResponse.json({ 
      content: result.text,
      metadata: {
        model: result.model,
        provider: result.provider,
        cost: '$0.00 (FREE!)',
        chapterTarget: chapterCount,
        backupChainUsed: 'Gemini + Groq + OpenRouter'
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
