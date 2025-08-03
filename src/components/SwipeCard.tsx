'use client';

import { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Avatar } from '@/types';
import Image from 'next/image';

interface SwipeCardProps {
  avatar: Avatar;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
}

export default function SwipeCard({ avatar, onSwipe, isTop }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-300, 0, 300], [0.8, 1, 0.8]);

  // Enhanced swipe indicators
  const likeOpacity = useTransform(x, [0, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);
  const likeScale = useTransform(x, [0, 150], [0.5, 1.2]);
  const nopeScale = useTransform(x, [-150, 0], [1.2, 0.5]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 120;
    
    if (info.offset.x > threshold) {
      // Swipe right - upvote
      setExitX(1000);
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      // Swipe left - downvote
      setExitX(-1000);
      onSwipe('left');
    }
  };

  const handleButtonClick = (direction: 'left' | 'right') => {
    setExitX(direction === 'right' ? 1000 : -1000);
    onSwipe(direction);
  };

  const getPersonaGradient = (persona: string) => {
    const gradients = {
      hacker: 'from-cyan-500 via-blue-600 to-purple-700',
      diva: 'from-pink-500 via-rose-500 to-purple-600',
      funny: 'from-yellow-400 via-orange-500 to-red-500',
      serious: 'from-gray-600 via-blue-700 to-indigo-800',
      quirky: 'from-green-400 via-teal-500 to-blue-600',
      techy: 'from-blue-500 via-indigo-600 to-purple-700',
    };
    return gradients[persona as keyof typeof gradients] || 'from-purple-500 to-blue-600';
  };

  const getPersonaIcon = (persona: string) => {
    const icons = {
      hacker: '🔒',
      diva: '💅',
      funny: '😂',
      serious: '🎯',
      quirky: '🤪',
      techy: '💻',
    };
    return icons[persona as keyof typeof icons] || '🎭';
  };

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? 'z-20' : 'z-10'}`}
      style={{ x, rotate, opacity, scale }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX, rotate: exitX > 0 ? 30 : -30 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={!isDragging ? { scale: 1.02 } : {}}
    >
      <div className="w-full h-full glass-effect rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
        {/* Neural network overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-6 right-6 w-1 h-1 bg-green-400 rounded-full animate-pulse delay-1000"></div>
          
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full">
            <line x1="16" y1="16" x2="320" y2="32" stroke="url(#neural-gradient)" strokeWidth="0.5" opacity="0.3" />
            <line x1="320" y1="32" x2="32" y2="384" stroke="url(#neural-gradient)" strokeWidth="0.5" opacity="0.3" />
            <line x1="32" y1="384" x2="344" y2="408" stroke="url(#neural-gradient)" strokeWidth="0.5" opacity="0.3" />
            <defs>
              <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f5ff" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Avatar Image with enhanced styling */}
        <div className={`relative h-2/3 bg-gradient-to-br ${getPersonaGradient(avatar.persona_tag)} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <Image
            src={avatar.image_url}
            alt="Avatar"
            fill
            className="object-cover mix-blend-overlay"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={isTop}
          />
          
          {/* Holographic overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-quantum-shimmer"></div>
          
          {/* Enhanced Swipe Indicators */}
          <motion.div
            className="absolute top-8 left-8 px-6 py-3 rounded-full font-bold text-lg transform -rotate-12 border-2"
            style={{ 
              opacity: nopeOpacity, 
              scale: nopeScale,
              backgroundColor: 'rgba(239, 68, 68, 0.9)',
              borderColor: '#ef4444',
              color: '#ffffff'
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">👎</span>
              <span className="cyber-text font-black">REJECT</span>
            </div>
          </motion.div>
          
          <motion.div
            className="absolute top-8 right-8 px-6 py-3 rounded-full font-bold text-lg transform rotate-12 border-2"
            style={{ 
              opacity: likeOpacity, 
              scale: likeScale,
              backgroundColor: 'rgba(34, 197, 94, 0.9)',
              borderColor: '#22c55e',
              color: '#ffffff'
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">👍</span>
              <span className="quantum-text font-black">ACCEPT</span>
            </div>
          </motion.div>

          {/* AI Status Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 glass-effect px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">AI ACTIVE</span>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="h-1/3 p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-purple-500"></div>
          </div>
          
          <div className="relative z-10">
            {/* Persona Tags with enhanced styling */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`px-4 py-2 rounded-full glass-effect border neural-border flex items-center gap-2`}>
                <span className="text-lg">{getPersonaIcon(avatar.persona_tag)}</span>
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
            
            {/* AI-generated script with enhanced typography */}
            <div className="relative">
              <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></div>
              <p className="text-white text-lg leading-relaxed font-medium pl-4">
                &ldquo;{avatar.script}&rdquo;
              </p>
            </div>
          </div>

          {/* Action Buttons with enhanced styling */}
          {isTop && (
            <div className="flex justify-center gap-8 mt-6 relative z-10">
              <motion.button
                onClick={() => handleButtonClick('left')}
                className="w-16 h-16 rounded-full glass-effect border-2 border-red-500/50 flex items-center justify-center text-3xl hover-cyber group relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Reject Agent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">👎</span>
                <div className="absolute inset-0 rounded-full border-2 border-red-400 opacity-0 group-hover:opacity-100 animate-ping"></div>
              </motion.button>
              
              <motion.button
                onClick={() => handleButtonClick('right')}
                className="w-16 h-16 rounded-full glass-effect border-2 border-green-500/50 flex items-center justify-center text-3xl hover-quantum group relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Accept Agent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">👍</span>
                <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-0 group-hover:opacity-100 animate-ping"></div>
              </motion.button>
            </div>
          )}

          {/* HeyGen Video Indicator */}
          {avatar.heygen_video_url && (
            <motion.div 
              className="absolute bottom-4 right-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="w-12 h-12 rounded-full glass-effect border border-purple-400/50 flex items-center justify-center hover-neural group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-purple-300 text-xl relative z-10">▶️</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Dragging effect overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl pointer-events-none"></div>
        )}
      </div>
    </motion.div>
  );
}