import axios from 'axios'
import { generateRandomId } from './utils'

// Type definitions
export type LLMGenerationResult = {
  success: boolean
  text: string
  model: string
  requestId: string
  tokensUsed: number
  responseTime: number
}

export type LLMOutlineResult = {
  success: boolean
  outline: any
  model: string
  requestId: string
}

export type LLMChapterResult = {
  success: boolean
  chapterText: string
  wordCount: number
  model: string
  requestId: string
}

export type LLMModelInfo = {
  currentModel: string
  availableModels: string[]
  failedModels: string[]
}

// Configuration from environment variables
const config = {
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.RETRY_DELAY_MS || '5000'),
    timeout: parseInt(process.env.REQUEST_TIMEOUT_MS || '30000'),
  },
  // Fallback models in order of preference
  fallbackModels: [
    'x-ai/grok-2',
    'liquid/lfm-40b',
    'mistralai/mistral-7b-instruct:free',
    'huggingfaceh4/zephyr-7b-beta:free',
    'nousresearch/nous-hermes-2-mistral-7b-dpo:free'
  ],
  // Rate limiting
  maxConcurrentRequests: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '3'),
  requestQueue: [] as Array<{ resolve: Function, reject: Function }>,
  activeRequests: 0,
}

// Rate limiter function
async function rateLimitRequest() {
  if (config.activeRequests < config.maxConcurrentRequests) {
    config.activeRequests++
    return { proceed: true }
  }

  return new Promise<{ proceed: boolean }>((resolve) => {
    config.requestQueue.push({ resolve, reject: () => {} })
    
    // Check queue periodically
    const interval = setInterval(() => {
      if (config.activeRequests < config.maxConcurrentRequests && config.requestQueue.length > 0) {
        clearInterval(interval)
        const next = config.requestQueue.shift()!
        config.activeRequests++
        next.resolve({ proceed: true })
      }
    }, 100)
  })
}

function releaseRequest() {
  config.activeRequests--
  if (config.requestQueue.length > 0) {
    const next = config.requestQueue.shift()!
    config.activeRequests++
    next.resolve({ proceed: true })
  }
}

// API Client class
class LLMClient {
  private currentModelIndex: number
  private failedModels: Set<string>

  constructor() {
    this.currentModelIndex = 0
    this.failedModels = new Set()
  }

  private getCurrentModel(): string {
    // Skip failed models
    let attempts = 0
    while (attempts < config.fallbackModels.length) {
      const model = config.fallbackModels[this.currentModelIndex]
      if (!this.failedModels.has(model)) {
        return model
      }
      this.currentModelIndex = (this.currentModelIndex + 1) % config.fallbackModels.length
      attempts++
    }
    throw new Error('All models have failed')
  }

  private async makeRequest(prompt: string, model: string, attempt: number = 1): Promise<any> {
    const requestId = generateRandomId('llm')
    const startTime = Date.now()

    try {
      // Apply rate limiting
      await rateLimitRequest()

      const response = await axios.post(
        `${config.openRouter.baseUrl}/chat/completions`,
        {
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4096,
          stream: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.openRouter.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL,
            'X-Title': process.env.NEXT_PUBLIC_APP_NAME,
          },
          timeout: config.openRouter.timeout,
        }
      )

      const endTime = Date.now()
      const responseTime = endTime - startTime

      // Log API usage
      console.log(`[LLM] ${requestId} - ${model} - ${responseTime}ms - Success`)

      return {
        success: true,
        model,
        response: response.data,
        requestId,
        responseTime,
        tokensUsed: response.data.usage?.total_tokens || 0,
      }
    } catch (error: any) {
      const endTime = Date.now()
      const responseTime = endTime - startTime

      console.error(`[LLM] ${requestId} - ${model} - ${responseTime}ms - Error:`, error.message)

      // Handle specific errors
      if (error.response) {
        // Rate limit error
        if (error.response.status === 429) {
          if (attempt < config.openRouter.maxRetries) {
            console.log(`[LLM] Rate limited, retrying (${attempt}/${config.openRouter.maxRetries})...`)
            await new Promise(resolve => setTimeout(resolve, config.openRouter.retryDelay))
            return this.makeRequest(prompt, model, attempt + 1)
          } else {
            // Mark this model as failed and try next one
            this.failedModels.add(model)
            console.log(`[LLM] Model ${model} failed after retries, switching to next model`)
            
            if (this.failedModels.size < config.fallbackModels.length) {
              this.currentModelIndex = (this.currentModelIndex + 1) % config.fallbackModels.length
              const nextModel = this.getCurrentModel()
              return this.makeRequest(prompt, nextModel, 1)
            }
          }
        }
        
        // Authentication error
        if (error.response.status === 401) {
          throw new Error('OpenRouter API key is invalid or expired')
        }
        
        // Model not available
        if (error.response.status === 404) {
          this.failedModels.add(model)
          console.log(`[LLM] Model ${model} not available, switching to next model`)
          
          if (this.failedModels.size < config.fallbackModels.length) {
            this.currentModelIndex = (this.currentModelIndex + 1) % config.fallbackModels.length
            const nextModel = this.getCurrentModel()
            return this.makeRequest(prompt, nextModel, 1)
          }
        }
      }

      // Network error or other issues
      if (attempt < config.openRouter.maxRetries) {
        console.log(`[LLM] Network error, retrying (${attempt}/${config.openRouter.maxRetries})...`)
        await new Promise(resolve => setTimeout(resolve, config.openRouter.retryDelay))
        return this.makeRequest(prompt, model, attempt + 1)
      }

      throw new Error(`All attempts failed for model ${model}: ${error.message}`)
    } finally {
      releaseRequest()
    }
  }

  async generateText(prompt: string, options: {
    maxTokens?: number,
    temperature?: number,
    modelPreference?: string
  } = {}): Promise<{
    success: boolean
    text: string
    model: string
    requestId: string
    tokensUsed: number
    responseTime: number
  }> {
    try {
      // Use preferred model if specified
      const model = options.modelPreference 
        ? (config.fallbackModels.includes(options.modelPreference) ? options.modelPreference : this.getCurrentModel())
        : this.getCurrentModel()

      const result = await this.makeRequest(prompt, model)

      if (!result.success) {
        throw new Error('Request failed after retries')
      }

      const text = result.response.choices[0].message.content

      return {
        success: true,
        text,
        model: result.model,
        requestId: result.requestId,
        tokensUsed: result.tokensUsed,
        responseTime: result.responseTime,
      }
    } catch (error: any) {
      console.error('[LLM] Generation failed:', error.message)
      return {
        success: false,
        text: '',
        model: this.getCurrentModel(),
        requestId: generateRandomId('llm'),
        tokensUsed: 0,
        responseTime: 0,
      }
    }
  }

  async generateOutline(bookConcept: string): Promise<{
    success: boolean
    outline: any
    model: string
    requestId: string
  }> {
    const outlinePrompt = `
      You are a professional book outliner. Create a detailed outline for a book about: "${bookConcept}"
      
      Requirements:
      - The book should be 90-150 pages long
      - Create 15-20 chapters
      - Each chapter should have 3-5 detailed scenes
      - Include character development arcs
      - Ensure logical progression
      - Output as valid JSON with this structure:
      {
        "title": "Book Title",
        "description": "Book description",
        "genre": "Book genre",
        "length": "estimated page count",
        "chapters": [
          {
            "title": "Chapter Title",
            "description": "Chapter summary",
            "scenes": [
              {
                "title": "Scene Title",
                "description": "Scene details",
                "purpose": "Scene purpose"
              }
            ]
          }
        ]
      }
      
      Be creative but maintain logical structure. Ensure the outline can support a full-length book.
    `

    try {
      const result = await this.generateText(outlinePrompt)

      if (!result.success) {
        return { success: false, outline: null, model: result.model, requestId: result.requestId }
      }

      // Parse the JSON response
      try {
        const outline = JSON.parse(result.text)
        return { success: true, outline, model: result.model, requestId: result.requestId }
      } catch (parseError) {
        console.error('[LLM] Failed to parse outline JSON:', parseError)
        return { success: false, outline: null, model: result.model, requestId: result.requestId }
      }
    } catch (error) {
      console.error('[LLM] Outline generation failed:', error)
      return { success: false, outline: null, model: this.getCurrentModel(), requestId: generateRandomId('llm') }
    }
  }

  async generateChapter(
    chapterOutline: string,
    previousChapterSummary: string,
    nextChapterOutline: string,
    bookContext: string
  ): Promise<{
    success: boolean
    chapterText: string
    wordCount: number
    model: string
    requestId: string
  }> {
    const chapterPrompt = `
      You are writing a chapter for a book. Here's the context:
      
      Book Context: ${bookContext}
      
      Previous Chapter Summary: ${previousChapterSummary}
      
      Current Chapter Outline: ${chapterOutline}
      
      Next Chapter Outline: ${nextChapterOutline}
      
      Requirements:
      - Write a complete chapter (2,000-5,000 words)
      - Maintain consistency with previous chapters
      - Set up the next chapter appropriately
      - Include sensory details and emotional depth
      - Use professional writing style
      - Output in Markdown format with proper headings
      - Ensure character names and details remain consistent
      - Do not rush the ending
      
      Write the full chapter content below:
    `

    try {
      const result = await this.generateText(chapterPrompt, { maxTokens: 8192 })

      if (!result.success) {
        return { success: false, chapterText: '', wordCount: 0, model: result.model, requestId: result.requestId }
      }

      const wordCount = result.text.split(/\s+/).length

      return {
        success: true,
        chapterText: result.text,
        wordCount,
        model: result.model,
        requestId: result.requestId
      }
    } catch (error) {
      console.error('[LLM] Chapter generation failed:', error)
      return { success: false, chapterText: '', wordCount: 0, model: this.getCurrentModel(), requestId: generateRandomId('llm') }
    }
  }

  // Get current model information
  getCurrentModelInfo() {
    return {
      currentModel: this.getCurrentModel(),
      availableModels: config.fallbackModels.filter(model => !this.failedModels.has(model)),
      failedModels: Array.from(this.failedModels),
    }
  }

  // Reset failed models (useful if models come back online)
  resetFailedModels() {
    this.failedModels.clear()
  }
}

// Singleton instance
const llmClient = new LLMClient()

export default llmClient