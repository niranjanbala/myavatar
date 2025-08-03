'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
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
  const [showProfile, setShowProfile] = useState(false);
  const [swipeFeedback, setSwipeFeedback] = useState<'accept' | 'reject' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-400, 400], [-15, 15]);
  const opacity = useTransform(x, [-400, -200, 0, 200, 400], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-400, 0, 400], [0.9, 1, 0.9]);

  // Enhanced swipe indicators with cyber aesthetics
  const acceptOpacity = useTransform(x, [0, 200], [0, 1]);
  const rejectOpacity = useTransform(x, [-200, 0], [1, 0]);
  const acceptScale = useTransform(x, [0, 200], [0.8, 1.3]);
  const rejectScale = useTransform(x, [-200, 0], [1.3, 0.8]);

  useEffect(() => {
    // Auto-play video if available
    if (videoRef.current && avatar.heygen_video_url) {
      videoRef.current.play().catch(() => {
        // Fallback to image if video fails
      });
    }
  }, [avatar.heygen_video_url]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 150;
    
    if (info.offset.x > threshold) {
      // Swipe right - accept
      setExitX(1200);
      setSwipeFeedback('accept');
      setTimeout(() => onSwipe('right'), 200);
    } else if (info.offset.x < -threshold) {
      // Swipe left - reject
      setExitX(-1200);
      setSwipeFeedback('reject');
      setTimeout(() => onSwipe('left'), 200);
    }
  };

  const handleButtonClick = (direction: 'left' | 'right') => {
    setExitX(direction === 'right' ? 1200 : -1200);
    setSwipeFeedback(direction === 'right' ? 'accept' : 'reject');
    setTimeout(() => onSwipe(direction), 200);
  };

  const getPersonaColor = (persona: string) => {
    const colors = {
      hacker: 'neon-cyan',
      diva: 'neon-pink',
      funny: 'neon-green',
      serious: 'neon-purple',
      quirky: 'neon-green',
      techy: 'neon-cyan',
    };
    return colors[persona as keyof typeof colors] || 'neon-cyan';
  };

  const getPersonaEmoji = (persona: string) => {
    const emojis = {
      hacker: '🔒',
      diva: '💎',
      funny: '😂',
      serious: '🎯',
      quirky: '🌟',
      techy: '⚡',
    };
    return emojis[persona as keyof typeof emojis] || '🤖';
  };

  const getPlayfulFeedback = (type: 'accept' | 'reject') => {
    const feedbacks = {
      accept: [
        '🔥 +1 for charisma',
        '✨ Neural match!',
        '💫 Vibe approved',
        '🚀 Connection made',
        '⚡ Energy sync',
      ],
      reject: [
        '👻 Not this time',
        '🌊 Different wavelength',
        '🎭 Plot twist',
        '🔄 Next reality',
        '💭 Different dimension',
      ]
    };
    const options = feedbacks[type];
    return options[Math.floor(Math.random() * options.length)];
  };

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? 'z-20' : 'z-10'}`}
      style={{ x, rotate, opacity, scale }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.3}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX, rotate: exitX > 0 ? 20 : -20, opacity: 0 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      whileHover={!isDragging ? { scale: 1.01 } : {}}
    >
      {/* Full-Screen Video/Image Container */}
      <div className="w-full h-full cyber-card relative overflow-hidden">
        {/* Video/Image Background */}
        <div className="absolute inset-0">
          {avatar.heygen_video_url ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              poster={avatar.image_url}
            >
              <source src={avatar.heygen_video_url} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={avatar.image_url}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="100vw"
              priority={isTop}
            />
          )}
          
          {/* Video Overlay */}
          <div className="video-overlay" />
        </div>

        {/* Swipe Feedback Overlays */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: rejectOpacity, scale: rejectScale }}
        >
          <div className="swipe-feedback reject">
            <div className="flex items-center gap-4">
              <span className="text-6xl">👎</span>
              <div className="text-right">
                <div className="text-2xl font-black">REJECT</div>
                <div className="text-sm opacity-80">Different vibe</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: acceptOpacity, scale: acceptScale }}
        >
          <div className="swipe-feedback accept">
            <div className="flex items-center gap-4">
              <span className="text-6xl">👍</span>
              <div className="text-left">
                <div className="text-2xl font-black">ACCEPT</div>
                <div className="text-sm opacity-80">Good energy</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top UI - Minimal */}
        <div className="absolute top-0 left-0 right-0 z-30 p-4">
          <div className="flex items-center justify-between">
            {/* Avatar Status */}
            <div className="minimal-ui px-3 py-2 rounded-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                <span className="text-xs font-mono text-neon-green">LIVE</span>
              </div>
            </div>

            {/* Profile Toggle */}
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="minimal-ui p-2 rounded-full hover:bg-glass-cyan transition-colors"
            >
              <span className="text-lg">ℹ️</span>
            </button>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              className="absolute inset-0 z-40 bg-void/90 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfile(false)}
            >
              <div className="flex items-center justify-center h-full p-8">
                <motion.div
                  className="cyber-card p-8 max-w-md w-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Avatar Image */}
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-neon-cyan">
                    <Image
                      src={avatar.image_url}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Name & Tags */}
                  <div className="text-center mb-6">
                    <h2 className="neon-text text-2xl font-bold mb-2">
                      AGENT_{avatar.id.slice(-4).toUpperCase()}
                    </h2>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className={`profile-tag ${avatar.persona_tag}`}>
                        {getPersonaEmoji(avatar.persona_tag)} {avatar.persona_tag}
                      </div>
                      <div className="profile-tag ai">
                        🤖 AI
                      </div>
                    </div>
                  </div>

                  {/* Backstory */}
                  <div className="mb-6">
                    <h3 className="neon-purple-text text-sm font-bold mb-2 uppercase tracking-wider">
                      Neural Profile
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      &ldquo;{avatar.script}&rdquo;
                    </p>
                  </div>

                  {/* Voice Type */}
                  <div className="mb-6">
                    <h3 className="neon-green-text text-sm font-bold mb-2 uppercase tracking-wider">
                      Voice Matrix
                    </h3>
                    <div className="text-text-secondary text-sm">
                      {avatar.voice_type.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowProfile(false)}
                    className="cyber-btn w-full"
                  >
                    Close Profile
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom UI - Minimal Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-6">
          <div className="flex items-center justify-between">
            {/* Avatar Info */}
            <div className="minimal-ui px-4 py-3 rounded-2xl max-w-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getPersonaEmoji(avatar.persona_tag)}</span>
                <div>
                  <div className={`text-${getPersonaColor(avatar.persona_tag)} font-mono text-sm font-bold`}>
                    AGENT_{avatar.id.slice(-4).toUpperCase()}
                  </div>
                  <div className="text-text-muted text-xs uppercase tracking-wide">
                    {avatar.persona_tag} • {avatar.voice_type.split('_')[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isTop && (
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => handleButtonClick('left')}
                  className="w-14 h-14 rounded-full bg-carbon border-2 border-neon-pink flex items-center justify-center"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(255, 0, 128, 0.5)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl">👎</span>
                </motion.button>
                
                <motion.button
                  onClick={() => handleButtonClick('right')}
                  className="w-14 h-14 rounded-full bg-carbon border-2 border-neon-green flex items-center justify-center"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 255, 65, 0.5)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-2xl">👍</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Trending Indicator */}
        {Math.random() > 0.7 && (
          <div className="trending-indicator">
            🔥 TRENDING
          </div>
        )}

        {/* Dragging Effect */}
        {isDragging && (
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-pink/10 pointer-events-none" />
        )}
      </div>

      {/* Playful Feedback Animation */}
      <AnimatePresence>
        {swipeFeedback && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`text-center ${swipeFeedback === 'accept' ? 'neon-green-text' : 'neon-pink-text'}`}>
              <div className="text-6xl mb-2">
                {swipeFeedback === 'accept' ? '🔥' : '👻'}
              </div>
              <div className="text-xl font-bold font-mono">
                {getPlayfulFeedback(swipeFeedback)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}