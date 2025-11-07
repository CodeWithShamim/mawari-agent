import axios from 'axios'

export interface Tweet {
  id: string
  text: string
  author: {
    id: string
    username: string
    name: string
    profileImageUrl?: string
  }
  createdAt: Date
  metrics: {
    likeCount: number
    retweetCount: number
    replyCount: number
    viewCount?: number
  }
  media?: {
    type: 'photo' | 'video' | 'animated_gif'
    url: string
    previewImageUrl?: string
  }[]
  urls?: {
    displayUrl: string
    expandedUrl: string
    unwoundUrl?: string
  }[]
  hashtags?: string[]
  mentions?: string[]
}

export interface TwitterSearchResponse {
  data?: Tweet[]
  meta?: {
    resultCount: number
    nextToken?: string
    previousToken?: string
  }
  errors?: Array<{
    detail: string
    title: string
    resourceType: string
    parameter?: string
    value?: string
  }>
}

class TwitterService {
  private apiKey: string
  private apiSecret: string
  private accessToken: string
  private accessTokenSecret: string
  private bearerToken: string
  private tweets: Tweet[] = []
  private isInitialized = false

  constructor() {
    this.apiKey = process.env.TWITTER_API_KEY || ''
    this.apiSecret = process.env.TWITTER_API_SECRET || ''
    this.accessToken = process.env.TWITTER_ACCESS_TOKEN || ''
    this.accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET || ''
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN || ''
  }

  async initialize(): Promise<void> {
    try {
      if (!this.bearerToken && (!this.apiKey || !this.apiSecret)) {
        console.warn('Twitter credentials not provided, using mock data')
        this.setupMockData()
        this.isInitialized = true
        return
      }

      // Try to get bearer token if not provided
      if (!this.bearerToken) {
        this.bearerToken = await this.getBearerToken()
      }

      // Test connection
      await this.testConnection()
      this.setupScheduledTasks()
      this.isInitialized = true
      console.log('Twitter service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Twitter service:', error)
      this.setupMockData()
      this.isInitialized = true
    }
  }

  private async getBearerToken(): Promise<string> {
    try {
      const credentials = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')

      const response = await axios.post('https://api.twitter.com/oauth2/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      return response.data.access_token
    } catch (error) {
      throw new Error('Failed to get Twitter bearer token')
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const response = await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`
        }
      })

      if (response.status !== 200) {
        throw new Error('Twitter API authentication failed')
      }
    } catch (error) {
      throw new Error('Twitter connection test failed')
    }
  }

  private setupScheduledTasks(): void {
    // Initial scrape
    this.scrapeTweets()

    // Set up interval for periodic scraping (client-side alternative)
    if (typeof window !== 'undefined') {
      setInterval(async () => {
        await this.scrapeTweets()
      }, 10 * 60 * 1000) // Every 10 minutes
    }
  }

  private async scrapeTweets(): Promise<void> {
    try {
      const searchQueries = [
        '@MawariNetwork',
        '@MawariNetwork -filter:retweets',
        '#MawariNetwork',
        '#MawariNetwork -filter:retweets',
        'Mawari Network XR streaming',
        'Mawari DePIN infrastructure',
        'Mawari immersive internet'
      ]

      const allTweets: Tweet[] = []

      for (const query of searchQueries) {
        try {
          const tweets = await this.searchTweets(query, 20)
          allTweets.push(...tweets)
        } catch (error) {
          console.error(`Error searching for query "${query}":`, error)
        }
      }

      // Remove duplicates by ID
      const uniqueTweets = Array.from(
        new Map(allTweets.map(tweet => [tweet.id, tweet])).values()
      )

      // Sort by date (newest first)
      uniqueTweets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      // Update tweets array
      this.tweets = uniqueTweets.slice(0, 100) // Keep last 100 tweets

      console.log(`Scraped ${this.tweets.length} unique tweets`)
    } catch (error) {
      console.error('Error scraping tweets:', error)
    }
  }

  private async searchTweets(query: string, maxResults: number = 10): Promise<Tweet[]> {
    try {
      const searchUrl = 'https://api.twitter.com/2/tweets/search/recent'

      const params = new URLSearchParams({
        query: query,
        max_results: maxResults.toString(),
        'tweet.fields': 'created_at,author_id,public_metrics,context_annotations,entities,attachments',
        'user.fields': 'username,name,profile_image_url',
        'expansions': 'author_id,attachments.media_keys',
        'media.fields': 'type,url,preview_image_url'
      })

      const response = await axios.get<TwitterSearchResponse>(`${searchUrl}?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data.errors) {
        console.error('Twitter API errors:', response.data.errors)
        return []
      }

      const tweets = response.data.data || []
      const responseData = response.data as any
      const users = responseData.includes?.users || []
      const media = responseData.includes?.media || []

      // Combine tweet data with user and media information
      return tweets.map((tweet: any) => {
        const author = users.find((user: any) => user.id === tweet.author_id)
        const tweetMedia = tweet.attachments?.media_keys?.map((key: string) =>
          media.find((m: any) => m.media_key === key)
        ).filter(Boolean) || []

        return {
          id: tweet.id,
          text: tweet.text,
          author: {
            id: tweet.author_id,
            username: author?.username || 'unknown',
            name: author?.name || 'Unknown User',
            profileImageUrl: author?.profile_image_url
          },
          createdAt: new Date(tweet.created_at),
          metrics: {
            likeCount: tweet.public_metrics?.like_count || 0,
            retweetCount: tweet.public_metrics?.retweet_count || 0,
            replyCount: tweet.public_metrics?.reply_count || 0,
            viewCount: tweet.public_metrics?.impression_count
          },
          media: tweetMedia.map((m: any) => ({
            type: m.type,
            url: m.url,
            previewImageUrl: m.preview_image_url
          })),
          urls: tweet.entities?.urls?.map((url: any) => ({
            displayUrl: url.display_url,
            expandedUrl: url.expanded_url,
            unwoundUrl: url.unwound_url
          })),
          hashtags: tweet.entities?.hashtags?.map((tag: any) => tag.tag) || [],
          mentions: tweet.entities?.mentions?.map((mention: any) => mention.username) || []
        }
      })
    } catch (error) {
      console.error('Error searching tweets:', error)
      return []
    }
  }

  private setupMockData(): void {
    const now = new Date()
    this.tweets = [
      {
        id: '1',
        text: '🚀 Excited to announce Mawari Network v2.0! Now with 80% bandwidth reduction and 99.9% uptime for XR streaming. The future of immersive internet is here! #MawariNetwork #XR #Web3',
        author: {
          id: '1',
          username: 'MawariNetwork',
          name: 'Mawari Network',
          profileImageUrl: 'https://pbs.twimg.com/profile_images/1234567890/mawari_logo_400x400.png'
        },
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        metrics: {
          likeCount: 342,
          retweetCount: 89,
          replyCount: 45,
          viewCount: 25000
        },
        hashtags: ['MawariNetwork', 'XR', 'Web3']
      },
      {
        id: '2',
        text: 'Our DePIN infrastructure is revolutionizing how immersive content is delivered globally. With nodes positioned close to users, we achieve sub-10ms latency for real-time experiences. 🌐⚡\n\nLearn more: mawari.net',
        author: {
          id: '1',
          username: 'MawariNetwork',
          name: 'Mawari Network'
        },
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
        metrics: {
          likeCount: 156,
          retweetCount: 42,
          replyCount: 23,
          viewCount: 15000
        },
        urls: [
          {
            displayUrl: 'mawari.net',
            expandedUrl: 'https://mawari.net'
          }
        ]
      },
      {
        id: '3',
        text: 'Join our Community AMA this Friday! 🗓️\n\n📅 Date: November 10th\n⏰ Time: 3 PM UTC\n🎯 Topic: Future of Immersive Internet\n\nBring your questions about DePIN, XR streaming, and our node operator program! #MawariNetwork #AMA #Web3',
        author: {
          id: '1',
          username: 'MawariNetwork',
          name: 'Mawari Network'
        },
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        metrics: {
          likeCount: 89,
          retweetCount: 31,
          replyCount: 67,
          viewCount: 12000
        },
        hashtags: ['MawariNetwork', 'AMA', 'Web3']
      },
      {
        id: '4',
        text: 'Running a Mawari node not only supports the immersive internet but also rewards you in $MAWARI tokens. 🪙\n\nJoin our decentralized network and be part of the future!\n\n#NodeOperator #DePIN #Crypto #MawariNetwork',
        author: {
          id: '1',
          username: 'MawariNetwork',
          name: 'Mawari Network'
        },
        createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
        metrics: {
          likeCount: 234,
          retweetCount: 56,
          replyCount: 89,
          viewCount: 18000
        },
        hashtags: ['NodeOperator', 'DePIN', 'Crypto', 'MawariNetwork']
      }
    ]
  }

  getTweets(limit: number = 20): Tweet[] {
    return this.tweets.slice(0, limit)
  }

  getTweetsByHashtag(hashtag: string): Tweet[] {
    const lowerHashtag = hashtag.toLowerCase().replace('#', '')
    return this.tweets.filter(tweet =>
      tweet.hashtags?.some(h => h.toLowerCase() === lowerHashtag)
    )
  }

  getTweetsByUsername(username: string): Tweet[] {
    const lowerUsername = username.toLowerCase().replace('@', '')
    return this.tweets.filter(tweet =>
      tweet.author.username.toLowerCase() === lowerUsername
    )
  }

  searchTweetsByText(query: string): Tweet[] {
    const lowerQuery = query.toLowerCase()
    return this.tweets.filter(tweet =>
      tweet.text.toLowerCase().includes(lowerQuery)
    )
  }

  getEngagementStats(): {
    totalTweets: number
    totalLikes: number
    totalRetweets: number
    totalReplies: number
    totalViews: number
    averageEngagement: number
  } {
    const totalTweets = this.tweets.length
    const totalLikes = this.tweets.reduce((sum, tweet) => sum + tweet.metrics.likeCount, 0)
    const totalRetweets = this.tweets.reduce((sum, tweet) => sum + tweet.metrics.retweetCount, 0)
    const totalReplies = this.tweets.reduce((sum, tweet) => sum + tweet.metrics.replyCount, 0)
    const totalViews = this.tweets.reduce((sum, tweet) => sum + (tweet.metrics.viewCount || 0), 0)
    const averageEngagement = totalTweets > 0 ?
      Math.round((totalLikes + totalRetweets + totalReplies) / totalTweets) : 0

    return {
      totalTweets,
      totalLikes,
      totalRetweets,
      totalReplies,
      totalViews,
      averageEngagement
    }
  }

  getTopTweets(limit: number = 5): Tweet[] {
    return [...this.tweets]
      .sort((a, b) => {
        const engagementA = a.metrics.likeCount + a.metrics.retweetCount + a.metrics.replyCount
        const engagementB = b.metrics.likeCount + b.metrics.retweetCount + b.metrics.replyCount
        return engagementB - engagementA
      })
      .slice(0, limit)
  }

  isReady(): boolean {
    return this.isInitialized
  }
}

export const twitterService = new TwitterService()
export default TwitterService