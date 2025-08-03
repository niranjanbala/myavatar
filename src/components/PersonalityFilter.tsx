'use client';

import { PersonaTag } from '@/types';

interface PersonalityFilterProps {
  selectedPersona?: PersonaTag;
  onPersonaChange: (persona?: PersonaTag) => void;
}

const PERSONA_OPTIONS: { value: PersonaTag; label: string; emoji: string; description: string }[] = [
  { value: 'funny', label: 'Funny', emoji: '😂', description: 'Witty and humorous' },
  { value: 'serious', label: 'Serious', emoji: '🎯', description: 'Professional and focused' },
  { value: 'quirky', label: 'Quirky', emoji: '🤪', description: 'Unique and eccentric' },
  { value: 'techy', label: 'Techy', emoji: '💻', description: 'Tech-savvy and geeky' },
  { value: 'diva', label: 'Diva', emoji: '💅', description: 'Glamorous and confident' },
  { value: 'hacker', label: 'Hacker', emoji: '🔒', description: 'Mysterious and edgy' },
];

export default function PersonalityFilter({ selectedPersona, onPersonaChange }: PersonalityFilterProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Filter by Personality
      </h3>
      
      <div className="flex flex-wrap justify-center gap-3">
        {/* All option */}
        <button
          onClick={() => onPersonaChange(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !selectedPersona
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="mr-2">🌟</span>
          All
        </button>

        {/* Persona options */}
        {PERSONA_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onPersonaChange(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedPersona === option.value
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={option.description}
          >
            <span className="mr-2">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>

      {/* Selected persona description */}
      {selectedPersona && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Showing {PERSONA_OPTIONS.find(p => p.value === selectedPersona)?.description} avatars
          </p>
        </div>
      )}
    </div>
  );
}