'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar, PersonaTag } from '@/types';
import { getDeviceId, markAvatarAsVoted } from '@/lib/device';
import SwipeCard from './SwipeCard';

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
      } catch (error) {
        setError('Failed to load avatars. Please try again.');
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
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (currentIndex >= avatars.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          🎉 You&apos;ve seen all avatars!
        </h3>
        <p className="text-gray-600 mb-6">
          Check out the leaderboard to see the results
        </p>
        <button
          onClick={resetDeck}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-96 md:h-[500px]">
      {/* Render up to 3 cards for smooth transitions */}
      {avatars.slice(currentIndex, currentIndex + 3).map((avatar, index) => (
        <SwipeCard
          key={avatar.id}
          avatar={avatar}
          onSwipe={handleSwipe}
          isTop={index === 0}
        />
      ))}

      {/* Progress indicator */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
        <div className="bg-white rounded-full px-4 py-2 shadow-lg">
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {avatars.length}
          </span>
        </div>
      </div>
    </div>
  );
}