// app/api/styles/test/route.ts
import { NextResponse } from 'next/server'
import { TEST_SCENARIOS } from '@/lib/style-profiles'

export async function POST(request: Request) {
  try {
    const { profile, scenarioId } = await request.json()

    console.log('🧪 Testing style:', profile.name, 'with scenario:', scenarioId)

    if (!profile) {
      return NextResponse.json(
        { error: 'Style profile is required' },
        { status: 400 }
      )
    }

    // Get the test scenario
    const scenario = TEST_SCENARIOS.find(s => s.id === scenarioId)
    if (!scenario) {
      return NextResponse.json(
        { error: 'Test scenario not found' },
        { status: 404 }
      )
    }

    // Build the style-aware prompt
    const prompt = buildStyleTestPrompt(profile, scenario)

    // Generate the test scene
    const { TextGenerator } = require('@/lib/ai/text-generator')
    const textGen = new TextGenerator()
    
    const content = await textGen.generate(prompt, {
      maxTokens: 2000,
      temperature: 0.8
    })

    console.log('✅ Test scene generated successfully')

    return NextResponse.json({
      content,
      profile: {
        name: profile.name,
        authorReference: profile.authorReference
      },
      scenario: {
        name: scenario.name,
        description: scenario.description
      }
    })
  } catch (error) {
    console.error('❌ Error generating test scene:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Failed to generate test scene',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

function buildStyleTestPrompt(profile: any, scenario: any): string {
  return `You are writing a test scene to demonstrate a specific writing style.

WRITING STYLE: ${profile.name}
${profile.authorReference ? `(Inspired by ${profile.authorReference})` : ''}

STYLE CHARACTERISTICS:
- Sentence Length: ${profile.characteristics.sentenceLength}
- Vocabulary: ${profile.characteristics.vocabulary}
- Pacing: ${profile.characteristics.pacing}
- Perspective: ${profile.characteristics.perspective}
- Tone: ${profile.characteristics.tone}

STYLE GUIDELINES:
${profile.guidelines}

DO THIS:
${profile.doThis.map((item: string) => `- ${item}`).join('\n')}

DON'T DO THIS:
${profile.dontDoThis.map((item: string) => `- ${item}`).join('\n')}

${profile.sampleText ? `\nREFERENCE SAMPLE:\n${profile.sampleText.substring(0, 500)}` : ''}

SCENE TO WRITE:
${scenario.name}: ${scenario.description}

SCENE PROMPT:
${scenario.prompt}

CRITICAL REQUIREMENTS:
- Write 800-1200 words
- STRICTLY follow the style guidelines above
- Match the tone, pacing, and vocabulary of the specified style
- This is a DEMONSTRATION of the style - make it clear and distinctive
- Write ONLY the scene content, no meta-commentary
- ${profile.characteristics.perspective.includes('first') ? 'Use first-person perspective (I, me, my)' : 'Use third-person perspective'}

Begin writing the scene NOW (content only, no preamble):`
}
