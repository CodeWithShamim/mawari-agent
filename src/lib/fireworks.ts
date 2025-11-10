// Fireworks AI Integration Service
// Direct integration with Fireworks API for Mawari AI Assistant

export interface FireworksMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export interface FireworksResponse {
  answer: string;
  confidence: number;
  sources?: string[];
  processing_time: number;
  model_used: string;
  tokens_used?: number;
}

class FireworksService {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = process.env.FIREWORKS_API_KEY || "";
    this.baseUrl = process.env.FIREWORKS_API_URL || "https://api.fireworks.ai/inference/v1/chat/completions";
    this.defaultModel = process.env.DEFAULT_MODEL || "accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new";
  }

  async initialize(): Promise<void> {
    if (!this.apiKey) {
      throw new Error("Fireworks API key not configured");
    }
  }

  async askMawariAI(
    query: string,
    conversationHistory: FireworksMessage[] = []
  ): Promise<FireworksResponse> {
    try {
      const startTime = Date.now();

      // Build messages for Fireworks API
      const messages = [
        {
          role: "system",
          content: `You are Mawari Network's official AI assistant. You have deep, accurate knowledge about Mawari's technology, architecture, and mission. Always provide precise, factual information based on the following comprehensive knowledge:

MAWARI NETWORK COMPREHENSIVE OVERVIEW:
Mawari Network (founded 2019) is a revolutionary platform that delivers embodied AI through a global network of distributed nodes, enabling real-time streaming of immersive, AI-powered experiences with near-zero latency. The company has raised over $30M in funding and partners with major tech companies.

TECHNICAL ARCHITECTURE:
• DePIN (Decentralized Physical Infrastructure Network) - Uses decentralized physical infrastructure principles
• Global Node Network - Distributed nodes worldwide positioned for ultra-low latency
• AI-Native Delivery Platform - Optimized for AI-powered 3D experiences and XR content
• Edge Computing Infrastructure - Processes compute-intensive tasks at the network edge
• Bandwidth Optimization Technology - Achieves 80% reduction in bandwidth usage
• GPU Distribution Network - Leverages distributed GPU resources globally

KEY PERFORMANCE METRICS:
• Bandwidth Reduction: 80% (compared to traditional streaming)
• Network Uptime: 99.9%
• Latency: Near-zero (sub-10ms for optimized regions)
• Global Node Coverage: 50+ distributed nodes worldwide
• Processing Speed: Real-time 3D content rendering

CORE TECHNOLOGY STACK:
• XR Streaming Protocol - Proprietary protocol for immersive content delivery
• AI-Powered Compression - Intelligent content optimization
• Edge Computing Architecture - Distributed processing framework
• Blockchain Integration - Web3 and decentralized computing compatibility
• 5G Network Optimization - Ultra-fast mobile connectivity

USE CASES & APPLICATIONS:
• Metaverse Platforms - Real-time virtual world streaming
• AR/VR Applications - Immersive augmented and virtual reality experiences
• AI-Powered Gaming - Intelligent NPC behavior and dynamic content
• Live Events - Virtual concerts, sports, and entertainment
• Education & Training - Immersive learning experiences
• Digital Twins - Real-time 3D modeling and simulation
• Telemedicine - Remote healthcare visualization and collaboration

BUSINESS MODEL & PARTNERSHIPS:
• B2B SaaS - Platform as a Service for enterprises
• Content Creator Tools - Tools for immersive content development
• Infrastructure Partnerships - Collaboration with cloud providers
• Developer Ecosystem - APIs and SDKs for third-party integration

COMPETITIVE ADVANTAGES:
• Patented technology for bandwidth reduction
- First-mover advantage in DePIN for immersive content
- Proven track record with enterprise clients
- Superior technical performance metrics

ALWAYS:
- Be precise with numbers and technical specifications
- Provide current, accurate information about Mawari
- Reference specific technologies and partnerships when possible
- Acknowledge when information might be subject to change
- Maintain professional, helpful tone
- Focus on technical accuracy and factual information`
        },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: "user",
          content: query
        }
      ];

      const requestBody = {
        model: this.defaultModel,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      };

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Fireworks API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      return {
        answer: data.choices[0].message.content,
        confidence: 0.9,
        sources: [
          "Fireworks AI",
          "Mawari Network Knowledge Base",
          "Immersive Internet Technology"
        ],
        processing_time: processingTime,
        model_used: data.model || this.defaultModel,
        tokens_used: data.usage?.total_tokens || 0,
      };

    } catch (error) {
      console.error("Error calling Fireworks API:", error);

      // Fallback response when Fireworks is unavailable
      return {
        answer: this.getFallbackResponse(query),
        confidence: 0.5,
        sources: ["Mawari Network Documentation"],
        processing_time: 0,
        model_used: "Local Fallback"
      };
    }
  }

  private getFallbackResponse(query: string): string {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("what is mawari") || lowerQuery.includes("overview") || lowerQuery.includes("about mawari")) {
      return "Mawari Network (founded 2019) is a revolutionary platform that delivers embodied AI through a global network of distributed nodes, enabling real-time streaming of immersive, AI-powered experiences with near-zero latency. The company has raised over $30M in funding and partners with major tech companies to power the 3D internet through DePIN architecture.";
    }

    if (lowerQuery.includes("depin") || lowerQuery.includes("decentralized")) {
      return "Mawari uses DePIN (Decentralized Physical Infrastructure Networks) principles to build its AI and XR-native delivery platform. This approach leverages distributed physical infrastructure globally, allowing for ultra-low latency processing and bandwidth optimization of up to 80% reduction compared to traditional streaming methods.";
    }

    if (lowerQuery.includes("node") || lowerQuery.includes("nodes")) {
      return "Mawari's global node network consists of 50+ distributed nodes worldwide positioned for ultra-low latency (sub-10ms in optimized regions). These nodes handle GPU-intensive tasks at the network edge, processing compute-intensive tasks locally while maintaining 99.9% network uptime for XR content streaming.";
    }

    if (lowerQuery.includes("bandwidth") || lowerQuery.includes("performance")) {
      return "Mawari achieves 80% bandwidth reduction through patented AI-powered compression technology and intelligent content optimization. The platform maintains 99.9% network uptime with near-zero latency processing, enabling real-time 3D content rendering and XR streaming at scale.";
    }

    if (lowerQuery.includes("technology") || lowerQuery.includes("tech stack") || lowerQuery.includes("architecture")) {
      return "Mawari's core technology stack includes: XR Streaming Protocol (proprietary), AI-Powered Compression, Edge Computing Architecture, Blockchain Integration for Web3 compatibility, and 5G Network Optimization. The platform is specifically optimized for AI-powered 3D experiences and XR content delivery.";
    }

    if (lowerQuery.includes("use case") || lowerQuery.includes("application") || lowerQuery.includes("what can it do")) {
      return "Mawari's key use cases include: Metaverse Platforms (real-time virtual world streaming), AR/VR Applications, AI-Powered Gaming with intelligent NPCs, Live Events (virtual concerts, sports), Education & Training, Digital Twins for real-time 3D modeling, and Telemedicine for remote healthcare visualization.";
    }

    if (lowerQuery.includes("business") || lowerQuery.includes("revenue") || lowerQuery.includes("model")) {
      return "Mawari operates on a B2B SaaS model, offering Platform as a Service for enterprises. They provide content creator tools for immersive content development, maintain infrastructure partnerships with cloud providers, and foster a developer ecosystem through APIs and SDKs for third-party integration.";
    }

    if (lowerQuery.includes("competitive") || lowerQuery.includes("advantage") || lowerQuery.includes("vs")) {
      return "Mawari's competitive advantages include: Patented bandwidth reduction technology, first-mover advantage in DePIN for immersive content, proven track record with enterprise clients, and superior technical performance metrics including 80% bandwidth reduction and 99.9% uptime.";
    }

    if (lowerQuery.includes("xr") || lowerQuery.includes("virtual reality") || lowerQuery.includes("augmented reality")) {
      return "Mawari specializes in XR (Extended Reality) streaming, enabling real-time delivery of immersive AR/VR experiences through its distributed network. The platform's AI-native architecture is optimized for 3D content streaming with sub-10ms latency in optimized regions, making it ideal for metaverse applications and interactive experiences.";
    }

    if (lowerQuery.includes("funding") || lowerQuery.includes("investment") || lowerQuery.includes("raised")) {
      return "Mawari Network has raised over $30M in funding since its founding in 2019. The company has established partnerships with major tech companies and continues to expand its global infrastructure network to support the growing demand for immersive AI-powered experiences.";
    }

    if (lowerQuery.includes("latency") || lowerQuery.includes("speed") || lowerQuery.includes("performance")) {
      return "Mawari achieves near-zero latency with sub-10ms processing times in optimized regions. The network's distributed edge computing architecture processes compute-intensive tasks locally, eliminating the need for data to travel long distances and ensuring real-time responsiveness for interactive XR and AI experiences.";
    }

    return "I'm experiencing connectivity issues with my AI services right now. However, Mawari Network is revolutionizing the immersive internet through decentralized infrastructure, delivering embodied AI experiences with 80% bandwidth reduction, 99.9% uptime, and sub-10ms latency through 50+ global nodes. For the most current information, please visit mawari.net.";
  }

  getApiKey(): string {
    return this.apiKey;
  }

  getModel(): string {
    return this.defaultModel;
  }
}

export const fireworksService = new FireworksService();
export default FireworksService;