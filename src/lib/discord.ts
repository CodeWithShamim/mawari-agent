import axios from 'axios'

export interface DiscordAnnouncement {
  id: string
  title: string
  content: string
  author: string
  timestamp: Date
  channel: string
  embeds?: DiscordEmbed[]
  reactions?: DiscordReaction[]
}

export interface DiscordEmbed {
  title?: string
  description?: string
  url?: string
  color?: number
  image?: { url: string }
  thumbnail?: { url: string }
}

export interface DiscordReaction {
  emoji: string
  count: number
}

export interface DiscordEvent {
  id: string
  title: string
  description: string
  startTime: Date
  endTime?: Date
  location?: string
  attendees?: number
  status: 'scheduled' | 'live' | 'completed'
  type: 'ama' | 'tech_talk' | 'community' | 'announcement' | 'other'
}

class DiscordService {
  private botToken: string
  private serverId: string
  private announcements: DiscordAnnouncement[] = []
  private events: DiscordEvent[] = []
  private isInitialized = false

  constructor() {
    this.botToken = process.env.DISCORD_BOT_TOKEN || ''
    this.serverId = process.env.DISCORD_SERVER_ID || ''
  }

  async initialize(): Promise<void> {
    if (!this.botToken || !this.serverId) {
      console.warn('Discord credentials not provided, using mock data')
      this.setupMockData()
      this.isInitialized = true
      return
    }

    try {
      // Test Discord connection
      await this.testConnection()
      this.setupScheduledTasks()
      this.isInitialized = true
      console.log('Discord service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Discord service:', error)
      this.setupMockData()
      this.isInitialized = true
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const response = await axios.get('https://discord.com/api/v10/users/@me', {
        headers: {
          'Authorization': `Bot ${this.botToken}`,
        },
      })

      if (response.status !== 200) {
        throw new Error('Discord bot authentication failed')
      }
    } catch (error) {
      throw new Error('Discord connection failed')
    }
  }

  private setupScheduledTasks(): void {
    // Initial scrape
    this.scrapeAnnouncements()
    this.scrapeEvents()

    // Set up intervals for periodic scraping (client-side alternative)
    if (typeof window !== 'undefined') {
      // Scrape announcements every 5 minutes
      setInterval(async () => {
        await this.scrapeAnnouncements()
      }, 5 * 60 * 1000)

      // Scrape events every hour
      setInterval(async () => {
        await this.scrapeEvents()
      }, 60 * 60 * 1000)
    }
  }

  private async scrapeAnnouncements(): Promise<void> {
    try {
      const channels = ['announcements', 'updates', 'general']

      for (const channelName of channels) {
        const channelId = await this.getChannelId(channelName)
        if (!channelId) continue

        const messages = await this.getChannelMessages(channelId, 50)

        for (const message of messages) {
          const announcement: DiscordAnnouncement = {
            id: message.id,
            title: this.extractTitle(message.content, message.embeds),
            content: message.content,
            author: message.author?.username || 'Unknown',
            timestamp: new Date(message.timestamp),
            channel: channelName,
            embeds: message.embeds,
            reactions: message.reactions
          }

          // Update or add announcement
          const existingIndex = this.announcements.findIndex(a => a.id === announcement.id)
          if (existingIndex >= 0) {
            this.announcements[existingIndex] = announcement
          } else {
            this.announcements.unshift(announcement)
          }
        }
      }

      // Keep only last 100 announcements
      this.announcements = this.announcements.slice(0, 100)
    } catch (error) {
      console.error('Error scraping announcements:', error)
    }
  }

  private async scrapeEvents(): Promise<void> {
    try {
      const eventsChannelId = await this.getChannelId('events')
      if (!eventsChannelId) return

      const messages = await this.getChannelMessages(eventsChannelId, 50)

      for (const message of messages) {
        const event = this.parseEventFromMessage(message)
        if (event) {
          const existingIndex = this.events.findIndex(e => e.id === event.id)
          if (existingIndex >= 0) {
            this.events[existingIndex] = event
          } else {
            this.events.unshift(event)
          }
        }
      }

      // Sort events by start time
      this.events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

      // Keep only future events and recent past events (last 7 days)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      this.events = this.events.filter(event => event.startTime > weekAgo)
    } catch (error) {
      console.error('Error scraping events:', error)
    }
  }

  private async getChannelId(channelName: string): Promise<string | null> {
    try {
      const response = await axios.get(`https://discord.com/api/v10/guilds/${this.serverId}/channels`, {
        headers: {
          'Authorization': `Bot ${this.botToken}`,
        },
      })

      const channel = response.data.find((ch: any) => ch.name === channelName)
      return channel?.id || null
    } catch (error) {
      console.error(`Error getting channel ID for ${channelName}:`, error)
      return null
    }
  }

  private async getChannelMessages(channelId: string, limit: number = 50): Promise<any[]> {
    try {
      const response = await axios.get(`https://discord.com/api/v10/channels/${channelId}/messages?limit=${limit}`, {
        headers: {
          'Authorization': `Bot ${this.botToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error('Error getting channel messages:', error)
      return []
    }
  }

  private extractTitle(content: string, embeds: any[]): string {
    // Try to get title from embed first
    if (embeds && embeds.length > 0 && embeds[0].title) {
      return embeds[0].title
    }

    // Extract first line from content as title
    const lines = content.split('\n')
    return lines[0]?.substring(0, 100) || 'Untitled Announcement'
  }

  private parseEventFromMessage(message: any): DiscordEvent | null {
    try {
      const content = message.content
      const embed = message.embeds?.[0]

      // Extract event information
      const title = embed?.title || this.extractTitle(content, [])
      const description = embed?.description || content

      // Try to extract date from content
      const dateMatch = content.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4})/i)
      const timeMatch = content.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/i)

      let startTime = new Date(message.timestamp)
      if (dateMatch) {
        const parsedDate = new Date(dateMatch[1])
        if (!isNaN(parsedDate.getTime())) {
          startTime = parsedDate
          if (timeMatch) {
            const timeStr = timeMatch[1]
            const [hours, minutes] = timeStr.split(':')
            const hour = parseInt(hours)
            const minute = parseInt(minutes)
            startTime.setHours(hour, minute, 0, 0)
          }
        }
      }

      // Determine event type
      const lowerContent = content.toLowerCase()
      let type: DiscordEvent['type'] = 'other'
      if (lowerContent.includes('ama') || lowerContent.includes('ask me anything')) {
        type = 'ama'
      } else if (lowerContent.includes('tech talk') || lowerContent.includes('technical')) {
        type = 'tech_talk'
      } else if (lowerContent.includes('community') || lowerContent.includes('social')) {
        type = 'community'
      } else if (lowerContent.includes('announcement') || lowerContent.includes('update')) {
        type = 'announcement'
      }

      // Determine status
      const now = new Date()
      const status: DiscordEvent['status'] = startTime > now ? 'scheduled' : startTime > new Date(now.getTime() - 2 * 60 * 60 * 1000) ? 'live' : 'completed'

      return {
        id: message.id,
        title,
        description,
        startTime,
        type,
        status
      }
    } catch (error) {
      console.error('Error parsing event from message:', error)
      return null
    }
  }

  private setupMockData(): void {
    // Mock announcements
    this.announcements = [
      {
        id: '1',
        title: 'Mawari Network v2.0 Released',
        content: 'We are excited to announce the release of Mawari Network v2.0 with improved performance and new features!',
        author: 'Mawari Team',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        channel: 'announcements',
        embeds: []
      },
      {
        id: '2',
        title: 'Node Operator Program Update',
        content: 'New incentives for node operators are now available. Learn more about our updated rewards program.',
        author: 'Mawari Team',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        channel: 'announcements',
        embeds: []
      },
      {
        id: '3',
        title: 'Community AMA - This Friday',
        content: 'Join us for a community Ask Me Anything session this Friday at 3 PM UTC. We\'ll be discussing the future of immersive internet!',
        author: 'Community Manager',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        channel: 'announcements',
        embeds: []
      }
    ]

    // Mock events
    const now = new Date()
    this.events = [
      {
        id: '1',
        title: 'Community AMA Session',
        description: 'Join the Mawari team for an interactive Q&A session about our network and future plans.',
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        type: 'ama',
        status: 'scheduled'
      },
      {
        id: '2',
        title: 'Tech Talk: DePIN Infrastructure',
        description: 'Deep dive into Mawari\'s Decentralized Physical Infrastructure Network architecture.',
        startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        type: 'tech_talk',
        status: 'scheduled'
      },
      {
        id: '3',
        title: 'Community Node Workshop',
        description: 'Learn how to set up and operate a Mawari node in this hands-on workshop.',
        startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        type: 'community',
        status: 'scheduled'
      }
    ]
  }

  getAnnouncements(limit: number = 10): DiscordAnnouncement[] {
    return this.announcements.slice(0, limit)
  }

  getUpcomingEvents(limit: number = 10): DiscordEvent[] {
    const now = new Date()
    return this.events
      .filter(event => event.startTime > now)
      .slice(0, limit)
  }

  getAllEvents(limit: number = 20): DiscordEvent[] {
    return this.events.slice(0, limit)
  }

  getEventsByType(type: DiscordEvent['type']): DiscordEvent[] {
    return this.events.filter(event => event.type === type)
  }

  searchAnnouncements(query: string): DiscordAnnouncement[] {
    const lowerQuery = query.toLowerCase()
    return this.announcements.filter(announcement =>
      announcement.title.toLowerCase().includes(lowerQuery) ||
      announcement.content.toLowerCase().includes(lowerQuery)
    )
  }

  isReady(): boolean {
    return this.isInitialized
  }
}

export const discordService = new DiscordService()
export default DiscordService