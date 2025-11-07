// ROMA (Sentient AGI) integration service
// This service handles communication with the ROMA API for AI agent functionality

export interface ROMAMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ROMARequest {
  query: string
  context?: {
    conversation_history?: ROMAMessage[]
    user_preferences?: Record<string, any>
    current_session?: string
  }
}

export interface ROMAResponse {
  answer: string
  confidence: number
  sources?: string[]
  follow_up_questions?: string[]
  processing_time: number
}

class ROMAService {
  private baseUrl: string
  private apiKey: string
  private sessionId: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_ROMA_API_URL || 'http://localhost:8000'
    this.apiKey = process.env.ROMA_API_KEY || ''
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async initialize(): Promise<void> {
    try {
      // Test ROMA connection
      const response = await fetch(`${this.baseUrl}/health`)
      if (!response.ok) {
        throw new Error(`ROMA service unavailable: ${response.statusText}`)
      }
      console.log('ROMA service connected successfully')
    } catch (error) {
      console.error('Failed to connect to ROMA service:', error)
      throw error
    }
  }

  async askMawariAI(query: string, conversationHistory: ROMAMessage[] = []): Promise<ROMAResponse> {
    try {
      const requestPayload: ROMARequest = {
        query: `As a Mawari Network expert assistant, please answer this question: ${query}`,
        context: {
          conversation_history: conversationHistory,
          current_session: this.sessionId,
          user_preferences: {
            focus_areas: [
              'Mawari Network technology',
              'Decentralized infrastructure',
              'XR streaming',
              'AI-powered experiences',
              'Near-zero latency networking',
              'Global node deployment',
              'Bandwidth optimization',
              'Immersive internet'
            ]
          }
        }
      }

      const startTime = Date.now()

      const response = await fetch(`${this.baseUrl}/v1/agent/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Session-ID': this.sessionId,
        },
        body: JSON.stringify(requestPayload),
      })

      if (!response.ok) {
        throw new Error(`ROMA API error: ${response.statusText}`)
      }

      const data = await response.json()
      const processingTime = Date.now() - startTime

      return {
        answer: data.result || data.answer || 'I apologize, but I couldn\'t process your request at the moment.',
        confidence: data.confidence || 0.8,
        sources: data.sources || [],
        follow_up_questions: data.follow_up_questions || [],
        processing_time: processingTime,
      }
    } catch (error) {
      console.error('Error calling ROMA API:', error)

      // Fallback response when ROMA is unavailable
      return {
        answer: this.getFallbackResponse(query),
        confidence: 0.5,
        sources: ['Mawari Network Documentation'],
        follow_up_questions: [],
        processing_time: 0,
      }
    }
  }

  private getFallbackResponse(query: string): string {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('what is mawari')) {
      return 'Mawari Network is a decentralized platform that powers real-time streaming of immersive, AI-powered experiences globally with near-zero latency. Since 2019, they\'ve delivered embodied AI through a global network of nodes that reduce bandwidth usage by 80% and ensure 99.9% uptime for XR content streaming.'
    }

    if (lowerQuery.includes('depin')) {
      return 'Mawari uses DePIN (Decentralized Physical Infrastructure Networks) principles to build its AI and XR-native delivery platform for the 3D Internet. The network demands GPUs positioned close to users and requires distributed computing, storage, and ultra-low latency infrastructure.'
    }

    if (lowerQuery.includes('node')) {
      return 'Mawari\'s network consists of distributed nodes globally positioned to provide ultra-low latency processing for immersive experiences. These nodes handle GPU-intensive tasks, reducing bandwidth usage by 80% while ensuring 99.9% uptime for XR content streaming.'
    }

    return 'I\'m currently experiencing connectivity issues with my advanced AI services. However, I can tell you that Mawari Network is revolutionizing the immersive internet through decentralized infrastructure for real-time XR and AI experiences. For more detailed information, please visit mawari.net or check their official documentation.'
  }

  async resetSession(): Promise<void> {
    this.sessionId = this.generateSessionId()
  }

  getSessionId(): string {
    return this.sessionId
  }
}

export const romaService = new ROMAService()
export default ROMAService