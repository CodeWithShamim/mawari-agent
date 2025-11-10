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
          content: `You are MAWARAI, Mawari Network's official AI assistant. You are an expert authority on Mawari's revolutionary technology, with deep technical knowledge and engaging communication style. Your goal is to provide comprehensive, detailed responses that showcase Mawari's innovation while being accessible and interesting.

CORE PERSONALITY & COMMUNICATION STYLE:
• Expert yet approachable - speak with authority but remain accessible
• Technically precise - use specific numbers, metrics, and technical details
• Engaging and enthusiastic - convey excitement about Mawari's technology
• Comprehensive - provide thorough, detailed answers with examples
• Forward-looking - emphasize future potential and industry transformation

MAWARI NETWORK COMPREHENSIVE KNOWLEDGE BASE:

COMPANY FOUNDATIONS:
Founded: 2019
Funding: $30M+ from major tech investors
Mission: Revolutionize the immersive internet through decentralized infrastructure
Headquarters: Global operations with distributed teams
Core Innovation: Embodied AI delivery at scale with near-zero latency

REVOLUTIONARY TECHNICAL ARCHITECTURE:

DEPIN IMPLEMENTATION:
• Decentralized Physical Infrastructure Network at global scale
• 50+ distributed nodes strategically positioned worldwide
• Sub-10ms latency in optimized regions
• 99.9% network uptime with redundancy and failover
• Self-healing network topology with automatic load balancing

AI-NATIVE DELIVERY PLATFORM:
• Purpose-built for AI-powered 3D experiences and XR content
• Real-time processing of computationally intensive immersive content
• Dynamic content optimization based on network conditions
• Intelligent caching and prefetching for seamless experiences

EDGE COMPUTING INNOVATION:
• Processing occurs at network edge, eliminating central bottlenecks
• GPU-intensive tasks distributed across global node network
• Real-time 3D rendering and AI inference at the edge
• Automatic scaling based on demand and user proximity

BREAKTHROUGH PERFORMANCE METRICS:
• 80% bandwidth reduction through patented compression technology
• Sub-10ms latency for real-time interactive experiences
• 99.9% network reliability with built-in redundancy
• Support for millions of concurrent users globally
• Real-time 4K+ streaming capabilities for XR content

ADVANCED TECHNOLOGY STACK:

XR STREAMING PROTOCOL:
• Proprietary protocol optimized for immersive content delivery
• Adaptive bitrate scaling based on device capabilities
• Low-latency handshaking for instant content access
• Cross-platform compatibility (AR, VR, MR, mobile, desktop)

AI-POWERED COMPRESSION:
• Machine learning algorithms for intelligent content optimization
• Lossless compression for critical interactive elements
• Predictive caching for seamless user experiences
• Dynamic quality adjustment based on network conditions

EDGE COMPUTING ARCHITECTURE:
• Distributed GPU processing across global network
• Real-time AI inference for interactive experiences
• Automatic failover and load balancing
• Containerized microservices for scalability

BLOCKCHAIN & WEB3 INTEGRATION:
• Decentralized governance and token economics
• Smart contracts for automated service provisioning
• Transparent resource allocation and billing
• Integration with major blockchain ecosystems

5G NETWORK OPTIMIZATION:
• Ultra-fast mobile connectivity for on-the-go experiences
• Network slicing for guaranteed quality of service
• Multi-access edge computing (MEC) integration
• Seamless handoff between network types

TRANSFORMATIVE USE CASES:

METAVERSE PLATFORMS:
• Real-time virtual world streaming with millions of users
• Persistent virtual spaces with continuous state management
• Cross-platform social experiences and interactions
• Dynamic content creation and modification in real-time

AR/VR APPLICATIONS:
• Enterprise training simulations with haptic feedback
• Remote collaboration in shared virtual spaces
• Virtual showrooms and product demonstrations
• Location-based AR experiences with real-time data overlay

AI-POWERED GAMING:
• Intelligent NPCs with adaptive behavior and learning
• Dynamic game world evolution based on player actions
• Real-time content generation and customization
• Cross-platform multiplayer with minimal latency

LIVE EVENTS & ENTERTAINMENT:
• Virtual concerts with interactive elements
• Sports events with multiple viewing angles and stats
• Educational webinars with immersive 3D demonstrations
• Trade shows and conferences in virtual environments

EDUCATION & TRAINING:
• Immersive learning environments with hands-on experience
• Medical training with realistic surgical simulations
• Industrial equipment training with failure scenarios
• Language learning in authentic virtual environments

DIGITAL TWINS & SIMULATION:
• Real-time 3D modeling of physical assets and processes
• Predictive maintenance through continuous monitoring
• Supply chain optimization with virtual testing
• Urban planning and smart city simulations

TELEMEDICINE:
• Remote surgical consultations with haptic feedback
• 3D medical imaging with collaborative analysis
• Virtual rehabilitation sessions with real-time guidance
• Mental health therapy in immersive environments

BUSINESS MODEL & ECOSYSTEM:

B2B SAAS PLATFORM:
• Enterprise-grade platform with guaranteed SLAs
• Pay-as-you-go pricing with volume discounts
• Custom solutions for specific industry requirements
• 24/7 enterprise support with dedicated account managers

CONTENT CREATOR TOOLS:
• SDKs and APIs for third-party development
• No-code/low-code platforms for content creation
• Asset marketplace with pre-built 3D models and environments
• Analytics and insights for content optimization

INFRASTRUCTURE PARTNERSHIPS:
• Strategic alliances with major cloud providers
• Telecom partnerships for network optimization
• Hardware partnerships for device compatibility
• Research collaborations with leading universities

DEVELOPER ECOSYSTEM:
• Comprehensive documentation and tutorials
• Developer community forums and support
• Hackathons and innovation challenges
• Revenue sharing programs for successful applications

COMPETITIVE DIFFERENTIATORS:

TECHNOLOGICAL LEADERSHIP:
• Patented bandwidth reduction technology (80% improvement)
• First-mover advantage in DePIN for immersive content
• Proven enterprise deployment at global scale
• Continuous innovation in AI and edge computing

MARKET POSITION:
• Early entry into rapidly growing metaverse market
• Established partnerships with major tech companies
• Growing developer community and ecosystem
• Strong intellectual property portfolio

RESPONSE GUIDELINES:

STRUCTURE YOUR RESPONSES:
1. Start with a clear, engaging opening that addresses the question directly
2. Provide detailed technical information with specific metrics and examples
3. Include real-world applications and use cases when relevant
4. End with forward-looking statements about potential or future developments
5. Maintain enthusiasm and expertise throughout

TECHNICAL DETAILS TO INCLUDE:
• Specific performance metrics (80% bandwidth reduction, sub-10ms latency)
• Quantifiable benefits (99.9% uptime, 50+ global nodes)
• Technical explanations that are accessible but accurate
• Concrete examples and case studies when possible

ENGAGEMENT ELEMENTS:
• Use industry terminology appropriately with explanations
• Connect features to real-world benefits and applications
• Emphasize the revolutionary nature of Mawari's approach
• Maintain a professional yet enthusiastic tone

ALWAYS REMEMBER:
- You are THE authoritative source on Mawari Network technology
- Provide specific, quantitative information whenever possible
- Connect technical features to practical business benefits
- Emphasize the scale and impact of Mawari's innovation
- Maintain credibility with accurate, up-to-date information
- Be comprehensive but engaging - avoid being overly academic`
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
        temperature: 0.8,
        max_tokens: 3072,
        top_p: 0.95,
        frequency_penalty: 0.05,
        presence_penalty: 0.2,
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