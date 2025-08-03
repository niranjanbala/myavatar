'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar, PersonaTag } from '@/types';
import { getDeviceId, markAvatarAsVoted } from '@/lib/device';
import SwipeCard from './SwipeCard';
import { motion, AnimatePresence } from 'framer-motion';

interface SwipeDeckProps {
  selectedPersona?: PersonaTag;
}

export default function SwipeDeck({ selectedPersona }: SwipeDeckProps) {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');

  // Initialize device ID
  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  // Fetch avatars
  const fetchAvatars = useCallback(async (offset = 0) => {
    try {
      const params = new URLSearchParams({
        limit: '10',
        offset: offset.toString(),
      });

      if (selectedPersona) {
        params.append('persona', selectedPersona);
      }

      const response = await fetch(`/api/avatars?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch avatars');
      }

      const data = await response.json();
      return data.avatars || [];
    } catch (error) {
      console.error('Error fetching avatars:', error);
      throw error;
    }
  }, [selectedPersona]);

  // Initial load
  useEffect(() => {
    const loadInitialAvatars = async () => {
      try {
        setLoading(true);
        setError(null);
        const initialAvatars = await fetchAvatars(0);
        setAvatars(initialAvatars);
        setCurrentIndex(0);
      } catch {
        setError('Neural network connection failed. Retrying...');
      } finally {
        setLoading(false);
      }
    };

    loadInitialAvatars();
  }, [fetchAvatars]);

  // Prefetch more avatars when running low
  useEffect(() => {
    const prefetchMore = async () => {
      if (avatars.length - currentIndex <= 2 && avatars.length > 0) {
        try {
          const moreAvatars = await fetchAvatars(avatars.length);
          setAvatars(prev => [...prev, ...moreAvatars]);
        } catch (err) {
          console.error('Error prefetching avatars:', err);
        }
      }
    };

    prefetchMore();
  }, [currentIndex, avatars.length, fetchAvatars]);

  // Handle vote submission
  const submitVote = async (avatarId: string, voteType: 'up' | 'down') => {
    if (!deviceId) return;

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar_id: avatarId,
          device_id: deviceId,
          vote_type: voteType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Vote submission failed:', errorData.error);
      } else {
        markAvatarAsVoted(avatarId);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  // Handle swipe
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentAvatar = avatars[currentIndex];
    if (!currentAvatar) return;

    const voteType = direction === 'right' ? 'up' : 'down';
    submitVote(currentAvatar.id, voteType);

    // Move to next avatar
    setCurrentIndex(prev => prev + 1);
  };

  // Reset deck (for testing or when changing filters)
  const resetDeck = () => {
    setCurrentIndex(0);
    setAvatars([]);
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-void">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="cyber-loading mb-6" />
          <div className="neon-text font-mono text-lg mb-2">
            INITIALIZING NEURAL NETWORK
          </div>
          <div className="text-text-muted font-mono text-sm">
            Loading digital personalities...
          </div>
          
          {/* Loading Animation */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-neon-cyan rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-void">
        <motion.div
          className="text-center cyber-card p-8 max-w-md mx-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">⚠️</div>
          <div className="neon-pink-text font-mono text-xl mb-4 font-bold">
            NEURAL NETWORK ERROR
          </div>
          <p className="text-text-secondary mb-6 font-mono text-sm">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="cyber-btn w-full"
          >
            RECONNECT TO MATRIX
          </button>
        </motion.div>
      </div>
    );
  }

  if (currentIndex >= avatars.length) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-void">
        <motion.div
          className="text-center cyber-card p-8 max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <div className="neon-green-text font-mono text-xl mb-4 font-bold">
            NEURAL SCAN COMPLETE
          </div>
          <p className="text-text-secondary mb-6 font-mono text-sm">
            You&apos;ve explored all available digital personalities.
            Check the rankings to see the collective neural consensus.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={resetDeck}
              className="cyber-btn w-full"
            >
              RESTART EXPLORATION
            </button>
            <button
              onClick={() => window.location.href = '/leaderboard'}
              className="cyber-btn w-full border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-void-black"
            >
              VIEW NEURAL RANKINGS
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {/* Full-Screen Swipe Cards */}
      <AnimatePresence mode="wait">
        {avatars.slice(currentIndex, currentIndex + 3).map((avatar, index) => (
          <SwipeCard
            key={avatar.id}
            avatar={avatar}
            onSwipe={handleSwipe}
            isTop={index === 0}
          />
        ))}
      </AnimatePresence>

      {/* Progress Indicator - Minimal */}
      <motion.div 
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 minimal-ui px-4 py-2 rounded-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, avatars.length))].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i < currentIndex 
                    ? 'bg-neon-green' 
                    : i === currentIndex 
                    ? 'bg-neon-cyan animate-pulse' 
                    : 'bg-steel-gray'
                }`}
              />
            ))}
          </div>
          <span className="text-text-muted font-mono text-xs">
            {currentIndex + 1}/{avatars.length}
          </span>
        </div>
      </motion.div>

      {/* Neural Activity Indicator */}
      <motion.div
        className="fixed bottom-4 left-4 z-50 minimal-ui p-2 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-neon-green font-mono text-xs">NEURAL</span>
        </div>
      </motion.div>

      {/* Swipe Counter */}
      <motion.div
        className="fixed bottom-4 right-4 z-50 minimal-ui p-2 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="text-text-muted font-mono text-xs">
          {currentIndex} SCANNED
        </div>
      </motion.div>
    </div>
  );
}