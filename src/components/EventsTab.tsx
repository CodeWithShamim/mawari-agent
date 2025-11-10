'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  Video,
  MessageCircle,
  Trophy,
  Zap,
} from 'lucide-react';
import { discordService, DiscordEvent } from '@/lib/discord';
import { twitterService } from '@/lib/twitter';

export default function EventsTab() {
  const [events, setEvents] = useState<DiscordEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<DiscordEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<DiscordEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'ama' | 'tech_talk' | 'community' | 'announcement'
  >('all');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);

        // Initialize Discord service if not already done
        await discordService.initialize();

        // Get all events
        const allEvents = discordService.getAllEvents(20);
        setEvents(allEvents);

        // Filter into upcoming and past
        const now = new Date();
        const upcoming = allEvents.filter((event) => event.startTime > now);
        const past = allEvents.filter((event) => event.startTime <= now);

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();

    // Refresh events every 5 minutes
    const interval = setInterval(loadEvents, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getFilteredEvents = () => {
    if (activeFilter === 'all') return events;
    return events.filter((event) => event.type === activeFilter);
  };

  const getFilteredUpcomingEvents = () => {
    if (activeFilter === 'all') return upcomingEvents;
    return upcomingEvents.filter((event) => event.type === activeFilter);
  };

  const getFilteredPastEvents = () => {
    if (activeFilter === 'all') return pastEvents;
    return pastEvents.filter((event) => event.type === activeFilter);
  };

  const getEventIcon = (type: DiscordEvent['type']) => {
    switch (type) {
      case 'ama':
        return <MessageCircle className="w-5 h-5" />;
      case 'tech_talk':
        return <Trophy className="w-5 h-5" />;
      case 'community':
        return <Users className="w-5 h-5" />;
      case 'announcement':
        return <Zap className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: DiscordEvent['type']) => {
    switch (type) {
      case 'ama':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'tech_talk':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'community':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'announcement':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default:
        return 'text-[#fb73ea] bg-[#fb73ea]/10 border-[#fb73ea]/30';
    }
  };

  const getStatusBadge = (status: DiscordEvent['status']) => {
    switch (status) {
      case 'live':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full animate-pulse">
            🔴 LIVE
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-600 text-gray-200 rounded-full">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-[#fb73ea] text-black rounded-full">
            Upcoming
          </span>
        );
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) return '';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const filterButtons = [
    { value: 'all', label: 'All Events' },
    { value: 'ama', label: 'AMA Sessions' },
    { value: 'tech_talk', label: 'Tech Talks' },
    { value: 'community', label: 'Community' },
    { value: 'announcement', label: 'Announcements' },
  ] as const;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 border-2 border-[#fb73ea]/30 border-t-[#fb73ea] rounded-full animate-spin-slow" />
            <div className="absolute inset-2 border border-[#fb73ea]/20 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-4 border border-[#fb73ea]/10 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '1s' }} />
          </div>
          <div className="space-y-2">
            <p className="text-gray-400 animate-pulse">Loading events...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-1 h-1 bg-[#fb73ea] rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-[#fb73ea] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-1 bg-[#fb73ea] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 animate-slide-in-down">
        <div className="animate-expand-in">
          <h2 className="text-2xl font-bold mb-2 glow-text">Mawari Network Events</h2>
          <p className="text-gray-400 animate-slide-and-fade">
            Stay updated with the latest happenings in the Mawari ecosystem
          </p>
        </div>
        <div className="flex items-center space-x-4 animate-slide-in-right">
          <Button variant="cyber" size="sm" className="hover-scale hover-glow smooth-transition group">
            <Calendar className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Subscribe to Calendar
          </Button>
        </div>
      </div>

      {/* Enhanced Filter Buttons */}
      <div className="flex flex-wrap gap-2 animate-fade-in-up">
        {filterButtons.map(({ value, label }, index) => (
          <Button
            key={value}
            variant={activeFilter === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(value)}
            className={`smooth-transition hover-scale ${
              activeFilter === value
                ? 'bg-[#fb73ea] text-black shadow-lg shadow-[#fb73ea]/30 animate-scale-in'
                : 'border-[#fb73ea]/30 text-gray-300 hover:border-[#fb73ea] hover:bg-[#fb73ea]/10'
            } animate-stagger-${index + 1}`}
          >
            {label}
            {activeFilter === value && (
              <div className="ml-2 w-1 h-1 bg-black rounded-full animate-ping" />
            )}
          </Button>
        ))}
      </div>

      {/* Enhanced Upcoming Events */}
      {getFilteredUpcomingEvents().length > 0 && (
        <div className="animate-expand-in">
          <h3 className="text-xl font-bold mb-4 flex items-center animate-slide-in-left">
            <div className="relative mr-2">
              <Calendar className="w-5 h-5 text-[#fb73ea] animate-pulse" />
              <div className="absolute inset-0 bg-[#fb73ea]/30 rounded-full blur-sm animate-pulse" />
            </div>
            Upcoming Events
            <div className="ml-2 w-2 h-2 bg-[#fb73ea] rounded-full animate-ping" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredUpcomingEvents().map((event, index) => (
              <Card
                key={event.id}
                className={`cyber-border bg-black/50 backdrop-blur-sm ${getEventColor(
                  event.type,
                )} hover-lift hover-glow gpu-accelerated smooth-transition animate-stagger-${
                  (index % 6) + 1
                } group relative overflow-hidden`}
              >
                {/* Add shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />

                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="group-hover:animate-bounce">
                        {getEventIcon(event.type)}
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wider animate-slide-and-fade">
                        {event.type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="animate-scale-in">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-[#fb73ea] transition-colors duration-300">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  <p className="text-sm text-gray-300 line-clamp-3 animate-slide-and-fade">
                    {event.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400 hover:text-gray-300 smooth-transition group/item">
                      <Calendar className="w-4 h-4 mr-2 group-hover/item:animate-bounce" />
                      {formatDate(event.startTime)}
                    </div>
                    <div className="flex items-center text-sm text-gray-400 hover:text-gray-300 smooth-transition group/item">
                      <Clock className="w-4 h-4 mr-2 group-hover/item:animate-bounce" style={{ animationDelay: '0.1s' }} />
                      {formatTime(event.startTime)}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-400 hover:text-gray-300 smooth-transition group/item">
                        <MapPin className="w-4 h-4 mr-2 group-hover/item:animate-bounce" style={{ animationDelay: '0.2s' }} />
                        {event.location}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-700 group-hover:border-[#fb73ea]/30 smooth-transition">
                    <span className="text-xs text-gray-500 group-hover:text-gray-400 smooth-transition">
                      {getTimeUntil(event.startTime)} from now
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#fb73ea] hover:text-[#fb73ea]/80 hover:scale-110 smooth-transition group/button"
                    >
                      <ExternalLink className="w-3 h-3 mr-1 group-hover/button:translate-x-0.5 transition-transform" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Live Event with dramatic animations */}
      {events.some((event) => event.status === 'live') && (
        <div className="relative animate-bounce-in">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg animate-pulse-glow" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-shimmer" />
          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-red-500/50 relative hover-lift hover-glow smooth-transition">
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
                  </div>
                  <h3 className="text-xl font-bold text-red-400 animate-pulse-glow">
                    🔴 LIVE NOW
                  </h3>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white hover-scale hover-glow smooth-transition group"
                >
                  <Video className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Join Stream
                  <div className="ml-2 w-1 h-1 bg-red-400 rounded-full animate-ping" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="relative">
              {events
                .filter((event) => event.status === 'live')
                .map((event) => (
                  <div key={event.id} className="text-center py-4 animate-scale-in">
                    <h4 className="text-2xl font-bold mb-2 glow-text animate-pulse">{event.title}</h4>
                    <p className="text-gray-300 mb-4 animate-slide-and-fade">{event.description}</p>
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center hover:text-gray-300 smooth-transition group/item">
                        <Users className="w-4 h-4 mr-2 group-hover/item:animate-bounce" />
                        <span className="font-medium">{event.attendees || 0}</span> attending
                      </div>
                      <div className="flex items-center hover:text-gray-300 smooth-transition group/item">
                        <Clock className="w-4 h-4 mr-2 group-hover/item:animate-bounce" />
                        Started recently
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Past Events */}
      {getFilteredPastEvents().length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-400" />
            Past Events
          </h3>
          <div className="space-y-4">
            {getFilteredPastEvents()
              .slice(0, 5)
              .map((event) => (
                <Card
                  key={event.id}
                  className="cyber-border bg-black/30 backdrop-blur-sm border-gray-700/50 hover:border-[#fb73ea]/30 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getEventIcon(event.type)}
                          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            {event.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(event.startTime)}
                          </span>
                        </div>
                        <h4 className="font-semibold mb-1">{event.title}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2">{event.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {getStatusBadge(event.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-[#fb73ea]"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* No Events */}
      {getFilteredEvents().length === 0 && (
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 text-center py-12">
          <Calendar className="w-12 h-12 text-[#fb73ea] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No Events Found</h3>
          <p className="text-gray-400">
            {activeFilter === 'all'
              ? 'No events are currently scheduled. Check back soon!'
              : `No ${activeFilter.replace('_', ' ')} events are currently scheduled.`}
          </p>
        </Card>
      )}
    </div>
  );
}
