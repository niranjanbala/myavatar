'use client';

import { PersonaTag } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface PersonalityFilterProps {
  selectedPersona?: PersonaTag;
  onPersonaChange: (persona?: PersonaTag) => void;
}

const PERSONA_OPTIONS: { 
  value: PersonaTag; 
  label: string; 
  emoji: string; 
  color: string;
}[] = [
  { value: 'hacker', label: 'HACKER', emoji: '🔒', color: 'neon-cyan' },
  { value: 'diva', label: 'DIVA', emoji: '💎', color: 'neon-pink' },
  { value: 'funny', label: 'FUNNY', emoji: '😂', color: 'neon-green' },
  { value: 'serious', label: 'SERIOUS', emoji: '🎯', color: 'neon-purple' },
  { value: 'quirky', label: 'QUIRKY', emoji: '🌟', color: 'neon-green' },
  { value: 'techy', label: 'TECHY', emoji: '⚡', color: 'neon-cyan' },
];

export default function PersonalityFilter({ selectedPersona, onPersonaChange }: PersonalityFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full">
      {/* Minimal Filter Toggle */}
      <motion.div
        className="flex items-center justify-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="minimal-ui px-4 py-2 rounded-full flex items-center gap-3 hover:bg-glass-cyan transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
            <span className="text-neon-cyan font-mono text-sm font-bold">
              {selectedPersona ? PERSONA_OPTIONS.find(p => p.value === selectedPersona)?.label : 'ALL'}
            </span>
          </div>
          <motion.span
            className="text-text-muted text-xs"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ▼
          </motion.span>
        </button>
      </motion.div>

      {/* Expanded Filter Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="minimal-ui rounded-2xl p-4 mb-4"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="neon-text font-mono text-sm font-bold mb-1">
                NEURAL FILTER
              </h3>
              <p className="text-text-muted font-mono text-xs">
                Select personality matrix
              </p>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {/* All option */}
              <motion.button
                onClick={() => {
                  onPersonaChange(undefined);
                  setIsExpanded(false);
                }}
                className={`cyber-glass p-3 rounded-lg transition-all ${
                  !selectedPersona
                    ? 'border-neon-cyan bg-glass-cyan'
                    : 'border-steel-gray hover:border-neon-cyan'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">🌟</div>
                  <div className={`font-mono text-xs font-bold ${
                    !selectedPersona ? 'text-neon-cyan' : 'text-text-secondary'
                  }`}>
                    ALL
                  </div>
                </div>
              </motion.button>

              {/* Persona options */}
              {PERSONA_OPTIONS.map((option, index) => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    onPersonaChange(option.value);
                    setIsExpanded(false);
                  }}
                  className={`cyber-glass p-3 rounded-lg transition-all ${
                    selectedPersona === option.value
                      ? `border-${option.color} bg-glass-cyan`
                      : 'border-steel-gray hover:border-neon-cyan'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{option.emoji}</div>
                    <div className={`font-mono text-xs font-bold ${
                      selectedPersona === option.value ? `text-${option.color}` : 'text-text-secondary'
                    }`}>
                      {option.label.slice(0, 4)}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Active Filter Indicator */}
            {selectedPersona && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1 h-1 bg-neon-green rounded-full animate-pulse" />
                  <span className="text-neon-green font-mono text-xs">
                    FILTER ACTIVE
                  </span>
                  <div className="w-1 h-1 bg-neon-green rounded-full animate-pulse delay-300" />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Filter Pills - Always Visible */}
      <motion.div
        className="flex items-center justify-center gap-2 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* All pill */}
        <button
          onClick={() => onPersonaChange(undefined)}
          className={`flex-shrink-0 px-3 py-1 rounded-full border font-mono text-xs transition-all ${
            !selectedPersona
              ? 'border-neon-cyan bg-glass-cyan text-neon-cyan'
              : 'border-steel-gray text-text-muted hover:border-neon-cyan hover:text-neon-cyan'
          }`}
        >
          ALL
        </button>

        {/* Persona pills */}
        {PERSONA_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onPersonaChange(option.value)}
            className={`flex-shrink-0 px-3 py-1 rounded-full border font-mono text-xs transition-all flex items-center gap-1 ${
              selectedPersona === option.value
                ? `border-${option.color} bg-glass-cyan text-${option.color}`
                : 'border-steel-gray text-text-muted hover:border-neon-cyan hover:text-neon-cyan'
            }`}
          >
            <span className="text-xs">{option.emoji}</span>
            <span>{option.label.slice(0, 4)}</span>
          </button>
        ))}
      </motion.div>

      {/* Neural Activity Dots */}
      <div className="flex justify-center mt-3">
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-neon-cyan rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}