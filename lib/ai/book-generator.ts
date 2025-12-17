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
    const numChapters = Math.ceil(config.targetPages / 20) // ~20 pages per chapter
    const chapters: Chapter[] = []

    console.log(`Generating ${numChapters} chapters for "${config.projectTitle}"`)

    // Generate chapters sequentially (can be parallelized later)
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
      maxTokens: 2000,
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

    return `You are writing Chapter ${chapterNum} of ${totalChapters} for a ${genre} book titled "${projectTitle}".

Book Description: ${projectDescription}
Target Audience: ${audience}
Writing Tone: ${tone}
Template Style: ${template.structureContext}
${additionalInstructions ? `\nAdditional Context:\n${additionalInstructions}` : ''}

IMPORTANT INSTRUCTIONS:
- Write ONLY the chapter content, no meta-commentary
- Do NOT explain what you're going to write
- Do NOT include phrases like "Here's chapter..." or "I will write..."
- Write 1500-2000 words of actual story content
- Use vivid descriptions and engaging dialogue
- ${chapterNum === 1 ? 'Start with a compelling hook that draws readers in immediately.' : ''}
- ${chapterNum === totalChapters ? 'Provide a satisfying conclusion to the story.' : 'End with a hook that makes readers want to continue.'}

Begin writing Chapter ${chapterNum} NOW (content only):`
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
