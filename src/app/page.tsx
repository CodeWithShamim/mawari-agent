'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Network,
  Calendar,
  MessageCircle,
  Activity,
  Globe,
  Zap,
  Shield,
  Twitter,
} from 'lucide-react';
import AIChatbox from '@/components/AIChatbox';
import EventsTab from '@/components/EventsTab';
import NetworkStats from '@/components/NetworkStats';
import Link from 'next/link';
import NoSSR from '@/components/NoSSR';

function InteractiveContent() {
  const [isAIConnected, setIsAIConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check Fireworks AI service availability only on client
    const checkAIConnection = async () => {
      try {
        // Simple check for environment variables
        const hasApiKey = !!process.env.NEXT_PUBLIC_FIREWORKS_API_KEY;
        const hasModel = !!process.env.NEXT_PUBLIC_DEFAULT_MODEL;

        if (hasApiKey && hasModel) {
          setIsAIConnected(true);
          console.log('Sentient dobby AI connected successfully');
        } else {
          console.warn('Sentient dobby AI credentials not found');
          setIsAIConnected(false);
        }
      } catch (error) {
        console.warn('Sentient dobby AI service not available, using fallback mode:', error);
        setIsAIConnected(false);
      } finally {
        // Add a small delay for smooth loading animation
        setTimeout(() => setIsInitialized(true), 1000);
      }
    };

    checkAIConnection();
  }, []);

  // Show loading state during initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 mx-auto">
              <Brain className="w-full h-full text-[#fb73ea] animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-[#fb73ea] opacity-30 animate-ping" />
          </div>
          <p className="mt-4 text-gray-400">Initializing Mawari AI Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black animate-gradient-shift">
        <div className="absolute inset-0 bg-gradient-to-t from-[#fb73ea]/10 to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#fb73ea]/10 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-slow-float" />
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 border-b border-[#fb73ea]/20 backdrop-blur-sm bg-black/50 animate-fade-in-down gpu-accelerated">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 animate-slide-in-left">
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#fb73ea] to-purple-600 rounded-lg flex items-center justify-center animate-pulse-glow hover-scale">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#fb73ea]/30 to-purple-600/30 rounded-lg blur-lg group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold glow-text animate-expand-in">
                  Mawari AI Agent{' '}
                  <span className="bg-[#fb73ea]/20 text-[#fb73ea] border border-[#fb73ea]/40 text-lg px-2 py-1 rounded-full animate-pulse hover-brighten inline-block">
                    Unofficial
                  </span>
                </h1>
                <p className="text-gray-400 text-sm animate-slide-and-fade">
                  Your Gateway to the Immersive Internet
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 animate-slide-in-right">
              <div className="flex items-center space-x-2 mr-4 bg-black/50 px-3 py-1 rounded-full cyber-border hover-lift">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isAIConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-pulse'
                  }`}
                />
                <span
                  className={`text-sm transition-colors duration-300 ${
                    isAIConnected ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {isAIConnected ? 'Connected ⚡' : 'Fallback Mode'}
                </span>
              </div>
              <Link href="/mawari-tweets">
                <Button
                  variant="cyber"
                  size="sm"
                  className="hidden md:flex bg-white hover-scale hover-glow smooth-transition"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Tweets
                </Button>
              </Link>
              <Button
                variant="cyber"
                size="sm"
                className="hidden md:flex hover-scale hover-glow smooth-transition"
              >
                <Globe className="w-4 h-4 mr-2" />
                <Link target="_blank" href={'https://mawari.net'}>
                  Mawari.net
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 animate-fade-in-up">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 overflow-hidden">
          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 hover-lift hover-glow gpu-accelerated animate-fade-in-up animate-stagger-1 smooth-transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Network Uptime</p>
                  <p className="text-3xl font-bold text-[#fb73ea] animate-scale-in">99.9%</p>
                  <div className="mt-2 h-1 bg-gradient-to-r from-[#fb73ea]/50 to-transparent rounded-full loading-skeleton" />
                </div>
                <div className="animate-slow-float">
                  <div className="relative">
                    <Shield className="w-10 h-10 text-[#fb73ea] hover-brighten smooth-transition" />
                    <div className="absolute inset-0 bg-[#fb73ea]/20 rounded-full blur-xl animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 hover-lift hover-glow gpu-accelerated animate-fade-in-up animate-stagger-2 smooth-transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Bandwidth Savings</p>
                  <p className="text-3xl font-bold text-[#fb73ea] animate-scale-in">80%</p>
                  <div className="mt-2 h-1 bg-gradient-to-r from-[#fb73ea]/50 to-transparent rounded-full loading-skeleton" />
                </div>
                <div className="animate-float">
                  <div className="relative">
                    <Zap className="w-10 h-10 text-[#fb73ea] hover-brighten smooth-transition" />
                    <div className="absolute inset-0 bg-[#fb73ea]/20 rounded-full blur-xl animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 hover-lift hover-glow gpu-accelerated animate-fade-in-up animate-stagger-3 smooth-transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Global Nodes</p>
                  <p className="text-3xl font-bold text-[#fb73ea] animate-scale-in">50+</p>
                  <div className="mt-2 h-1 bg-gradient-to-r from-[#fb73ea]/50 to-transparent rounded-full loading-skeleton" />
                </div>
                <div className="animate-slow-float">
                  <div className="relative">
                    <Globe className="w-10 h-10 text-[#fb73ea] hover-brighten smooth-transition" />
                    <div className="absolute inset-0 bg-[#fb73ea]/20 rounded-full blur-xl animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 hover-lift hover-glow gpu-accelerated animate-fade-in-up animate-stagger-4 smooth-transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Latency</p>
                  <p className="text-3xl font-bold text-[#fb73ea] animate-scale-in">&lt;10ms</p>
                  <div className="mt-2 h-1 bg-gradient-to-r from-[#fb73ea]/50 to-transparent rounded-full loading-skeleton" />
                </div>
                <div className="animate-pulse-glow">
                  <div className="relative">
                    <Activity className="w-10 h-10 text-[#fb73ea] hover-brighten smooth-transition" />
                    <div className="absolute inset-0 bg-[#fb73ea]/20 rounded-full blur-xl animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-expand-in">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-[#fb73ea]/30 backdrop-blur-sm cyber-border hover-lift smooth-transition">
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-[#fb73ea] data-[state=active]:text-black transition-all duration-300 hover-scale smooth-tab-trigger group"
            >
              <MessageCircle className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              AI Assistant
              {activeTab === 'chat' && (
                <div className="ml-2 w-1 h-1 bg-black rounded-full animate-ping" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-[#fb73ea] data-[state=active]:text-black transition-all duration-300 hover-scale smooth-tab-trigger group"
            >
              <Calendar className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              Events
              {activeTab === 'events' && (
                <div className="ml-2 w-1 h-1 bg-black rounded-full animate-ping" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="network"
              className="data-[state=active]:bg-[#fb73ea] data-[state=active]:text-black transition-all duration-300 hover-scale smooth-tab-trigger group"
            >
              <Activity className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              Network Stats
              {activeTab === 'network' && (
                <div className="ml-2 w-1 h-1 bg-black rounded-full animate-ping" />
              )}
            </TabsTrigger>
          </TabsList>

          <div className="relative min-h-[600px]">
            <TabsContent value="chat" className="mt-6 animate-fade-in tab-content-transition">
              <AIChatbox isAIConnected={isAIConnected} />
            </TabsContent>

            <TabsContent value="events" className="mt-6 animate-fade-in tab-content-transition">
              <EventsTab />
            </TabsContent>

            <TabsContent value="network" className="mt-6 animate-fade-in tab-content-transition">
              <NetworkStats />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 border-t border-[#fb73ea]/20 backdrop-blur-sm bg-black/50 mt-16 animate-slide-in-up">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0 animate-fade-in-left">
              <div className="relative">
                <Brain className="w-5 h-5 text-[#fb73ea] animate-pulse" />
                <div className="absolute inset-0 bg-[#fb73ea]/30 rounded-full blur-sm animate-pulse" />
              </div>
              <span className="text-sm text-gray-400 hover-lift smooth-transition">
                Powered by Sentient dobby AI & Mawari Network
              </span>
            </div>
            <div className="flex items-center space-x-6 animate-fade-in-right">
              <a
                href="https://mawari.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fb73ea] hover:text-[#fb73ea]/80 hover-scale smooth-transition group"
              >
                Official Website
                <div className="w-0 h-0.5 bg-[#fb73ea] group-hover:w-full transition-all duration-300" />
              </a>
              <a
                href="https://docs.mawari.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fb73ea] hover:text-[#fb73ea]/80 hover-scale smooth-transition group"
              >
                Documentation
                <div className="w-0 h-0.5 bg-[#fb73ea] group-hover:w-full transition-all duration-300" />
              </a>
              <a
                href="https://fireworks.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fb73ea] hover:text-[#fb73ea]/80 hover-scale smooth-transition group"
              >
                Sentient
                <div className="w-0 h-0.5 bg-[#fb73ea] group-hover:w-full transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <NoSSR
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 mx-auto">
                <Brain className="w-full h-full text-[#fb73ea] animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-[#fb73ea] opacity-30 animate-ping" />
            </div>
            <p className="mt-4 text-gray-400">Initializing Mawari AI Agent...</p>
          </div>
        </div>
      }
    >
      <InteractiveContent />
    </NoSSR>
  );
}
