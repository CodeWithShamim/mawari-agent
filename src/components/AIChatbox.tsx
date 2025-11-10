'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Bot, User, Sparkles, Zap } from 'lucide-react';
import {
  ParticleAnimation,
  ROMALoadingAnimation,
  DataFlowAnimation,
  GlitchAnimation,
  MorphAnimation,
} from '@/components/ui/animations';
import { ChatGPTTyping } from '@/components/TypingAnimation';

interface AIMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIChatboxProps {
  isAIConnected: boolean;
}

export default function AIChatbox({ isAIConnected }: AIChatboxProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `🚀 Welcome! I'm MAWARAI, your official Mawari Network AI assistant, powered by the advanced Dobby Unhinged Llama 3.3 70B model. I'm here to provide you with comprehensive insights into Mawari's revolutionary technology that's transforming the immersive internet!

I can help you explore:
• 🌐 **DePIN Architecture** - Global distributed infrastructure with 50+ nodes
• ⚡ **Performance Metrics** - 80% bandwidth reduction, sub-10ms latency
• 🎮 **XR & Gaming** - Real-time streaming for AR/VR/MR experiences
• 🏥 **Enterprise Solutions** - Digital twins, telemedicine, training simulations
• 🔧 **Developer Tools** - SDKs, APIs, and creator ecosystem

What aspect of Mawari's groundbreaking technology would you like to dive into?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [sendingAnimation, setSendingAnimation] = useState(false);
  const [messageKey, setMessageKey] = useState(0);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [completedTyping, setCompletedTyping] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, typingIndicator]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    // Trigger sending animation
    setSendingAnimation(true);
    setMessageKey((prev) => prev + 1);

    // Add user message with animation
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Small delay for animation effect
    setTimeout(() => {
      setSendingAnimation(false);
      setIsLoading(true);
      setTypingIndicator(true);
    }, 800);

    try {
      // Use Fireworks AI endpoint
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const aiData = await response.json();

      const messageId = `ai-${Date.now()}`;
      const assistantMessage: AIMessage = {
        id: messageId,
        role: 'assistant',
        content:
          aiData.answer || 'I apologize, but I encountered an issue processing your request.',
        timestamp: new Date(),
      };

      // Set typing message ID and add message
      setTypingMessageId(messageId);
      setMessages((prev) => [...prev, assistantMessage]);

      // Let the typing animation complete naturally without auto-completion
      // The ChatGPTTyping component will call onComplete when finished
    } catch (error) {
      console.error('Error getting AI response:', error);

      const errorMessageId = `err-${Date.now()}`;
      const errorMessage: AIMessage = {
        id: errorMessageId,
        role: 'assistant',
        content:
          'I apologize, but I encountered an error while processing your request. Please try again or visit mawari.net for more information about Mawari Network.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Don't set typingIndicator to false here
      // Let the typing animation complete and call onTypingComplete
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    'What is Mawari Network?',
    'How does DePIN work in Mawari?',
    'What are the benefits of running a node?',
    'How does Mawari reduce bandwidth usage?',
    'What is XR streaming?',
    'How can I join the Mawari ecosystem?',
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const onTypingComplete = (messageId: string) => {
    setCompletedTyping((prev) => new Set(prev).add(messageId));
    // Only turn off typing indicator if this is the current typing message
    if (messageId === typingMessageId) {
      setTypingIndicator(false);
    }
  };

  const onAutoScroll = () => {
    scrollToBottom();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chat Area */}
      <div className="lg:col-span-3">
        <Card className=" cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 h-[45rem] flex flex-col">
          <CardHeader className="border-b border-[#fb73ea]/20 ">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center">
                <div className="relative mr-2">
                  <Bot className="w-6 h-6 text-[#fb73ea]" />
                  {isAIConnected && (
                    <div className="absolute -inset-1 bg-[#fb73ea]/30 rounded-full animate-pulse" />
                  )}
                </div>
                Mawari AI Assistant
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  {isAIConnected ? (
                    <MorphAnimation size="sm" color="#10b981" />
                  ) : (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  )}
                </div>
                <span
                  className={`text-sm transition-colors duration-300 ${
                    isAIConnected ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {isAIConnected ? 'Dobby model ⚡' : 'Failed to connect dobby.'}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-auto">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {sendingAnimation && (
                <div className="fixed inset-0 pointer-events-none z-50">
                  <ParticleAnimation key={`particle-${messageKey}`} />
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  } animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Avatar */}
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#fb73ea] to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-[#fb73ea] text-black'
                        : 'bg-gray-800 text-white border border-gray-700'
                    }`}
                  >
                    {message.role === 'assistant' &&
                    typingIndicator &&
                    !completedTyping.has(message.id || '') &&
                    message.id === typingMessageId ? (
                      <ChatGPTTyping
                        key={`typing-${message.id}`}
                        message={message.content || ''}
                        onComplete={() => onTypingComplete(message.id!)}
                        onAutoScroll={onAutoScroll}
                      />
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content || ''}
                      </p>
                    )}
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#fb73ea] to-blue-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  {/* Bot Avatar */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#fb73ea] to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-800 text-white border border-gray-700 rounded-lg p-4 max-w-[70%] flex items-center gap-2">
                    <ROMALoadingAnimation /> <span className="text-xs">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-[#fb73ea]/20 p-4">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Mawari Network..."
                  className="flex-1 px-4 py-2 bg-black/50 border border-[#fb73ea]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#fb73ea] focus:border-opacity-50 transition-all duration-300"
                  disabled={isLoading || typingIndicator}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-[#fb73ea] hover:bg-[#fb73ea]/90 text-black hover-lift smooth-transition disabled:opacity-50"
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Suggested Questions */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (typingIndicator) return;
                        handleSuggestedQuestion(question);
                      }}
                      className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600 hover-lift smooth-transition"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30  h-[45rem]">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-[#fb73ea]" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-[#fb73ea] mb-2">About Mawari Network</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Mawari delivers embodied AI through a global network of distributed nodes, achieving
                80% bandwidth reduction while maintaining 99.9% uptime for XR content streaming.
              </p>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-[#fb73ea] mb-2">Key Technologies</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• DePIN Architecture</li>
                <li>• XR Streaming</li>
                <li>• Edge Computing</li>
                <li>• AI-Powered Experiences</li>
                <li>• Distributed GPU Processing</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-[#fb73ea] mb-2">Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-green-400">99.9%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Bandwidth</span>
                  <span className="text-[#fb73ea]">-80%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Latency</span>
                  <span className="text-blue-400">&lt;10ms</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
