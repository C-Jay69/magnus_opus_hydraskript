// lib/ai/image-generator.ts
import * as fal from '@fal-ai/serverless-client'

export interface ImageGenerationOptions {
  prompt: string
  style?: 'realistic' | 'cartoon' | 'line-art' | 'watercolor'
  aspectRatio?: '1:1' | '16:9' | '9:16'
  numImages?: number
}

export class ImageGenerator {
  constructor() {
    if (process.env.FAL_API_KEY) {
      fal.config({
        credentials: process.env.FAL_API_KEY
      })
    }
  }

  async generate(options: ImageGenerationOptions): Promise<string[]> {
    const {
      prompt,
      style = 'realistic',
      aspectRatio = '1:1',
      numImages = 1
    } = options

    try {
      // Enhance prompt based on style
      const enhancedPrompt = this.enhancePrompt(prompt, style)

      const result = await fal.subscribe('fal-ai/flux/schnell', {
        input: {
          prompt: enhancedPrompt,
          image_size: aspectRatio === '1:1' ? 'square' : 
                      aspectRatio === '16:9' ? 'landscape_16_9' : 'portrait_9_16',
          num_images: numImages
        },
        logs: true
      }) as { images?: Array<{ url: string }> }

      // Extract image URLs
      const images = result.images?.map((img: any) => img.url) || []
      return images
    } catch (error) {
      console.error('FAL.ai generation error:', error)
      
      // Fallback to HuggingFace if FAL fails
      return await this.generateWithHuggingFace(options)
    }
  }

  private enhancePrompt(prompt: string, style: string): string {
    const styleEnhancements = {
      realistic: 'photorealistic, high quality, detailed',
      cartoon: 'cartoon style, vibrant colors, playful, illustrated',
      'line-art': 'simple line art, black and white, coloring book style, clean outlines, no shading',
      watercolor: 'watercolor painting, soft colors, artistic'
    }

    return `${prompt}, ${styleEnhancements[style as keyof typeof styleEnhancements] || ''}`
  }

  private async generateWithHuggingFace(options: ImageGenerationOptions): Promise<string[]> {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('No image generation API configured')
    }

    const enhancedPrompt = this.enhancePrompt(options.prompt, options.style || 'realistic')

    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: enhancedPrompt } )
      }
    )

    if (!response.ok) {
      throw new Error('Image generation failed')
    }

    const blob = await response.blob()
    
    // Convert blob to base64 data URL
    const buffer = await blob.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64}`
    
    return [dataUrl]
  }
}

// Singleton instance
let imageGenerator: ImageGenerator | null = null

export function getImageGenerator(): ImageGenerator {
  if (!imageGenerator) {
    imageGenerator = new ImageGenerator()
  }
  return imageGenerator
}
