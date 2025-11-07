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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#fb73ea] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Mawari Network Events</h2>
          <p className="text-gray-400">
            Stay updated with the latest happenings in the Mawari ecosystem
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="cyber" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Subscribe to Calendar
          </Button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ value, label }) => (
          <Button
            key={value}
            variant={activeFilter === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(value)}
            className={
              activeFilter === value
                ? 'bg-[#fb73ea] text-black'
                : 'border-[#fb73ea]/30 text-gray-300 hover:border-[#fb73ea]'
            }
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Upcoming Events */}
      {getFilteredUpcomingEvents().length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-[#fb73ea]" />
            Upcoming Events
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredUpcomingEvents().map((event) => (
              <Card
                key={event.id}
                className={`cyber-border bg-black/50 backdrop-blur-sm ${getEventColor(
                  event.type,
                )} hover:scale-105 transition-all duration-300`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getEventIcon(event.type)}
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {event.type.replace('_', ' ')}
                      </span>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>
                  <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300 line-clamp-3">{event.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.startTime)}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(event.startTime)}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <span className="text-xs text-gray-500">
                      {getTimeUntil(event.startTime)} from now
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#fb73ea] hover:text-[#fb73ea]/80"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Live Event */}
      {events.some((event) => event.status === 'live') && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-lg animate-pulse" />
          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-red-500/50 relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <h3 className="text-xl font-bold text-red-400">LIVE NOW</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join Stream
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {events
                .filter((event) => event.status === 'live')
                .map((event) => (
                  <div key={event.id} className="text-center py-4">
                    <h4 className="text-2xl font-bold mb-2">{event.title}</h4>
                    <p className="text-gray-300 mb-4">{event.description}</p>
                    <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees || 0} attending
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
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
