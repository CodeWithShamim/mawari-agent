'use client';

import { useState, useEffect } from 'react';
import MawariTweetFeed from '@/components/MawariTweetFeed';
import { twitterService } from '@/lib/twitter';
import { LoadingAnimation } from '@/components/ui/animations';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MawariTweetsPage() {
  const [initialTweets, setInitialTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloadTweets = async () => {
      try {
        if (!twitterService.isReady()) {
          await twitterService.initialize();
        }

        // Get tweets specifically from MawariNetwork
        const mawariTweets = twitterService.getTweetsByUsername('MawariNetwork');

        if (mawariTweets.length === 0) {
          // Fallback to tweets that mention Mawari
          const mentionTweets = twitterService.getTweets().filter(tweet =>
            tweet.text.toLowerCase().includes('mawari') ||
            tweet.hashtags?.some(tag => tag.toLowerCase().includes('mawari'))
          );
          setInitialTweets(mentionTweets.slice(0, 20));
        } else {
          setInitialTweets(mawariTweets.slice(0, 20));
        }
      } catch (error) {
        console.error('Error preloading tweets:', error);
      } finally {
        setLoading(false);
      }
    };

    preloadTweets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingAnimation message="Loading Mawari tweets..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950 to-black">
        <div className="absolute inset-0 bg-gradient-to-t from-[#fb73ea]/10 to-transparent animate-pulse" />
      </div>

      {/* Back button */}
      <div className="relative z-10 pt-4 px-4">
        <Link href="/">
          <Button variant="cyber" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Tweet Feed */}
      <div className="relative z-10">
        <MawariTweetFeed initialTweets={initialTweets} />
      </div>
    </div>
  );
}