'use client';

import { useState, useEffect } from 'react';
import { AvatarWithVotes, PersonaTag } from '@/types';
import PersonalityFilter from '@/components/PersonalityFilter';
import Image from 'next/image';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<AvatarWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaTag | undefined>();

  const fetchLeaderboard = async (persona?: PersonaTag) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: '50',
      });

      if (persona) {
        params.append('persona', persona);
      }

      const response = await fetch(`/api/leaderboard?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedPersona);
  }, [selectedPersona]);

  const handlePersonaChange = (persona?: PersonaTag) => {
    setSelectedPersona(persona);
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getPersonaEmoji = (persona: string) => {
    const emojiMap: Record<string, string> = {
      funny: '😂',
      serious: '🎯',
      quirky: '🤪',
      techy: '💻',
      diva: '💅',
      hacker: '🔒',
    };
    return emojiMap[persona] || '🎭';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            ← Back to Voting
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏆 Leaderboard
          </h1>
          <p className="text-gray-600">
            See which avatars are winning hearts!
          </p>
        </div>

        {/* Personality Filter */}
        <PersonalityFilter
          selectedPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchLeaderboard(selectedPersona)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Leaderboard */}
        {!loading && !error && (
          <div className="max-w-4xl mx-auto">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No avatars found for this category yet.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Start Voting
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((avatar, index) => (
                  <div
                    key={avatar.id}
                    className={`bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl ${
                      index < 3 ? 'border-2 border-yellow-300' : ''
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      {/* Rank */}
                      <div className="text-2xl font-bold min-w-[60px] text-center">
                        {getRankEmoji(index + 1)}
                      </div>

                      {/* Avatar Image */}
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
                        <Image
                          src={avatar.image_url}
                          alt="Avatar"
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            {getPersonaEmoji(avatar.persona_tag)} {avatar.persona_tag}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {avatar.voice_type}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-2 line-clamp-2">
                          {avatar.script}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="text-right min-w-[120px]">
                        <div className="text-2xl font-bold text-gray-800 mb-1">
                          {avatar.vote_count}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          total votes
                        </div>
                        <div className="flex items-center justify-end gap-4 text-sm">
                          <span className="text-green-600 font-medium">
                            👍 {avatar.up_votes}
                          </span>
                          <span className="text-red-600 font-medium">
                            👎 {avatar.down_votes}
                          </span>
                        </div>
                        {avatar.vote_count > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round((avatar.up_votes / avatar.vote_count) * 100)}% approval
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}