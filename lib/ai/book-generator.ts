// lib/ai/book-generator.ts
import { getTextGenerator } from './text-generator'
import { getImageGenerator } from './image-generator'
import { BookTemplate } from '../templates'

export interface Chapter {
  chapterNumber: number
  title: string
  content: string
  imageUrl?: string
  status: 'completed' | 'generating' | 'pending'
}

export interface BookGenerationConfig {
  template: BookTemplate
  projectTitle: string
  projectDescription: string
  targetPages: number
  genre: string
  tone: string
  audience: string
  additionalInstructions?: string
}

export class BookGenerator {
  private textGen = getTextGenerator()
  private imageGen = getImageGenerator()

    async generateBook(config: BookGenerationConfig): Promise<Chapter[]> {
    // Better chapter calculation: aim for 3000-5000 words per chapter
    const wordsPerPage = 250
    const totalWords = config.targetPages * wordsPerPage
    const wordsPerChapter = 3500 // Target 3500 words per chapter
    const numChapters = Math.max(3, Math.ceil(totalWords / wordsPerChapter))
    
    const chapters: Chapter[] = []

    console.log(`Generating ${numChapters} chapters for "${config.projectTitle}"`)
    console.log(`Target: ${config.targetPages} pages (~${totalWords} words total)`)
    console.log(`~${Math.floor(totalWords / numChapters)} words per chapter`)

    // Generate chapters sequentially
    for (let i = 1; i <= numChapters; i++) {
      const chapter = await this.generateChapter(i, numChapters, config)
      chapters.push(chapter)
    }

    return chapters
  }


  private async generateChapter(
    chapterNum: number,
    totalChapters: number,
    config: BookGenerationConfig
  ): Promise<Chapter> {
    console.log(`Generating chapter ${chapterNum}/${totalChapters}`)

    // Build the prompt for this chapter
    const prompt = this.buildChapterPrompt(chapterNum, totalChapters, config)

    // Generate chapter content
    const content = await this.textGen.generate(prompt, {
  maxTokens: 4000,  // Increased from 2000 to 4000
  temperature: 0.7
})


    // Generate chapter title from content
    const titlePrompt = `Based on this chapter content, generate a compelling chapter title (just the title, nothing else):\n\n${content.substring(0, 500)}`
    const title = await this.textGen.generate(titlePrompt, {
      maxTokens: 50,
      temperature: 0.5
    })

    const chapter: Chapter = {
      chapterNumber: chapterNum,
      title: title.trim().replace(/^["']|["']$/g, ''), // Remove quotes
      content: content,
      status: 'completed'
    }

    // Generate image if template supports it
    if (config.template.features.imageGeneration) {
      try {
        const imageStyle = config.template.id === 'coloring' ? 'line-art' : 'cartoon'
        const imagePrompt = await this.generateImagePrompt(content, config)
        
        const images = await this.imageGen.generate({
          prompt: imagePrompt,
          style: imageStyle,
          numImages: 1
        })

        if (images.length > 0) {
          chapter.imageUrl = images[0]
        }
      } catch (error) {
        console.error('Image generation failed for chapter', chapterNum, error)
      }
    }

    return chapter
  }

      private buildChapterPrompt(
    chapterNum: number,
    totalChapters: number,
    config: BookGenerationConfig
  ): string {
    const { template, projectTitle, projectDescription, genre, tone, audience, additionalInstructions } = config

    // Calculate target words per chapter (roughly 250 words per page)
    const wordsPerPage = 250
    const totalWords = config.targetPages * wordsPerPage
    const wordsPerChapter = Math.floor(totalWords / totalChapters)

    // Determine if we're in the final act (last 30%)
    const isFinalAct = chapterNum > (totalChapters * 0.7)
    const isOpening = chapterNum <= 2
    const isMiddle = !isOpening && !isFinalAct

    return `You are writing Chapter ${chapterNum} of ${totalChapters} for a ${genre} book titled "${projectTitle}".

Book Description: ${projectDescription}
Target Audience: ${audience}
Writing Tone: ${tone}
Template Style: ${template.structureContext}
${additionalInstructions ? `\nAdditional Context:\n${additionalInstructions}` : ''}

CRITICAL WRITING REQUIREMENTS:
- Write EXACTLY ${wordsPerChapter} words (minimum ${Math.floor(wordsPerChapter * 0.8)} words)
- Write ONLY the chapter content - NO meta-commentary
- Do NOT explain what you're going to write
- Do NOT include phrases like "Here's chapter..." or "I will write..."

ANTI-REPETITION RULES (CRITICAL):
❌ Do NOT repeat thematic realizations from previous chapters
❌ Do NOT restate insights that have already been revealed
❌ Do NOT use the same paragraph rhythm more than twice in this chapter
❌ Do NOT cycle through variations of the same conceptual beat
✅ Each scene must introduce NEW information or consequences
✅ Vary sentence length aggressively during high-tension moments
✅ Break symmetry - avoid predictable patterns

${isFinalAct ? `
FINAL ACT REQUIREMENTS (YOU ARE IN THE LAST 30%):
🔥 This chapter MUST introduce at least ONE new factual revelation, betrayal, or irreversible action
🔥 Do NOT repeat earlier realizations - ESCALATE consequences instead
🔥 Focus on ACTION and CHANGE, not reflection or restatement
🔥 Every paragraph must push the story FORWARD, not circle back
🔥 Avoid phrases like "they realized," "it was clear," "the truth was" - SHOW don't tell
` : ''}

${isOpening ? `
OPENING CHAPTER REQUIREMENTS:
🎯 Start with a compelling hook that draws readers in immediately
🎯 Establish setting, character, and conflict quickly
🎯 Create questions that demand answers
` : ''}

${isMiddle ? `
MIDDLE CHAPTER REQUIREMENTS:
⚡ Deepen conflict and raise stakes
⚡ Introduce complications or new obstacles
⚡ Build tension toward the climax
` : ''}

${chapterNum === totalChapters ? `
FINAL CHAPTER REQUIREMENTS:
🏁 Provide a satisfying conclusion
🏁 Resolve major plot threads
🏁 Leave the reader with a powerful final image or thought
🏁 NO recycled insights - only NEW resolutions
` : `
CHAPTER ENDING:
🎣 End with a hook or cliffhanger that makes readers want to continue
🎣 Introduce a question, complication, or surprise
`}

RHYTHM VARIATION:
Mix short punchy sentences with longer flowing ones.
Avoid repeating the same sentence structure more than twice.
Break up "Short. Short. Reflection." patterns with unexpected rhythms.

TARGET WORD COUNT: ${wordsPerChapter} words

Chapter ${chapterNum} begins NOW (pure story content, no preamble):`
  }



  private async generateImagePrompt(content: string, config: BookGenerationConfig): Promise<string> {
    const prompt = `Based on this chapter content, create a vivid image description for an illustration (one sentence, descriptive, suitable for ${config.audience}):\n\n${content.substring(0, 500)}`
    
    const imagePrompt = await this.textGen.generate(prompt, {
      maxTokens: 100,
      temperature: 0.7
    })

    return imagePrompt.trim()
  }
}

// Singleton instance
let bookGenerator: BookGenerator | null = null

export function getBookGenerator(): BookGenerator {
  if (!bookGenerator) {
    bookGenerator = new BookGenerator()
  }
  return bookGenerator
}
