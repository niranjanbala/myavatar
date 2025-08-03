'use client';

import { useState, useEffect } from 'react';
import { PersonaTag } from '@/types';
import SwipeDeck from '@/components/SwipeDeck';
import PersonalityFilter from '@/components/PersonalityFilter';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppPage() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaTag | undefined>();
  const [showTrending, setShowTrending] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePersonaChange = (persona?: PersonaTag) => {
    setSelectedPersona(persona);
  };

  const handleRandomize = () => {
    // Randomize persona selection
    const personas: PersonaTag[] = ['hacker', 'diva', 'funny', 'serious', 'quirky', 'techy'];
    const randomPersona = personas[Math.floor(Math.random() * personas.length)];
    setSelectedPersona(Math.random() > 0.5 ? randomPersona : undefined);
  };

  const trendingAvatars = [
    { name: 'CIPHER_7', tag: 'rogue ai', votes: 2847 },
    { name: 'NEON_GHOST', tag: 'visionary', votes: 2156 },
    { name: 'QUANTUM_SAGE', tag: 'philosopher', votes: 1923 },
    { name: 'VOID_WALKER', tag: 'mysterious', votes: 1687 },
  ];

  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      {/* Cyber Particles Background */}
      <div className="cyber-particles">
        {[...Array(15)].map((_, i) => (
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

      {/* Minimal Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 minimal-ui m-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neon-cyan rounded-full animate-pulse" />
            <span className="neon-text font-mono text-lg font-bold">NEURAL.MATCH</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-text-secondary font-mono text-sm">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          </div>
        </div>
      </motion.header>

      {/* Trending Section */}
      <AnimatePresence>
        {showTrending && (
          <motion.div
            className="fixed top-20 left-4 right-4 z-40 minimal-ui"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="neon-pink-text font-mono text-sm font-bold uppercase tracking-wider">
                  Daily Trending
                </h2>
                <button
                  onClick={() => setShowTrending(false)}
                  className="text-text-muted hover:text-neon-cyan transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {trendingAvatars.map((avatar, index) => (
                  <motion.div
                    key={avatar.name}
                    className="cyber-glass p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="neon-text font-mono text-xs font-bold">
                          {avatar.name}
                        </div>
                        <div className={`profile-tag ${avatar.tag.includes('rogue') ? 'rogue' : avatar.tag.includes('visionary') ? 'visionary' : ''} text-xs mt-1`}>
                          {avatar.tag}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="neon-green-text font-mono text-xs font-bold">
                          {avatar.votes.toLocaleString()}
                        </div>
                        <div className="text-text-muted text-xs">votes</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Full Screen Video Experience */}
      <div className="video-container">
        <div className="video-overlay" />
        
        {/* Swipe Deck - Full Screen */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <SwipeDeck selectedPersona={selectedPersona} />
        </motion.div>

        {/* Minimal Controls - Bottom */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 z-40"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {/* Personality Filter - Minimal */}
          <div className="px-4 pb-4">
            <PersonalityFilter
              selectedPersona={selectedPersona}
              onPersonaChange={handlePersonaChange}
            />
          </div>

          {/* Navigation Bar */}
          <div className="cyber-nav">
            <div className="flex items-center justify-around">
              <Link href="/landing" className="nav-item">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">🏠</span>
                  <span>Home</span>
                </div>
              </Link>
              
              <Link href="/leaderboard" className="nav-item">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">🏆</span>
                  <span>Rankings</span>
                </div>
              </Link>
              
              <button
                onClick={handleRandomize}
                className="nav-item"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">🎲</span>
                  <span>Random</span>
                </div>
              </button>
              
              <Link href="/submit" className="nav-item">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">➕</span>
                  <span>Create</span>
                </div>
              </Link>
              
              <button
                onClick={() => setShowTrending(!showTrending)}
                className="nav-item"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">📈</span>
                  <span>Trending</span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Randomize Floating Button */}
      <motion.button
        className="randomize-btn"
        onClick={handleRandomize}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🎲
      </motion.button>

      {/* Swipe Instructions - Minimal */}
      <motion.div
        className="fixed top-1/2 left-4 transform -translate-y-1/2 z-30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="minimal-ui p-3 rounded-lg">
          <div className="flex flex-col gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="neon-green-text">→</span>
              <span className="text-text-secondary">ACCEPT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="neon-pink-text">←</span>
              <span className="text-text-secondary">REJECT</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Status Indicator */}
      <motion.div
        className="fixed top-1/2 right-4 transform -translate-y-1/2 z-30"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <div className="minimal-ui p-3 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse" />
            <span className="text-text-muted font-mono text-xs transform -rotate-90 whitespace-nowrap">
              NEURAL ACTIVE
            </span>
          </div>
        </div>
      </motion.div>

      {/* Version Info - Bottom Corner */}
      <motion.div
        className="fixed bottom-4 left-4 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <div className="text-text-muted font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-neon-green rounded-full animate-pulse" />
            <span>v3.0.0-blackmirror</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}