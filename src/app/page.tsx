'use client';

import { useState } from 'react';
import { PersonaTag } from '@/types';
import SwipeDeck from '@/components/SwipeDeck';
import PersonalityFilter from '@/components/PersonalityFilter';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaTag | undefined>();

  const handlePersonaChange = (persona?: PersonaTag) => {
    setSelectedPersona(persona);
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
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Title with AI aesthetic */}
          <div className="relative mb-6">
            <motion.h1 
              className="text-6xl md:text-7xl font-black mb-4 relative"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            >
              <span className="neural-text animate-cyber-glow">AGENT</span>
              <span className="quantum-text ml-4">MATCH</span>
              
              {/* Holographic effect */}
              <div className="absolute inset-0 neural-text opacity-30 blur-sm animate-pulse">
                AGENT MATCH
              </div>
            </motion.h1>
            
            {/* Subtitle with typing effect */}
            <motion.div
              className="flex items-center justify-center gap-2 text-lg md:text-xl text-agentic-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <span className="text-cyan-400">◉</span>
              <span>Neural Network Dating Protocol</span>
              <span className="text-purple-400">◉</span>
            </motion.div>
          </div>

          {/* Enhanced Instructions */}
          <motion.div 
            className="glass-effect rounded-2xl p-6 mb-8 max-w-2xl mx-auto border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-8 text-sm md:text-base">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full glass-effect border border-green-400/50 flex items-center justify-center">
                  <span className="text-2xl">👍</span>
                </div>
                <div>
                  <div className="quantum-text font-bold">ACCEPT</div>
                  <div className="text-agentic-secondary text-xs">Swipe Right</div>
                </div>
              </div>
              
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full glass-effect border border-red-400/50 flex items-center justify-center">
                  <span className="text-2xl">👎</span>
                </div>
                <div>
                  <div className="cyber-text font-bold">REJECT</div>
                  <div className="text-agentic-secondary text-xs">Swipe Left</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Navigation with enhanced styling */}
          <motion.div 
            className="flex justify-center gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Link
              href="/leaderboard"
              className="group relative px-8 py-4 rounded-2xl glass-effect border border-purple-400/30 hover-neural transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <span className="font-bold neural-text">NEURAL RANKINGS</span>
              </div>
              <div className="absolute inset-0 rounded-2xl border border-purple-400 opacity-0 group-hover:opacity-50 animate-pulse"></div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Enhanced Personality Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <PersonalityFilter
            selectedPersona={selectedPersona}
            onPersonaChange={handlePersonaChange}
          />
        </motion.div>

        {/* Enhanced Swipe Deck Container */}
        <motion.div 
          className="flex justify-center mb-12 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {/* Deck glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
          
          <div className="relative">
            <SwipeDeck selectedPersona={selectedPersona} />
          </div>
        </motion.div>

        {/* Enhanced Instructions Panel */}
        <motion.div 
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        >
          <div className="glass-effect rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-center neural-text flex items-center justify-center gap-2">
                <span className="text-cyan-400">⚡</span>
                AGENT INTERACTION PROTOCOL
                <span className="text-purple-400">⚡</span>
              </h3>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl glass-effect">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">→</span>
                  </div>
                  <span className="text-agentic-secondary">Neural Accept</span>
                </div>
                <span className="quantum-text font-bold">COMPATIBLE</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl glass-effect">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">←</span>
                  </div>
                  <span className="text-agentic-secondary">Neural Reject</span>
                </div>
                <span className="cyber-text font-bold">INCOMPATIBLE</span>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-2 text-xs text-agentic-secondary">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Anonymous • Quantum Encrypted • AI Powered</span>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-500"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div 
          className="text-center mt-16 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 text-sm text-agentic-secondary">
            <span>Powered by</span>
            <div className="flex items-center gap-2">
              <span className="neural-text font-bold">Next.js 15</span>
              <span className="text-cyan-400">•</span>
              <span className="quantum-text font-bold">Supabase</span>
              <span className="text-purple-400">•</span>
              <span className="cyber-text font-bold">HeyGen AI</span>
            </div>
          </div>
          
          {/* Version indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-mono">v2.0.0-agentic</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
          </div>
        </motion.div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
