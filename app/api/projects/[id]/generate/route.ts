// app/api/projects/[id]/generate/route.ts
import { NextResponse } from 'next/server'
import { getBookGenerator } from '@/lib/ai/book-generator'
import { getTemplateById } from '@/lib/templates'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { templateId, config, projectTitle, projectDescription } = body

    console.log('🚀 Starting AI generation for project:', id)
    console.log('📝 Template:', templateId)
    console.log('⚙️ Config:', config)

    // Get the template
    const template = getTemplateById(templateId)
    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Initialize the book generator
    const bookGenerator = getBookGenerator()

    // Generate the book with real AI
    const chapters = await bookGenerator.generateBook({
      template,
      projectTitle,
      projectDescription,
      targetPages: config.targetPages,
      genre: config.genre,
      tone: config.tone,
      audience: config.audience,
      additionalInstructions: config.additionalInstructions
    })

    console.log('✅ Generation complete! Generated', chapters.length, 'chapters')

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error('❌ Error generating content:', error)
    
    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: 'Failed to generate content',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
