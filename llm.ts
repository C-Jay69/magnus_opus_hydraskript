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
const preferredModel = (process.env.OPENROUTER_PREFERRED_MODEL || '').trim()
const defaultFallbackModels = [
  'openrouter/auto',
  'mistralai/mistral-7b-instruct',
  'huggingfaceh4/zephyr-7b-beta',
  'google/gemini-flash-1.5',
  'deepseek/deepseek-chat',
]
const fallbackModelList = preferredModel
  ? [preferredModel, ...defaultFallbackModels.filter(m => m !== preferredModel)]
  : defaultFallbackModels

const config = {
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1',
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.RETRY_DELAY_MS || '5000'),
    timeout: parseInt(process.env.REQUEST_TIMEOUT_MS || '30000'),
  },
  // Groq provider configuration
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: 'https://api.groq.com/openai/v1',
    model: (process.env.GROQ_PREFERRED_MODEL || '').trim(),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.RETRY_DELAY_MS || '5000'),
    timeout: parseInt(process.env.REQUEST_TIMEOUT_MS || '30000'),
  },
  // Fallback models in order of preference
  fallbackModels: fallbackModelList,
  // Rate limiting
  maxConcurrentRequests: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '3'),
  requestQueue: [] as Array<{ resolve: Function, reject: Function }>,
  activeRequests: 0,
  // Mock fallback when all models fail (helps dev/demo when free models are unavailable)
  mockOnFailure: (process.env.LLM_ENABLE_MOCK_ON_FAILURE || 'true').toLowerCase() !== 'false',
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

      const status = error?.response?.status
      const payload = error?.response?.data
      console.error(`[LLM] ${requestId} - ${model} - ${responseTime}ms - Error:`, error.message, status ? `(status ${status})` : '', payload ? `payload: ${JSON.stringify(payload)}` : '')

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

  // Groq request path
  private async makeGroqRequest(prompt: string, model: string, attempt: number = 1): Promise<any> {
    const requestId = generateRandomId('llm')
    const startTime = Date.now()

    try {
      await rateLimitRequest()

      const response = await axios.post(
        `${config.groq.baseUrl}/chat/completions`,
        {
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: Number(process.env.GROQ_MAX_TOKENS || 1024),
          stream: false,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.groq.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: config.groq.timeout,
        }
      )

      const endTime = Date.now()
      const responseTime = endTime - startTime
      console.log(`[LLM] ${requestId} - groq/${model} - ${responseTime}ms - Success`)

      return {
        success: true,
        model: `groq/${model}`,
        response: response.data,
        requestId,
        responseTime,
        tokensUsed: response.data.usage?.total_tokens || 0,
      }
    } catch (error: any) {
      const endTime = Date.now()
      const responseTime = endTime - startTime
      const status = error?.response?.status
      const payload = error?.response?.data
      console.error(`[LLM] ${requestId} - groq/${model} - ${responseTime}ms - Error:`, error.message, status ? `(status ${status})` : '', payload ? `payload: ${JSON.stringify(payload)}` : '')

      if (error.response) {
        if (error.response.status === 429 && attempt < config.groq.maxRetries) {
          console.log(`[LLM] Groq rate limited, retrying (${attempt}/${config.groq.maxRetries})...`)
          await new Promise(resolve => setTimeout(resolve, config.groq.retryDelay))
          return this.makeGroqRequest(prompt, model, attempt + 1)
        }
        if (error.response.status === 401) {
          throw new Error('Groq API key is invalid or expired')
        }
      }

      if (attempt < config.groq.maxRetries) {
        console.log(`[LLM] Groq network error, retrying (${attempt}/${config.groq.maxRetries})...`)
        await new Promise(resolve => setTimeout(resolve, config.groq.retryDelay))
        return this.makeGroqRequest(prompt, model, attempt + 1)
      }

      throw new Error(`All attempts failed for Groq model ${model}: ${error.message}`)
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
      // Try Groq first if configured
      if (config.groq.apiKey && config.groq.model) {
        try {
          const groqResult = await this.makeGroqRequest(prompt, config.groq.model)
          if (groqResult?.success) {
            const text = groqResult.response.choices[0].message.content
            return {
              success: true,
              text,
              model: groqResult.model,
              requestId: groqResult.requestId,
              tokensUsed: groqResult.tokensUsed,
              responseTime: groqResult.responseTime,
            }
          }
        } catch (e: any) {
          console.warn('[LLM] Groq attempt failed, falling back to OpenRouter:', e?.message)
        }
      }

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

      if (config.mockOnFailure) {
        const mockText = `Mock analysis (offline/fallback)\n\nYour request could not be fulfilled by any OpenRouter free models available to this API key right now.\n\nWhat you can do next:\n- Try again later (availability changes).\n- Set OPENROUTER_PREFERRED_MODEL in your .env to a model allowed to your key.\n- Upgrade key access or enable a provider with free quota.\n\nSummary of the manuscript (approximate prompts-only analysis):\n- The system received a prompt of length ~${prompt.length} characters.\n- Mode-specific guidance was applied.\n\nNote: This is a placeholder to keep the UI responsive during development.`
        return {
          success: true,
          text: mockText,
          model: 'mock-local',
          requestId: generateRandomId('llm'),
          tokensUsed: 0,
          responseTime: 0,
        }
      }

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