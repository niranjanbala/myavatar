'use client';

import { useState } from 'react';
import { PersonaTag } from '@/types';
import SwipeDeck from '@/components/SwipeDeck';
import PersonalityFilter from '@/components/PersonalityFilter';
import Link from 'next/link';

export default function HomePage() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaTag | undefined>();

  const handlePersonaChange = (persona?: PersonaTag) => {
    setSelectedPersona(persona);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎭 Avatar Voting
          </h1>
          <p className="text-gray-600 mb-6">
            Swipe right to upvote 👍 or left to downvote 👎
          </p>
          
          {/* Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <Link
              href="/leaderboard"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              🏆 View Leaderboard
            </Link>
          </div>
        </div>

        {/* Personality Filter */}
        <PersonalityFilter
          selectedPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
        />

        {/* Swipe Deck */}
        <div className="flex justify-center mb-8">
          <SwipeDeck selectedPersona={selectedPersona} />
        </div>

        {/* Instructions */}
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              How to Vote
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Swipe Right or tap 👍</span>
                <span className="text-green-600 font-medium">Upvote</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Swipe Left or tap 👎</span>
                <span className="text-red-600 font-medium">Downvote</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs">
                  Your votes are anonymous and stored locally on your device.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Built with Next.js 15, Supabase, and HeyGen API
          </p>
        </div>
      </div>
    </div>
  );
}
