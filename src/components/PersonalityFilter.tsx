'use client';

import { PersonaTag } from '@/types';
import { motion } from 'framer-motion';

interface PersonalityFilterProps {
  selectedPersona?: PersonaTag;
  onPersonaChange: (persona?: PersonaTag) => void;
}

const PERSONA_OPTIONS: { 
  value: PersonaTag; 
  label: string; 
  emoji: string; 
  description: string;
  gradient: string;
  borderColor: string;
}[] = [
  { 
    value: 'funny', 
    label: 'Humor.exe', 
    emoji: '😂', 
    description: 'Comedy algorithms activated',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    borderColor: 'border-orange-400/50'
  },
  { 
    value: 'serious', 
    label: 'Logic.sys', 
    emoji: '🎯', 
    description: 'Professional protocols engaged',
    gradient: 'from-gray-500 via-blue-600 to-indigo-700',
    borderColor: 'border-blue-400/50'
  },
  { 
    value: 'quirky', 
    label: 'Chaos.dll', 
    emoji: '🤪', 
    description: 'Randomness generator online',
    gradient: 'from-green-400 via-teal-500 to-blue-600',
    borderColor: 'border-teal-400/50'
  },
  { 
    value: 'techy', 
    label: 'Code.bin', 
    emoji: '💻', 
    description: 'Neural networks synchronized',
    gradient: 'from-blue-500 via-indigo-600 to-purple-700',
    borderColor: 'border-indigo-400/50'
  },
  { 
    value: 'diva', 
    label: 'Glam.app', 
    emoji: '💅', 
    description: 'Elegance subroutines active',
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    borderColor: 'border-pink-400/50'
  },
  { 
    value: 'hacker', 
    label: 'Shadow.exe', 
    emoji: '🔒', 
    description: 'Stealth mode initialized',
    gradient: 'from-cyan-500 via-blue-600 to-purple-700',
    borderColor: 'border-cyan-400/50'
  },
];

export default function PersonalityFilter({ selectedPersona, onPersonaChange }: PersonalityFilterProps) {
  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-bold neural-text mb-2 flex items-center justify-center gap-3">
          <span className="text-cyan-400">◉</span>
          AGENT PERSONALITY MATRIX
          <span className="text-purple-400">◉</span>
        </h3>
        <p className="text-agentic-secondary text-sm">
          Select neural pathways to filter compatible agents
        </p>
      </motion.div>
      
      {/* Filter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
        {/* All option */}
        <motion.button
          onClick={() => onPersonaChange(undefined)}
          className={`group relative p-4 rounded-2xl glass-effect border transition-all duration-300 overflow-hidden ${
            !selectedPersona
              ? 'border-white/30 bg-gradient-to-br from-white/10 to-white/5'
              : 'border-white/10 hover:border-white/20'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
          
          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="text-3xl mb-2 group-hover:animate-bounce">🌟</div>
            <div className={`font-bold text-sm mb-1 ${!selectedPersona ? 'neural-text' : 'text-white'}`}>
              ALL.sys
            </div>
            <div className="text-xs text-agentic-secondary group-hover:text-white transition-colors">
              Universal matrix
            </div>
          </div>
          
          {/* Selection indicator */}
          {!selectedPersona && (
            <motion.div
              className="absolute inset-0 border-2 border-cyan-400 rounded-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          
          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-quantum-shimmer"></div>
        </motion.button>

        {/* Persona options */}
        {PERSONA_OPTIONS.map((option, index) => (
          <motion.button
            key={option.value}
            onClick={() => onPersonaChange(option.value)}
            className={`group relative p-4 rounded-2xl glass-effect border transition-all duration-300 overflow-hidden ${
              selectedPersona === option.value
                ? `${option.borderColor} bg-gradient-to-br ${option.gradient} bg-opacity-20`
                : 'border-white/10 hover:border-white/20'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + (index * 0.1) }}
            title={option.description}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <div className="text-3xl mb-2 group-hover:animate-bounce">{option.emoji}</div>
              <div className={`font-bold text-sm mb-1 ${
                selectedPersona === option.value ? 'text-white' : 'text-white group-hover:text-white'
              }`}>
                {option.label}
              </div>
              <div className="text-xs text-agentic-secondary group-hover:text-white transition-colors">
                {option.description.split(' ')[0]}
              </div>
            </div>
            
            {/* Selection indicator */}
            {selectedPersona === option.value && (
              <motion.div
                className={`absolute inset-0 border-2 rounded-2xl ${option.borderColor.replace('/50', '')}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            {/* Neural network effect */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-current rounded-full opacity-30 group-hover:opacity-100 animate-pulse"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-current rounded-full opacity-20 group-hover:opacity-80 animate-pulse delay-500"></div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-quantum-shimmer"></div>
          </motion.button>
        ))}
      </div>

      {/* Selected persona description */}
      {selectedPersona && (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="glass-effect rounded-xl p-4 max-w-md mx-auto border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">
                FILTERING ACTIVE
              </span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
            </div>
            <p className="text-agentic-secondary text-sm">
              Displaying {PERSONA_OPTIONS.find(p => p.value === selectedPersona)?.description} agents
            </p>
          </div>
        </motion.div>
      )}

      {/* Neural activity indicator */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-cyan-400 rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}