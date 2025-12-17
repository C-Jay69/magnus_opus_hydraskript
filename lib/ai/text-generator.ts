// lib/ai/text-generator.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

export type AIProvider = 'gemini' | 'openrouter' | 'huggingface'

export interface GenerationOptions {
  provider?: AIProvider
  maxTokens?: number
  temperature?: number
}

export class TextGenerator {
  private gemini: GoogleGenerativeAI | null = null
  private openrouter: OpenAI | null = null

  constructor() {
    // Initialize Gemini
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    }

    // Initialize OpenRouter (uses OpenAI SDK)
    if (process.env.OPENROUTER_API_KEY) {
      this.openrouter = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1'
      } )
    }
  }

  async generate(
    prompt: string,
    options: GenerationOptions = {}
  ): Promise<string> {
    const {
      provider = (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'gemini',
      maxTokens = 2000,
      temperature = 0.7
    } = options

    try {
      // Try primary provider
      return await this.generateWithProvider(prompt, provider, maxTokens, temperature)
    } catch (error) {
      console.error(`Error with ${provider}, trying fallback...`, error)
      
      // Try fallback providers
      const fallbacks: AIProvider[] = ['gemini', 'openrouter', 'huggingface']
      for (const fallback of fallbacks) {
        if (fallback !== provider) {
          try {
            return await this.generateWithProvider(prompt, fallback, maxTokens, temperature)
          } catch (fallbackError) {
            console.error(`Fallback ${fallback} also failed`, fallbackError)
          }
        }
      }

      throw new Error('All AI providers failed')
    }
  }

  private async generateWithProvider(
    prompt: string,
    provider: AIProvider,
    maxTokens: number,
    temperature: number
  ): Promise<string> {
    switch (provider) {
      case 'gemini':
        return await this.generateWithGemini(prompt, maxTokens, temperature)
      
      case 'openrouter':
        return await this.generateWithOpenRouter(prompt, maxTokens, temperature)
      
      case 'huggingface':
        return await this.generateWithHuggingFace(prompt, maxTokens, temperature)
      
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  private async generateWithGemini(
    prompt: string,
    maxTokens: number,
    temperature: number
  ): Promise<string> {
    if (!this.gemini) {
      throw new Error('Gemini not configured')
    }

    const model = this.gemini.getGenerativeModel({ 
      model: 'gemini-1.5-flash',

      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature
      }
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  }

  private async generateWithOpenRouter(
    prompt: string,
    maxTokens: number,
    temperature: number
  ): Promise<string> {
    if (!this.openrouter) {
      throw new Error('OpenRouter not configured')
    }

    const completion = await this.openrouter.chat.completions.create({
      model: 'meta-llama/llama-3.2-3b-instruct:free', // Free model
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature
    })

    return completion.choices[0]?.message?.content || ''
  }

  private async generateWithHuggingFace(
    prompt: string,
    maxTokens: number,
    temperature: number
  ): Promise<string> {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('HuggingFace not configured')
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/google/flan-t5-large',

      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: maxTokens,
            temperature: temperature,
            return_full_text: false
          }
        } )
      }
    )

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data[0]?.generated_text || ''
  }
}

// Singleton instance
let textGenerator: TextGenerator | null = null

export function getTextGenerator(): TextGenerator {
  if (!textGenerator) {
    textGenerator = new TextGenerator()
  }
  return textGenerator
}
