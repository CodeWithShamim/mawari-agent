# Mawari AI Agent 🤖

A sophisticated AI-powered dashboard for Mawari Network, built with Next.js 16, TypeScript, and ROMA (Sentient AGI). This application serves as an intelligent gateway to the immersive internet, providing real-time insights, community engagement, and AI assistance.

## 🌟 Features

### AI-Powered Assistant
- **ROMA Integration**: Powered by Sentient AGI's recursive meta-agent framework
- **Intelligent Q&A**: Context-aware responses about Mawari Network technology
- **Fallback Mode**: Graceful degradation when ROMA service is unavailable
- **Conversation History**: Maintains context across interactions

### Real-Time Data Integration
- **Discord Scraping**: Automated collection of announcements and events from Discord channels
- **Twitter/X Feed**: Real-time social media monitoring and engagement tracking
- **Event Parsing**: Automatic extraction of event details from community channels
- **Network Statistics**: Live performance metrics and network health monitoring

### Web3 DApp Design
- **Professional UI**: Modern, sleek interface with #fb73ea primary branding
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Dark Theme**: Immersive dark mode with neon accents

### Multi-Tab Interface
- **AI Chat**: Interactive conversation with Mawari AI assistant
- **Events**: Calendar view of upcoming community events and AMAs
- **Network Stats**: Real-time performance metrics and network health

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

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
   # ROMA (Sentient AGI) Configuration
   NEXT_PUBLIC_ROMA_API_URL=http://localhost:8000
   ROMA_API_KEY=your_roma_api_key_here

   # Discord Configuration
   DISCORD_BOT_TOKEN=your_discord_bot_token
   DISCORD_SERVER_ID=your_discord_server_id

   # Twitter/X Configuration
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_ACCESS_TOKEN=your_twitter_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

   # Mawari.net Scraper Configuration
   MAWARI_API_BASE_URL=https://mawari.net
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🔧 Configuration

### ROMA Setup (Optional)
The application can work with or without ROMA:

1. **With ROMA** (Recommended):
   ```bash
   # Install ROMA using Docker
   git clone https://github.com/sentient-agi/ROMA.git
   cd ROMA
   just setup
   just docker-up
   ```

2. **Without ROMA**:
   The application will automatically use fallback responses and mock data.

### Discord Bot Setup (Optional)
1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot and get the token
3. Invite the bot to your server with appropriate permissions
4. Add the bot token and server ID to `.env.local`

### Twitter API Setup (Optional)
1. Apply for a Twitter Developer account
2. Create a new project and app
3. Generate API keys and access tokens
4. Add credentials to `.env.local`

## 🏗️ Technology Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Advanced animations
- **Shadcn UI**: Modern component library

### Backend Integration
- **ROMA (Sentient AGI)**: AI agent framework
- **Discord API**: Community data scraping
- **Twitter API v2**: Social media integration
- **Axios**: HTTP client for API calls

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Node-cron**: Scheduled tasks

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── animations.tsx # Animation components
│   │   ├── button.tsx    # Button component
│   │   ├── card.tsx      # Card component
│   │   └── tabs.tsx      # Tabs component
│   ├── AIChatbox.tsx     # AI chat interface
│   ├── EventsTab.tsx     # Events management
│   └── NetworkStats.tsx  # Network statistics
└── lib/                  # Utility libraries
    ├── discord.ts        # Discord service
    ├── roma.ts          # ROMA integration
    ├── twitter.ts       # Twitter service
    └── utils.ts         # Utility functions
```

## 🎨 Design System

### Color Palette
- **Primary**: #fb73ea (Mawari brand pink)
- **Background**: Black with gradient overlays
- **Text**: White with gray variations
- **Accent**: Purple, cyan, and green highlights

### Typography
- **Font**: Inter (system font stack)
- **Headings**: Bold, gradient text effects
- **Body**: Regular weight, high contrast

### Animations
- **Loading**: Smooth fade-ins with stagger effects
- **Hover**: Scale and glow transitions
- **Status**: Pulsing indicators for live data
- **Particles**: Floating background elements

## 🔌 API Integration

### ROMA Service
```typescript
import { romaService } from '@/lib/roma'

// Initialize ROMA
await romaService.initialize()

// Ask a question
const response = await romaService.askMawariAI(
  "What is Mawari Network?",
  conversationHistory
)
```

### Discord Service
```typescript
import { discordService } from '@/lib/discord'

// Initialize Discord
await discordService.initialize()

// Get announcements
const announcements = discordService.getAnnouncements(10)

// Get upcoming events
const events = discordService.getUpcomingEvents()
```

### Twitter Service
```typescript
import { twitterService } from '@/lib/twitter'

// Initialize Twitter
await twitterService.initialize()

// Get tweets
const tweets = twitterService.getTweets(20)

// Get engagement stats
const stats = twitterService.getEngagementStats()
```

## 🎯 Features Deep Dive

### AI Chatbox
- Real-time conversation with typing indicators
- Suggested questions for quick engagement
- Message history and context preservation
- Responsive design with message bubbles

### Events Tab
- Automatic Discord event parsing
- Filter by event type (AMA, Tech Talk, Community)
- Live event indicators
- Past and upcoming event separation

### Network Statistics
- Real-time bandwidth and latency charts
- Animated metric cards
- Social media engagement tracking
- Network health overview

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on git push

### Docker
```bash
# Build the image
docker build -t mawari-ai-agent .

# Run the container
docker run -p 3001:3001 mawari-ai-agent
```

### Traditional Hosting
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mawari Network** - For the revolutionary decentralized infrastructure
- **Sentient AGI** - For the powerful ROMA framework
- **Next.js Team** - For the amazing React framework
- **Shadcn UI** - For the beautiful component library

## 📞 Support

- **Discord**: Join the Mawari community
- **Twitter**: Follow @MawariNetwork
- **GitHub**: Open an issue for bug reports
- **Documentation**: [docs.mawari.net](https://docs.mawari.net)

---

Built with ❤️ for the Mawari Network community# mawari-agent
