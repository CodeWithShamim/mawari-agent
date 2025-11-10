# Mawari AI Agent 🤖

A sophisticated AI-powered dashboard for Mawari Network, built with Next.js 15, TypeScript, and Fireworks AI. This application serves as an intelligent gateway to the immersive internet, providing real-time insights, community engagement, and AI assistance powered by the advanced Dobby Unhinged Llama 3.3 70B model.

## 🌟 Features

### AI-Powered Assistant
- **Fireworks AI Integration**: Powered by Sentient Foundation's Dobby Unhinged Llama 3.3 70B model
- **Deep Knowledge Base**: Comprehensive, accurate information about Mawari Network technology and architecture
- **Fallback Mode**: Graceful degradation with detailed offline responses when Fireworks API is unavailable
- **ChatGPT-Style Typing**: Realistic typing animations with variable speeds and natural patterns
- **Conversation History**: Maintains context across interactions with message persistence

### Real-Time Data Integration
- **Live Network Statistics**: Real-time performance metrics and network health monitoring
- **Social Media Feed**: Twitter/X integration for community engagement tracking
- **Event Management**: Automated parsing and display of community events and announcements
- **Bandwidth Analytics**: Live tracking of Mawari's 80% bandwidth reduction metrics

### Professional UI/UX
- **Cyberpunk Design**: Modern interface with #fb73ea primary branding and neon accents
- **Responsive Layout**: Fully optimized for desktop, tablet, and mobile devices
- **Advanced Animations**: GPU-accelerated transitions, particle effects, and micro-interactions
- **Dark Theme**: Immersive dark mode with gradient overlays and glow effects

### Multi-Tab Interface
- **AI Chat**: Interactive conversation with Mawari AI assistant featuring suggested questions
- **Events**: Calendar view of upcoming community events, AMAs, and tech talks
- **Network Stats**: Real-time performance metrics including uptime, latency, and node distribution

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Fireworks AI API key (optional, fallback available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mawari-ai-agent.git
   cd mawari-ai-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Copy `.env.local.example` to `.env.local` and configure your environment variables:
   ```env
   # Fireworks AI Configuration (Required for full functionality)
   FIREWORKS_API_KEY=your_fireworks_api_key_here
   FIREWORKS_API_URL=https://api.fireworks.ai/inference/v1/chat/completions
   DEFAULT_MODEL=accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new

   # Optional: Public exposure for client-side checks
   NEXT_PUBLIC_FIREWORKS_API_KEY=your_fireworks_api_key_here
   NEXT_PUBLIC_DEFAULT_MODEL=accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new

   # Twitter/X Configuration (Optional)
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Fireworks AI Setup (Optional but Recommended)

1. **Get Fireworks API Key**:
   - Visit [Fireworks AI](https://fireworks.ai/)
   - Sign up and create an account
   - Generate an API key from your dashboard

2. **Configure Environment**:
   ```env
   FIREWORKS_API_KEY=fw_your_api_key_here
   DEFAULT_MODEL=accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new
   ```

3. **Without Fireworks AI**:
   The application will automatically use comprehensive fallback responses with detailed Mawari Network information.

### Twitter API Setup (Optional)
1. Apply for a Twitter Developer account
2. Create a new project and app
3. Generate your Bearer Token
4. Add to `.env.local` as `TWITTER_BEARER_TOKEN`

## 🏗️ Technology Stack

### Frontend
- **Next.js 15.0.3**: React framework with App Router and TypeScript
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development and enhanced developer experience
- **TailwindCSS**: Utility-first CSS framework with custom animations
- **Shadcn UI**: Modern, accessible component library built on Radix UI

### AI Integration
- **Fireworks AI**: Advanced AI inference platform
- **Dobby Unhinged Llama 3.3 70B**: State-of-the-art language model for AI responses
- **Comprehensive Knowledge Base**: Deep Mawari Network technical documentation integration

### Animation & Effects
- **Framer Motion**: Advanced page transitions and component animations
- **Custom CSS Animations**: GPU-accelerated effects including particles, gradients, and typing animations
- **React Icons**: Comprehensive icon library including Lucide React

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing and optimization
- **TypeScript Compiler**: Type checking and compilation

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── ai-chat/       # Fireworks AI integration endpoint
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page with hydration handling
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── animations.tsx # Animation components (particles, loading)
│   │   ├── button.tsx    # Button component with variants
│   │   ├── card.tsx      # Card component with cyber styling
│   │   └── tabs.tsx      # Tabs component with smooth transitions
│   ├── AIChatbox.tsx     # AI chat interface with typing animations
│   ├── EventsTab.tsx     # Events management and display
│   ├── NetworkStats.tsx  # Network statistics dashboard
│   ├── NoSSR.tsx         # SSR handling wrapper
│   └── TypingAnimation.tsx # ChatGPT-style typing effects
└── lib/                  # Utility libraries and services
    ├── fireworks.ts      # Fireworks AI service integration
    ├── twitter.ts        # Twitter/X API service
    └── utils.ts          # Utility functions and helpers
```

## 🎨 Design System

### Color Palette
- **Primary**: #fb73ea (Mawari brand pink)
- **Background**: Black with gradient overlays (#000000 → #7c3aed → #000000)
- **Text**: White (#ffffff) with gray variations (#9ca3af, #6b7280)
- **Accent**: Purple (#7c3aed), cyan (#06b6d4), and green (#10b981) highlights
- **Status**: Green for active, yellow for warning, red for errors

### Typography
- **Font**: Inter (system font stack fallback)
- **Headings**: Bold with gradient text effects and glow animations
- **Body**: Regular weight with high contrast for readability
- **Monospace**: Used for technical data and code displays

### Animations
- **Staggered Animations**: Sequential fade-ins with customizable delays
- **Particle Effects**: Floating background elements with blur effects
- **Loading Skeletons**: Animated placeholders with gradient sweeps
- **Hover States**: Scale and glow transitions with smooth timing
- **Typing Indicators**: ChatGPT-style variable speed typing animations
- **GPU Acceleration**: Hardware-accelerated transforms for smooth 60fps

## 🔌 API Integration

### Fireworks AI Service
```typescript
import { fireworksService } from '@/lib/fireworks'

// Initialize Fireworks
await fireworksService.initialize()

// Ask a question with conversation history
const response = await fireworksService.askMawariAI(
  "What is Mawari Network's DePIN architecture?",
  conversationHistory
)

// Response includes detailed information
console.log(response.answer)        // AI response text
console.log(response.confidence)    // Confidence score (0.9)
console.log(response.sources)       // Source references
console.log(response.processing_time) // Processing time in ms
```

### Twitter Integration
```typescript
import { twitterService } from '@/lib/twitter'

// Initialize Twitter
await twitterService.initialize()

// Get latest tweets
const tweets = twitterService.getTweets(20)

// Get engagement statistics
const stats = twitterService.getEngagementStats()
```

## 🎯 Features Deep Dive

### AI Chatbox
- **Real-time Conversations**: Natural language processing with context awareness
- **Typing Animations**: ChatGPT-style variable speed typing with realistic patterns
- **Suggested Questions**: Pre-defined questions for quick engagement about Mawari
- **Message History**: Persistent conversation state with user/assistant avatars
- **Error Handling**: Graceful fallback when AI services are unavailable
- **Responsive Design**: Mobile-optimized chat interface with touch support

### Knowledge Base Coverage
The AI assistant has comprehensive knowledge covering:
- **Company Overview**: Founded 2019, $30M+ funding, major tech partnerships
- **Technical Architecture**: DePIN principles, global node network, edge computing
- **Performance Metrics**: 80% bandwidth reduction, 99.9% uptime, sub-10ms latency
- **Technology Stack**: XR streaming, AI-powered compression, blockchain integration
- **Use Cases**: Metaverse platforms, AR/VR applications, digital twins, telemedicine
- **Business Model**: B2B SaaS, content creator tools, developer ecosystem

### Events Tab
- **Community Events**: Automated parsing of Discord announcements and Twitter updates
- **Event Categories**: AMA sessions, tech talks, community gatherings, partnerships
- **Live Indicators**: Real-time status updates for ongoing events
- **Past/Upcoming**: Time-based event organization with clear visual hierarchy

### Network Statistics
- **Real-time Metrics**: Live bandwidth, latency, and uptime monitoring
- **Animated Cards**: GPU-accelerated number animations and progress indicators
- **Social Engagement**: Twitter/X follower counts and engagement tracking
- **Node Distribution**: Global network visualization with 50+ distributed nodes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push
4. Custom domain configuration available

### Environment Variables for Production
```env
FIREWORKS_API_KEY=your_production_fireworks_key
FIREWORKS_API_URL=https://api.fireworks.ai/inference/v1/chat/completions
DEFAULT_MODEL=accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new
TWITTER_BEARER_TOKEN=your_production_twitter_token
```

### Docker
```bash
# Build the image
docker build -t mawari-ai-agent .

# Run the container
docker run -p 3000:3000 -e FIREWORKS_API_KEY=your_key mawari-ai-agent
```

### Traditional Hosting
```bash
# Build for production
npm run build

# Start production server
npm start

# The app will be available at http://localhost:3000
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration for consistent code style
- Prettier integration for code formatting
- Comprehensive error handling and logging

### Performance Optimizations
- Next.js 15 App Router for optimal performance
- Client-side hydration handling with NoSSR wrapper
- GPU-accelerated CSS animations for smooth 60fps
- Image optimization and lazy loading
- Bundle size optimization with dynamic imports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request with detailed description

### Contribution Guidelines
- Follow TypeScript best practices
- Ensure responsive design for all components
- Test animations on different devices and browsers
- Update documentation for new features
- Maintain consistent coding style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mawari Network** - For the revolutionary decentralized infrastructure powering the immersive internet
- **Fireworks AI** - For providing the advanced Dobby model and inference platform
- **Sentient Foundation** - For the powerful Dobby Unhinged Llama 3.3 70B model
- **Next.js Team** - For the amazing React framework and App Router
- **Shadcn UI** - For the beautiful and accessible component library
- **Vercel** - For excellent hosting and deployment platform

## 📞 Support & Community

- **Official Website**: [mawari.net](https://mawari.net)
- **Documentation**: [docs.mawari.net](https://docs.mawari.net)
- **Twitter/X**: Follow [@MawariNetwork](https://twitter.com/MawariNetwork)
- **Discord**: Join the Mawari community
- **GitHub Issues**: Open an issue for bug reports or feature requests
- **Fireworks AI**: [fireworks.ai](https://fireworks.ai/) for AI model information

## 🔗 Related Links

- **Mawari Technology**: Learn about DePIN and XR streaming
- **Fireworks Documentation**: API documentation and model information
- **Next.js Documentation**: Framework documentation and best practices
- **TypeScript Handbook**: TypeScript documentation and learning resources

---

Built with ❤️ for the Mawari Network community, revolutionizing the immersive internet through decentralized AI-powered infrastructure.