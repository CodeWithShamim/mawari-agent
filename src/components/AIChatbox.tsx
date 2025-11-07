'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Send, Loader2, Bot, User, Sparkles, Zap } from 'lucide-react'
import { ROMAMessage, romaService } from '@/lib/roma'

interface AIChatboxProps {
  isROMAConnected: boolean
}

export default function AIChatbox({ isROMAConnected }: AIChatboxProps) {
  const [messages, setMessages] = useState<ROMAMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Mawari Network AI assistant. I can help you understand everything about Mawari\'s decentralized infrastructure for immersive experiences, XR streaming, AI-powered content delivery, and the future of the 3D internet. What would you like to know?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [typingIndicator, setTypingIndicator] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ROMAMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setTypingIndicator(true)

    try {
      const response = await romaService.askMawariAI(
        userMessage.content,
        messages.slice(-10) // Send last 10 messages for context
      )

      const assistantMessage: ROMAMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)

      const errorMessage: ROMAMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or visit mawari.net for more information.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTypingIndicator(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    'What is Mawari Network?',
    'How does DePIN work in Mawari?',
    'What are the benefits of running a node?',
    'How does Mawari reduce bandwidth usage?',
    'What is XR streaming?',
    'How can I join the Mawari ecosystem?'
  ]

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chat Area */}
      <div className="lg:col-span-3">
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 h-[600px] flex flex-col">
          <CardHeader className="border-b border-[#fb73ea]/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center">
                <Bot className="w-6 h-6 mr-2 text-[#fb73ea]" />
                Mawari AI Assistant
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isROMAConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                <span className="text-sm text-gray-400">
                  {isROMAConnected ? 'ROMA Powered' : 'Fallback Mode'}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-[#fb73ea] to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-[#fb73ea] text-black'
                        : 'bg-black/50 border border-[#fb73ea]/30 backdrop-blur-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}

              {typingIndicator && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#fb73ea] to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-black/50 border border-[#fb73ea]/30 backdrop-blur-sm p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#fb73ea] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#fb73ea] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-[#fb73ea] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-[#fb73ea]/20 p-4">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about Mawari Network..."
                  className="flex-1 bg-black/50 border border-[#fb73ea]/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#fb73ea] focus:ring-1 focus:ring-[#fb73ea]"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-[#fb73ea] hover:bg-[#fb73ea]/90 text-black"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Suggested Questions */}
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-[#fb73ea]" />
              Suggested Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full text-left text-sm justify-start h-auto p-3 text-gray-300 hover:text-white hover:bg-[#fb73ea]/10 transition-colors"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* AI Capabilities */}
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <Zap className="w-5 h-5 mr-2 text-[#fb73ea]" />
              AI Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#fb73ea] rounded-full" />
              <span className="text-sm text-gray-300">Network Technology</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#fb73ea] rounded-full" />
              <span className="text-sm text-gray-300">DePIN Infrastructure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#fb73ea] rounded-full" />
              <span className="text-sm text-gray-300">XR Streaming</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#fb73ea] rounded-full" />
              <span className="text-sm text-gray-300">Node Operations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#fb73ea] rounded-full" />
              <span className="text-sm text-gray-300">Bandwidth Optimization</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#fb73ea] rounded-full" />
              <span className="text-sm text-gray-300">Real-time Analytics</span>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">AI Engine</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isROMAConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                <span className="text-xs text-gray-400">
                  {isROMAConnected ? 'ROMA' : 'Fallback'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}