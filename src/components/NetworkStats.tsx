'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Activity,
  Globe,
  Zap,
  Server,
  Users,
  TrendingUp,
  Download,
  Upload,
  Clock,
  Shield,
  Router,
  HardDrive
} from 'lucide-react'
import { discordService } from '@/lib/discord'
import { twitterService } from '@/lib/twitter'

interface NetworkMetric {
  label: string
  value: string | number
  change?: number
  icon: React.ElementType
  color: string
}

interface RealtimeMetric {
  timestamp: number
  bandwidth: number
  latency: number
  activeNodes: number
  connectedUsers: number
}

export default function NetworkStats() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h')
  const [realtimeData, setRealtimeData] = useState<RealtimeMetric[]>([])
  const [isLive, setIsLive] = useState(true)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [twitterStats, setTwitterStats] = useState<any>(null)

  useEffect(() => {
    // Initialize services and load data
    const loadData = async () => {
      try {
        await discordService.initialize()
        await twitterService.initialize()

        setAnnouncements(discordService.getAnnouncements(5))
        setTwitterStats(twitterService.getEngagementStats())
      } catch (error) {
        console.error('Error loading network stats:', error)
      }
    }

    loadData()

    // Generate initial realtime data
    const generateInitialData = () => {
      const data: RealtimeMetric[] = []
      const now = Date.now()

      for (let i = 30; i >= 0; i--) {
        data.push({
          timestamp: now - i * 60000, // Every minute for last 30 minutes
          bandwidth: Math.random() * 100 + 50,
          latency: Math.random() * 5 + 5,
          activeNodes: Math.floor(Math.random() * 10) + 45,
          connectedUsers: Math.floor(Math.random() * 1000) + 5000
        })
      }

      setRealtimeData(data)
    }

    generateInitialData()

    // Update realtime data
    const interval = setInterval(() => {
      if (isLive) {
        setRealtimeData(prev => {
          const newData = [...prev]
          if (newData.length > 30) {
            newData.shift()
          }

          newData.push({
            timestamp: Date.now(),
            bandwidth: Math.random() * 100 + 50,
            latency: Math.random() * 5 + 5,
            activeNodes: Math.floor(Math.random() * 10) + 45,
            connectedUsers: Math.floor(Math.random() * 1000) + 5000
          })

          return newData
        })
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const networkMetrics: NetworkMetric[] = [
    {
      label: 'Network Uptime',
      value: '99.9%',
      change: 0.1,
      icon: Shield,
      color: 'text-green-400'
    },
    {
      label: 'Active Nodes',
      value: realtimeData.length > 0 ? realtimeData[realtimeData.length - 1].activeNodes : 52,
      change: 2,
      icon: Server,
      color: 'text-blue-400'
    },
    {
      label: 'Connected Users',
      value: realtimeData.length > 0 ? realtimeData[realtimeData.length - 1].connectedUsers.toLocaleString() : '5,432',
      change: 8.5,
      icon: Users,
      color: 'text-purple-400'
    },
    {
      label: 'Average Latency',
      value: realtimeData.length > 0 ? `${realtimeData[realtimeData.length - 1].latency.toFixed(1)}ms` : '7.2ms',
      change: -0.8,
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      label: 'Bandwidth Saved',
      value: '80%',
      change: 5,
      icon: Download,
      color: 'text-[#fb73ea]'
    },
    {
      label: 'Global Coverage',
      value: '47',
      change: 3,
      icon: Globe,
      color: 'text-cyan-400'
    }
  ]

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-gray-400'
    return change > 0 ? 'text-green-400' : 'text-red-400'
  }

  const getChangeSymbol = (change?: number) => {
    if (!change) return ''
    return change > 0 ? '+' : ''
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Network Statistics</h2>
          <p className="text-gray-400">
            Real-time metrics and performance data for the Mawari Network
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            <span className="text-sm text-gray-400">
              {isLive ? 'Live' : 'Paused'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="border-[#fb73ea]/30 text-gray-300 hover:border-[#fb73ea]"
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center space-x-2">
        {(['1h', '24h', '7d', '30d'] as const).map((timeframe) => (
          <Button
            key={timeframe}
            variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe(timeframe)}
            className={selectedTimeframe === timeframe ? 'bg-[#fb73ea] text-black' : 'border-[#fb73ea]/30 text-gray-300'}
          >
            {timeframe}
          </Button>
        ))}
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networkMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card
              key={index}
              className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 hover:scale-105 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-black/50 ${metric.color.replace('text', 'bg')}/20`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  {metric.change && (
                    <div className={`flex items-center text-sm ${getChangeColor(metric.change)}`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {getChangeSymbol(metric.change)}{metric.change}%
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">{metric.value}</p>
                  <p className="text-sm text-gray-400">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Realtime Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bandwidth Chart */}
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-[#fb73ea]" />
              Bandwidth Usage (GB/s)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end space-x-1">
              {realtimeData.slice(-20).map((data, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-[#fb73ea] to-purple-600 rounded-t"
                  style={{ height: `${(data.bandwidth / 150) * 100}%` }}
                  title={`${data.bandwidth.toFixed(1)} GB/s at ${formatTime(data.timestamp)}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{formatTime(realtimeData[0]?.timestamp || Date.now())}</span>
              <span>Current: {realtimeData.length > 0 ? realtimeData[realtimeData.length - 1].bandwidth.toFixed(1) : '0'} GB/s</span>
              <span>{formatTime(realtimeData[realtimeData.length - 1]?.timestamp || Date.now())}</span>
            </div>
          </CardContent>
        </Card>

        {/* Latency Chart */}
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-[#fb73ea]" />
              Network Latency (ms)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end space-x-1">
              {realtimeData.slice(-20).map((data, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-green-400 to-blue-600 rounded-t"
                  style={{ height: `${(data.latency / 10) * 100}%` }}
                  title={`${data.latency.toFixed(1)}ms at ${formatTime(data.timestamp)}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{formatTime(realtimeData[0]?.timestamp || Date.now())}</span>
              <span>Current: {realtimeData.length > 0 ? realtimeData[realtimeData.length - 1].latency.toFixed(1) : '0'}ms</span>
              <span>{formatTime(realtimeData[realtimeData.length - 1]?.timestamp || Date.now())}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Announcements */}
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-[#fb73ea]" />
              Latest Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-black/30 rounded-lg">
                  <div className="w-2 h-2 bg-[#fb73ea] rounded-full mt-2" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{announcement.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {announcement.timestamp?.toLocaleTimeString() || 'Recent'}
                    </p>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-center text-gray-400 py-4">No recent announcements</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Media Stats */}
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#fb73ea]" />
              Social Media Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {twitterStats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <span className="text-sm text-gray-300">Total Tweets</span>
                  <span className="font-semibold">{twitterStats.totalTweets}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <span className="text-sm text-gray-300">Total Likes</span>
                  <span className="font-semibold text-green-400">{twitterStats.totalLikes.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <span className="text-sm text-gray-300">Total Retweets</span>
                  <span className="font-semibold text-blue-400">{twitterStats.totalRetweets.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <span className="text-sm text-gray-300">Avg. Engagement</span>
                  <span className="font-semibold text-[#fb73ea]">{twitterStats.averageEngagement}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <span className="text-sm text-gray-300">Total Reach</span>
                  <span className="font-semibold text-purple-400">{(twitterStats.totalViews / 1000).toFixed(0)}K</span>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400 py-4">Loading social media stats...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Network Health */}
      <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Router className="w-5 h-5 mr-2 text-[#fb73ea]" />
            Network Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28 * 0.999} ${2 * Math.PI * 28}`}
                    className="text-green-400"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">99.9%</span>
                </div>
              </div>
              <h3 className="font-semibold mb-1">Uptime</h3>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28 * 0.8} ${2 * Math.PI * 28}`}
                    className="text-[#fb73ea]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">80%</span>
                </div>
              </div>
              <h3 className="font-semibold mb-1">Efficiency</h3>
              <p className="text-xs text-gray-400">Bandwidth saved</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28 * 0.95} ${2 * Math.PI * 28}`}
                    className="text-blue-400"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">95%</span>
                </div>
              </div>
              <h3 className="font-semibold mb-1">Performance</h3>
              <p className="text-xs text-gray-400">Target met</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 relative">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28 * 0.92} ${2 * Math.PI * 28}`}
                    className="text-purple-400"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">92%</span>
                </div>
              </div>
              <h3 className="font-semibold mb-1">Coverage</h3>
              <p className="text-xs text-gray-400">Global reach</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}