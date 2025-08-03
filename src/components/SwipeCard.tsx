'use client';

import { useState, useRef } from 'react';
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
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
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

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? 'z-20' : 'z-10'}`}
      style={{ x, rotate, opacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Avatar Image */}
        <div className="relative h-2/3 bg-gradient-to-br from-purple-400 to-pink-400">
          <Image
            src={avatar.image_url}
            alt="Avatar"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={isTop}
          />
          
          {/* Swipe Indicators */}
          <motion.div
            className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg transform -rotate-12"
            style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
          >
            👎 NOPE
          </motion.div>
          
          <motion.div
            className="absolute top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg transform rotate-12"
            style={{ opacity: useTransform(x, [50, 150], [1, 0]) }}
          >
            👍 LIKE
          </motion.div>
        </div>

        {/* Content */}
        <div className="h-1/3 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {avatar.persona_tag}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {avatar.voice_type}
              </span>
            </div>
            
            <p className="text-gray-800 text-lg leading-relaxed">
              {avatar.script}
            </p>
          </div>

          {/* Action Buttons */}
          {isTop && (
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={() => handleButtonClick('left')}
                className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-2xl transition-colors shadow-lg"
                aria-label="Downvote"
              >
                👎
              </button>
              
              <button
                onClick={() => handleButtonClick('right')}
                className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-2xl transition-colors shadow-lg"
                aria-label="Upvote"
              >
                👍
              </button>
            </div>
          )}
        </div>

        {/* HeyGen Video (if available) */}
        {avatar.heygen_video_url && (
          <div className="absolute bottom-20 right-4">
            <button className="w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all">
              ▶️
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}