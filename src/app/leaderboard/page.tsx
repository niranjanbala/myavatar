'use client';

import { useState, useEffect } from 'react';
import { AvatarWithVotes, PersonaTag } from '@/types';
import PersonalityFilter from '@/components/PersonalityFilter';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type TimeFilter = 'all' | 'week' | 'month';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<AvatarWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaTag | undefined>();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');

  const fetchLeaderboard = async (persona?: PersonaTag, time: TimeFilter = 'week') => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: '50',
        timeframe: time,
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
      setError('Neural network connection failed. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedPersona, timeFilter);
  }, [selectedPersona, timeFilter]);

  const handlePersonaChange = (persona?: PersonaTag) => {
    setSelectedPersona(persona);
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { emoji: '👑', label: 'PRIME', color: 'neon-cyan' };
    if (rank === 2) return { emoji: '⚡', label: 'ALPHA', color: 'neon-pink' };
    if (rank === 3) return { emoji: '🔥', label: 'BETA', color: 'neon-purple' };
    return { emoji: `#${rank}`, label: 'AGENT', color: 'text-secondary' };
  };

  const getPersonaEmoji = (persona: string) => {
    const emojiMap: Record<string, string> = {
      funny: '😂', serious: '🎯', quirky: '🌟', techy: '⚡', diva: '💎', hacker: '🔒',
    };
    return emojiMap[persona] || '🤖';
  };

  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      {/* Cyber Particles Background */}
      <div className="cyber-particles">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="neon-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 minimal-ui m-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-3 hover:text-neon-cyan transition-colors">
            <span className="text-lg">←</span>
            <span className="neon-text font-mono text-lg font-bold">NEURAL.RANKINGS</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span className="text-neon-green font-mono text-sm">LIVE</span>
          </div>
        </div>
      </motion.header>

      <div className="pt-20 pb-20">
        {/* Time Filter */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="minimal-ui rounded-full p-1">
            <div className="flex items-center gap-1">
              {(['week', 'month', 'all'] as TimeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-full font-mono text-sm transition-all ${
                    timeFilter === filter
                      ? 'bg-neon-cyan text-void-black font-bold'
                      : 'text-text-secondary hover:text-neon-cyan'
                  }`}
                >
                  {filter.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="flex justify-center gap-4 mb-8 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="minimal-ui px-4 py-2 rounded-lg text-center">
            <div className="neon-cyan-text font-mono text-lg font-bold">
              {leaderboard.length}
            </div>
            <div className="text-text-muted font-mono text-xs">AGENTS</div>
          </div>
          <div className="minimal-ui px-4 py-2 rounded-lg text-center">
            <div className="neon-pink-text font-mono text-lg font-bold">
              {leaderboard.reduce((sum, agent) => sum + agent.vote_count, 0)}
            </div>
            <div className="text-text-muted font-mono text-xs">VOTES</div>
          </div>
          <div className="minimal-ui px-4 py-2 rounded-lg text-center">
            <div className="neon-green-text font-mono text-lg font-bold">
              {timeFilter === 'week' ? '7D' : timeFilter === 'month' ? '30D' : 'ALL'}
            </div>
            <div className="text-text-muted font-mono text-xs">PERIOD</div>
          </div>
        </motion.div>

        {/* Personality Filter */}
        <div className="px-4 mb-8">
          <PersonalityFilter
            selectedPersona={selectedPersona}
            onPersonaChange={handlePersonaChange}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="cyber-loading mb-4" />
              <div className="neon-text font-mono text-sm">
                SCANNING NEURAL NETWORK
              </div>
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-20 px-4">
            <motion.div
              className="cyber-card p-6 max-w-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-4xl mb-4">⚠️</div>
              <div className="neon-pink-text font-mono text-lg mb-4 font-bold">
                NEURAL ERROR
              </div>
              <p className="text-text-secondary mb-6 font-mono text-sm">{error}</p>
              <button
                onClick={() => fetchLeaderboard(selectedPersona, timeFilter)}
                className="cyber-btn w-full"
              >
                RECONNECT
              </button>
            </motion.div>
          </div>
        )}

        {/* Leaderboard */}
        {!loading && !error && (
          <div className="px-4">
            {leaderboard.length === 0 ? (
              <motion.div
                className="flex items-center justify-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="cyber-card p-8 max-w-md text-center">
                  <div className="text-4xl mb-4">🤖</div>
                  <div className="neon-text font-mono text-lg mb-4 font-bold">
                    NO AGENTS FOUND
                  </div>
                  <p className="text-text-secondary mb-6 font-mono text-sm">
                    No neural activity detected in this timeframe.
                  </p>
                  <Link href="/" className="cyber-btn w-full block">
                    START SCANNING
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-3">
                <AnimatePresence>
                  {leaderboard.map((avatar, index) => {
                    const rankInfo = getRankDisplay(index + 1);
                    return (
                      <motion.div
                        key={avatar.id}
                        className="leaderboard-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="text-center min-w-[60px]">
                            <div className={`leaderboard-rank text-${rankInfo.color}`}>
                              {rankInfo.emoji}
                            </div>
                            <div className="text-text-muted font-mono text-xs">
                              {rankInfo.label}
                            </div>
                          </div>

                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-neon-cyan">
                              <Image
                                src={avatar.image_url}
                                alt="Agent"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-green rounded-full border border-void-black flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-void-black rounded-full" />
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`profile-tag ${avatar.persona_tag}`}>
                                {getPersonaEmoji(avatar.persona_tag)} {avatar.persona_tag}
                              </div>
                            </div>
                            <p className="text-text-primary text-sm line-clamp-2 font-mono">
                              &ldquo;{avatar.script}&rdquo;
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="text-right min-w-[80px]">
                            <div className="neon-cyan-text font-mono text-xl font-bold">
                              {avatar.vote_count}
                            </div>
                            <div className="text-text-muted font-mono text-xs mb-2">
                              VOTES
                            </div>
                            
                            <div className="flex items-center justify-end gap-2 text-xs">
                              <span className="text-neon-green">👍{avatar.up_votes}</span>
                              <span className="text-neon-pink">👎{avatar.down_votes}</span>
                            </div>
                            
                            {avatar.vote_count > 0 && (
                              <div className="text-neon-purple font-mono text-xs mt-1">
                                {Math.round((avatar.up_votes / avatar.vote_count) * 100)}%
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="cyber-nav">
        <div className="flex items-center justify-around">
          <Link href="/" className="nav-item">
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </div>
          </Link>
          
          <button className="nav-item active">
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">🏆</span>
              <span>Rankings</span>
            </div>
          </button>
          
          <Link href="/submit" className="nav-item">
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">➕</span>
              <span>Create</span>
            </div>
          </Link>
          
          <button
            onClick={() => setTimeFilter(timeFilter === 'week' ? 'month' : 'week')}
            className="nav-item"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">📊</span>
              <span>Filter</span>
            </div>
          </button>
        </div>
      </div>

      {/* Neural Activity Indicator */}
      <motion.div
        className="fixed bottom-20 left-4 z-40 minimal-ui p-2 rounded-full"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-neon-green font-mono text-xs">NEURAL</span>
        </div>
      </motion.div>
    </div>
  );
}