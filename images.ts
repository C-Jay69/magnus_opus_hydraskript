import { generateRandomId } from './utils'

// Configuration from environment variables
const config = {
  falAi: {
    apiKey: process.env.FAL_AI_API_KEY,
    baseUrl: 'https://fal.run',
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.RETRY_DELAY_MS || '5000'),
    timeout: parseInt(process.env.REQUEST_TIMEOUT_MS || '60000'),
  },
  // Available FAL.ai models
  models: {
    coverArt: 'fal-ai/fast-sdxl',
    chapterArt: 'fal-ai/fast-sdxl',
    characterPortraits: 'fal-ai/flux',
    sceneIllustrations: 'fal-ai/flux',
  },
  // Default parameters
  defaultParams: {
    image_size: '1024x1024',
    num_images: 1,
    guidance_scale: 7.5,
    num_inference_steps: 30,
  }
}

class ImageGenerationClient {
  private activeRequests: number
  private requestQueue: Array<{ resolve: Function, reject: Function }>

  constructor() {
    this.activeRequests = 0
    this.requestQueue = []
  }

  private async rateLimitRequest() {
    const maxConcurrent = parseInt(process.env.MAX_CONCURRENT_REQUESTS || '2')
    
    if (this.activeRequests < maxConcurrent) {
      this.activeRequests++
      return { proceed: true }
    }

    return new Promise<{ proceed: boolean }>((resolve) => {
      this.requestQueue.push({ resolve, reject: () => {} })
      
      const interval = setInterval(() => {
        if (this.activeRequests < maxConcurrent && this.requestQueue.length > 0) {
          clearInterval(interval)
          const next = this.requestQueue.shift()!
          this.activeRequests++
          next.resolve({ proceed: true })
        }
      }, 100)
    })
  }

  private releaseRequest() {
    this.activeRequests--
    if (this.requestQueue.length > 0) {
      const next = this.requestQueue.shift()!
      this.activeRequests++
      next.resolve({ proceed: true })
    }
  }

  private async makeRequest(
    endpoint: string,
    payload: any,
    attempt: number = 1
  ): Promise<{
    success: boolean
    data?: any
    requestId: string
    responseTime: number
    error?: string
  }> {
    const requestId = generateRandomId('img')
    const startTime = Date.now()

    try {
      await this.rateLimitRequest()

      const response = await axios.post(
        `${config.falAi.baseUrl}/${endpoint}`,
        payload,
        {
          headers: {
            'Authorization': `Key ${config.falAi.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: config.falAi.timeout,
        }
      )

      const endTime = Date.now()
      const responseTime = endTime - startTime
