'use client';

import { useState, useEffect } from 'react';
import { Tweet } from '@/lib/twitter';
import { twitterService } from '@/lib/twitter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingAnimation } from '@/components/ui/animations';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  ExternalLink,
  User,
  Calendar,
  Image as ImageIcon,
  Video,
  Link,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Sparkles,
} from 'lucide-react';

interface MawariTweetFeedProps {
  onClose?: () => void;
  initialTweets?: Tweet[];
}

const MawariTweetFeed: React.FC<MawariTweetFeedProps> = ({ onClose, initialTweets = [] }) => {
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets);
  const [loading, setLoading] = useState(initialTweets.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const tweetsPerPage = 20;

  useEffect(() => {
    if (initialTweets.length === 0) {
      loadMawariTweets();
    }
  }, []);

  const loadMawariTweets = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize Twitter service if not already done
      if (!twitterService.isReady()) {
        await twitterService.initialize();
      }

      // Get tweets specifically from MawariNetwork
      const mawariTweets = twitterService.getTweetsByUsername('MawariNetwork');

      if (mawariTweets.length === 0) {
        // Fallback to tweets that mention Mawari
        const mentionTweets = twitterService
          .getTweets()
          .filter(
            (tweet) =>
              tweet.text.toLowerCase().includes('mawari') ||
              tweet.hashtags?.some((tag) => tag.toLowerCase().includes('mawari')),
          );
        setTweets(mentionTweets.slice(0, tweetsPerPage));
      } else {
        setTweets(mawariTweets.slice(0, tweetsPerPage));
      }
    } catch (err) {
      setError('Failed to load Mawari tweets. Please try again later.');
      console.error('Error loading Mawari tweets:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleEngage = async (action: 'like' | 'retweet' | 'reply') => {
    // Placeholder for engagement actions
    console.log(`User wants to ${action} a tweet`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedTweets = tweets.slice(page * tweetsPerPage, (page + 1) * tweetsPerPage);
  const hasNextPage = (page + 1) * tweetsPerPage < tweets.length;
  const hasPrevPage = page > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingAnimation message="Loading Mawari tweets..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30 max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="text-red-400 mb-4">
              <X className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button variant="cyber" onClick={loadMawariTweets} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#fb73ea]/20 backdrop-blur-sm bg-black/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-[#fb73ea]/10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#fb73ea] to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold glow-text">@MawariXr</h1>
                  <p className="text-sm text-gray-400">Tweets from Mawari Network</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">{tweets.length} tweets</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={loadMawariTweets}
                className="hover:bg-[#fb73ea]/10"
              >
                <Calendar className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tweet Feed */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {paginatedTweets.length === 0 ? (
          <Card className="cyber-border bg-black/50 backdrop-blur-sm border-[#fb73ea]/30">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No tweets found</h3>
              <p className="text-gray-400">No Mawari Network tweets are available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paginatedTweets.map((tweet, index) => (
              <Card
                key={tweet.id}
                className="cyber-border bg-black/30 backdrop-blur-sm border-[#fb73ea]/20 hover:border-[#fb73ea]/40 transition-all duration-300 hover:bg-black/40 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {tweet.author.profileImageUrl ? (
                        <img
                          src={tweet.author.profileImageUrl}
                          alt={tweet.author.name}
                          className="w-12 h-12 rounded-full border-2 border-[#fb73ea]/30"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-[#fb73ea] to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Tweet Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-white hover:underline cursor-pointer">
                          {tweet.author.name}
                        </h4>
                        <span className="text-gray-400 text-sm">@{tweet.author.username}</span>
                        <span className="text-gray-600 text-sm">·</span>
                        <span className="text-gray-400 text-sm">
                          {formatTimeAgo(tweet.createdAt)}
                        </span>
                        <div className="flex-1" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-[#fb73ea]/10 h-8 w-8"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>

                      {/* Tweet Text */}
                      <div className="text-white mb-3 whitespace-pre-wrap break-words">
                        {tweet.text}
                      </div>

                      {/* Media */}
                      {tweet.media && tweet.media.length > 0 && (
                        <div className="mb-3">
                          {tweet.media.length === 1 ? (
                            <div className="rounded-xl overflow-hidden border border-[#fb73ea]/20">
                              {tweet.media[0].type === 'photo' ? (
                                <img
                                  src={tweet.media[0].url}
                                  alt="Tweet media"
                                  className="w-full cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() => setSelectedImage(tweet.media![0].url)}
                                />
                              ) : (
                                <div className="flex items-center justify-center bg-gray-900 h-64">
                                  <Video className="w-12 h-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              {tweet.media.map((media, idx) => (
                                <div
                                  key={idx}
                                  className="rounded-xl overflow-hidden border border-[#fb73ea]/20 aspect-video"
                                >
                                  {media.type === 'photo' ? (
                                    <img
                                      src={media.url}
                                      alt={`Tweet media ${idx + 1}`}
                                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => setSelectedImage(media.url)}
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center bg-gray-900 h-full">
                                      <Video className="w-8 h-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Links */}
                      {tweet.urls && tweet.urls.length > 0 && (
                        <div className="mb-3 space-y-2">
                          {tweet.urls.map((url, idx) => (
                            <a
                              key={idx}
                              href={url.expandedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-[#fb73ea] hover:text-[#fb73ea]/80 transition-colors text-sm"
                            >
                              <Link className="w-3 h-3" />
                              <span>{url.displayUrl}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Hashtags */}
                      {tweet.hashtags && tweet.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {tweet.hashtags.map((hashtag, idx) => (
                            <span
                              key={idx}
                              className="text-sm text-[#fb73ea] hover:text-[#fb73ea]/80 cursor-pointer transition-colors"
                            >
                              #{hashtag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Engagement Actions */}
                      <div className="flex items-center space-x-6 mt-4 pt-3 border-t border-gray-800">
                        <button
                          onClick={() => handleEngage('reply')}
                          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors group"
                        >
                          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm">{formatNumber(tweet.metrics.replyCount)}</span>
                        </button>

                        <button
                          onClick={() => handleEngage('retweet')}
                          className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors group"
                        >
                          <Repeat2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm">
                            {formatNumber(tweet.metrics.retweetCount)}
                          </span>
                        </button>

                        <button
                          onClick={() => handleEngage('like')}
                          className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors group"
                        >
                          <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm">{formatNumber(tweet.metrics.likeCount)}</span>
                        </button>

                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors group">
                          <Share className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {tweets.length > tweetsPerPage && (
          <div className="flex items-center justify-center space-x-4 mt-8">
            <Button
              variant="cyber"
              disabled={!hasPrevPage}
              onClick={() => setPage(page - 1)}
              className="px-4"
            >
              Previous
            </Button>
            <span className="text-gray-400 text-sm">
              Showing {page * tweetsPerPage + 1}-
              {Math.min((page + 1) * tweetsPerPage, tweets.length)} of {tweets.length}
            </span>
            <Button
              variant="cyber"
              disabled={!hasNextPage}
              onClick={() => setPage(page + 1)}
              className="px-4"
            >
              Next
            </Button>
          </div>
        )}

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#fb73ea] hover:bg-[#fb73ea]/80 text-black p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-30"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt="Full size image"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default MawariTweetFeed;
