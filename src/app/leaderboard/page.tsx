'use client';

import { useState, useEffect } from 'react';
import { AvatarWithVotes, PersonaTag } from '@/types';
import PersonalityFilter from '@/components/PersonalityFilter';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
      setError('Failed to load neural rankings. Please try again.');
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

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 via-yellow-500 to-orange-500';
      case 2: return 'from-gray-300 via-gray-400 to-gray-500';
      case 3: return 'from-orange-400 via-orange-500 to-red-500';
      default: return 'from-blue-400 via-purple-500 to-pink-500';
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

  const getPersonaGradient = (persona: string) => {
    const gradients: Record<string, string> = {
      hacker: 'from-cyan-500 to-blue-600',
      diva: 'from-pink-500 to-purple-600',
      funny: 'from-yellow-400 to-orange-500',
      serious: 'from-gray-600 to-blue-700',
      quirky: 'from-green-400 to-teal-500',
      techy: 'from-blue-500 to-purple-700',
    };
    return gradients[persona] || 'from-purple-500 to-blue-600';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6 group transition-colors"
          >
            <span className="text-xl group-hover:animate-bounce">←</span>
            <span className="font-medium">Back to Agent Match</span>
          </Link>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-black mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="neural-text animate-cyber-glow">NEURAL</span>
            <span className="quantum-text ml-4">RANKINGS</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-agentic-secondary mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Top performing agents in the compatibility matrix
          </motion.p>

          {/* Stats Dashboard */}
          <motion.div 
            className="flex justify-center gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="glass-effect rounded-xl p-4 border border-cyan-400/30">
              <div className="neural-text text-2xl font-bold">{leaderboard.length}</div>
              <div className="text-agentic-secondary text-sm">Active Agents</div>
            </div>
            <div className="glass-effect rounded-xl p-4 border border-purple-400/30">
              <div className="quantum-text text-2xl font-bold">
                {leaderboard.reduce((sum, agent) => sum + agent.vote_count, 0)}
              </div>
              <div className="text-agentic-secondary text-sm">Total Interactions</div>
            </div>
            <div className="glass-effect rounded-xl p-4 border border-pink-400/30">
              <div className="cyber-text text-2xl font-bold">
                {leaderboard.length > 0 ? Math.round(
                  leaderboard.reduce((sum, agent) => sum + (agent.up_votes / Math.max(agent.vote_count, 1) * 100), 0) / leaderboard.length
                ) : 0}%
              </div>
              <div className="text-agentic-secondary text-sm">Avg Compatibility</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Personality Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <PersonalityFilter
            selectedPersona={selectedPersona}
            onPersonaChange={handlePersonaChange}
          />
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="flex items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="glass-effect rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-cyan-400 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="neural-text font-medium">Analyzing neural patterns...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto border border-red-400/30">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-red-400 mb-6 font-medium">{error}</p>
              <button
                onClick={() => fetchLeaderboard(selectedPersona)}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-medium"
              >
                Retry Neural Sync
              </button>
            </div>
          </motion.div>
        )}

        {/* Enhanced Leaderboard */}
        {!loading && !error && (
          <div className="max-w-4xl mx-auto">
            {leaderboard.length === 0 ? (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="glass-effect rounded-2xl p-12 border border-white/10">
                  <div className="text-6xl mb-6">🤖</div>
                  <p className="text-agentic-secondary text-xl mb-6">
                    No agents found in this neural pathway.
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all font-bold"
                  >
                    Initialize Agent Matching
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {leaderboard.map((avatar, index) => (
                  <motion.div
                    key={avatar.id}
                    className={`glass-effect rounded-2xl p-6 border transition-all hover:border-white/20 group relative overflow-hidden ${
                      index < 3 ? 'border-yellow-400/30 shadow-2xl' : 'border-white/10'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    {/* Background gradient for top 3 */}
                    {index < 3 && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${getRankGradient(index + 1)} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    )}

                    <div className="flex items-center gap-6 relative z-10">
                      {/* Enhanced Rank */}
                      <div className="text-center min-w-[80px]">
                        <div className={`text-4xl font-black mb-2 ${
                          index < 3 ? 'animate-pulse' : ''
                        }`}>
                          {getRankEmoji(index + 1)}
                        </div>
                        {index < 3 && (
                          <div className="text-xs text-agentic-secondary uppercase tracking-wider">
                            {index === 0 ? 'PRIME' : index === 1 ? 'ALPHA' : 'BETA'}
                          </div>
                        )}
                      </div>

                      {/* Enhanced Avatar Image */}
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br ${getPersonaGradient(avatar.persona_tag)} p-1`}>
                          <div className="w-full h-full rounded-xl overflow-hidden">
                            <Image
                              src={avatar.image_url}
                              alt="Agent Avatar"
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        {/* Status indicator */}
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-agentic-primary flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      {/* Enhanced Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`px-4 py-2 rounded-full glass-effect border neural-border flex items-center gap-2`}>
                            <span className="text-lg">{getPersonaEmoji(avatar.persona_tag)}</span>
                            <span className="neural-text font-bold text-sm uppercase tracking-wider">
                              {avatar.persona_tag}
                            </span>
                          </div>
                          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30">
                            <span className="text-blue-300 text-xs font-medium uppercase tracking-wide">
                              {avatar.voice_type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-agentic-primary mb-2 line-clamp-2 group-hover:text-white transition-colors">
                          "{avatar.script}"
                        </p>
                      </div>

                      {/* Enhanced Stats */}
                      <div className="text-right min-w-[140px]">
                        <div className="neural-text text-3xl font-black mb-1">
                          {avatar.vote_count}
                        </div>
                        <div className="text-sm text-agentic-secondary mb-3">
                          neural interactions
                        </div>
                        
                        <div className="flex items-center justify-end gap-4 text-sm mb-2">
                          <div className="flex items-center gap-1">
                            <span className="text-green-400 font-bold">👍</span>
                            <span className="text-green-400 font-medium">{avatar.up_votes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-red-400 font-bold">👎</span>
                            <span className="text-red-400 font-medium">{avatar.down_votes}</span>
                          </div>
                        </div>
                        
                        {avatar.vote_count > 0 && (
                          <div className="glass-effect rounded-lg px-3 py-1 border border-white/10">
                            <div className="quantum-text text-sm font-bold">
                              {Math.round((avatar.up_votes / avatar.vote_count) * 100)}%
                            </div>
                            <div className="text-xs text-agentic-secondary">compatibility</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enhanced Footer */}
        <motion.div 
          className="text-center mt-16 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="glass-effect rounded-xl p-6 max-w-md mx-auto border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-bold">NEURAL NETWORK ACTIVE</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
            </div>
            <p className="text-agentic-secondary text-xs">
              Rankings updated in real-time via quantum synchronization
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}