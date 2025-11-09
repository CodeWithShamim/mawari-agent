'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Loader2,
  Badge,
  Twitter,
} from 'lucide-react';
import AIChatbox from '@/components/AIChatbox';
import EventsTab from '@/components/EventsTab';
import NetworkStats from '@/components/NetworkStats';
import { romaService } from '@/lib/roma';
import { LoadingAnimation } from '@/components/ui/animations';
import Link from 'next/link';

export default function HomePage() {
  const [isROMAConnected, setIsROMAConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check ROMA-DSPy service availability
    const checkROMAConnection = async () => {
      try {
        const response = await fetch('/api/roma-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: 'ROMA system check - are you operational?',
          }),
        });

        const data = await response.json();
        setIsROMAConnected(data.success);
      } catch (error) {
        console.warn('ROMA-DSPy service not available, using fallback mode');
        setIsROMAConnected(false);
      } finally {
        // Add a small delay for smooth loading animation
        setTimeout(() => setIsInitialized(true), 1000);
      }
    };

    checkROMAConnection();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingAnimation message="Initializing Mawari AI Agent..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black">
        <div className="absolute inset-0 bg-gradient-to-t from-[#fb73ea]/10 to-transparent animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#fb73ea]/20 backdrop-blur-sm bg-black/50 animate-fade-in">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#fb73ea] to-purple-600 rounded-lg flex items-center justify-center animate-pulse-glow">
                  <Network className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold glow-text">
                  Mawari AI Agent{' '}
                  <span className="bg-[#fb73ea]/20 text-[#fb73ea] border border-[#fb73ea]/40 text-lg animate-pulse">
                    Unofficial
                  </span>
                </h1>

                <p className="text-gray-400 text-sm">Your Gateway to the Immersive Internet</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 mr-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isROMAConnected ? 'bg-green-500' : 'bg-yellow-500'
                  } animate-pulse`}
                />
                <span className="text-sm text-gray-400">
                  {isROMAConnected ? 'ROMA-DSPy Active' : 'Fallback Mode'}
                </span>
              </div>
              <Link href="/mawari-tweets">
                <Button variant="cyber" size="sm" className="hidden md:flex bg-white">
                  <Twitter className="w-4 h-4 mr-2" />
                  Tweets
                </Button>
              </Link>
              <Button variant="cyber" size="sm" className="hidden md:flex">
                <Globe className="w-4 h-4 mr-2" />
                <Link target="_blank" href={'https://mawari.net'}>
                  Mawari.net
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Network Uptime</p>
                  <p className="text-2xl font-bold text-[#fb73ea]">99.9%</p>
                </div>
                <div className="animate-spin-slow">
                  <Shield className="w-8 h-8 text-[#fb73ea]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Bandwidth Savings</p>
                  <p className="text-2xl font-bold text-[#fb73ea]">80%</p>
                </div>
                <div className="animate-pulse">
                  <Zap className="w-8 h-8 text-[#fb73ea]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Global Nodes</p>
                  <p className="text-2xl font-bold text-[#fb73ea]">50+</p>
                </div>
                <div className="animate-float">
                  <Globe className="w-8 h-8 text-[#fb73ea]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Latency</p>
                  <p className="text-2xl font-bold text-[#fb73ea]">&lt;10ms</p>
                </div>
                <div className="animate-pulse-glow">
                  <Activity className="w-8 h-8 text-[#fb73ea]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-[#fb73ea]/30 backdrop-blur-sm">
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-[#fb73ea] data-[state=active]:text-black transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-[#fb73ea] data-[state=active]:text-black transition-all duration-300"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger
              value="network"
              className="data-[state=active]:bg-[#fb73ea] data-[state=active]:text-black transition-all duration-300"
            >
              <Activity className="w-4 h-4 mr-2" />
              Network Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <AIChatbox isROMAConnected={isROMAConnected} />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventsTab />
          </TabsContent>

          <TabsContent value="network" className="mt-6">
            <NetworkStats />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#fb73ea]/20 backdrop-blur-sm bg-black/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="w-5 h-5 text-[#fb73ea]" />
              <span className="text-sm text-gray-400">
                Powered by ROMA (Sentient AGI) & Mawari Network
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://mawari.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fb73ea] hover:text-[#fb73ea]/80 transition-colors"
              >
                Official Website
              </a>
              <a
                href="https://docs.mawari.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fb73ea] hover:text-[#fb73ea]/80 transition-colors"
              >
                Documentation
              </a>
              <a
                href="https://github.com/sentient-agi/ROMA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fb73ea] hover:text-[#fb73ea]/80 transition-colors"
              >
                ROMA Framework
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
