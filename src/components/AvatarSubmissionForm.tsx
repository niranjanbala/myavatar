'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AvatarCreationForm, PERSONA_DESCRIPTIONS, VOICE_TYPES } from '@/types';

interface AvatarSubmissionFormProps {
  onSubmit: (formData: AvatarCreationForm) => Promise<void>;
  isSubmitting: boolean;
}

export default function AvatarSubmissionForm({ onSubmit, isSubmitting }: AvatarSubmissionFormProps) {
  const [formData, setFormData] = useState<AvatarCreationForm>({
    script: '',
    persona_tag: 'techy',
    voice_type: 'male_confident',
    submission_notes: '',
    heygen_api_key: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.script.trim()) {
      newErrors.script = 'Script is required';
    } else if (formData.script.length < 10) {
      newErrors.script = 'Script must be at least 10 characters long';
    } else if (formData.script.length > 500) {
      newErrors.script = 'Script must be less than 500 characters';
    }

    if (!formData.heygen_api_key.trim()) {
      newErrors.heygen_api_key = 'HeyGen API key is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        script: '',
        persona_tag: 'techy',
        voice_type: 'male_confident',
        submission_notes: '',
        heygen_api_key: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleInputChange = (field: keyof AvatarCreationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto glass-effect rounded-3xl p-8 border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-black mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="neural-text">CREATE</span>
          <span className="quantum-text ml-3">AGENT</span>
        </motion.h2>
        <p className="text-agentic-secondary">
          Submit your AI avatar to join the neural network
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Script Input */}
        <div>
          <label className="block text-sm font-bold text-agentic-primary mb-2">
            Agent Script *
          </label>
          <textarea
            value={formData.script}
            onChange={(e) => handleInputChange('script', e.target.value)}
            placeholder="Write your agent's personality script... Make it engaging and unique!"
            className="w-full h-32 px-4 py-3 glass-effect rounded-xl border border-white/20 bg-black/20 text-white placeholder-agentic-secondary focus:border-cyan-400 focus:outline-none resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-2">
            {errors.script && (
              <span className="text-red-400 text-sm">{errors.script}</span>
            )}
            <span className="text-agentic-secondary text-sm ml-auto">
              {formData.script.length}/500
            </span>
          </div>
        </div>

        {/* Persona Selection */}
        <div>
          <label className="block text-sm font-bold text-agentic-primary mb-3">
            Agent Persona *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(PERSONA_DESCRIPTIONS).map(([persona, description]) => (
              <motion.button
                key={persona}
                type="button"
                onClick={() => handleInputChange('persona_tag', persona)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.persona_tag === persona
                    ? 'border-cyan-400 bg-cyan-400/10'
                    : 'border-white/20 glass-effect hover:border-white/40'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-bold text-sm uppercase tracking-wider mb-1 neural-text">
                  {persona}
                </div>
                <div className="text-xs text-agentic-secondary">
                  {description}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Voice Type Selection */}
        <div>
          <label className="block text-sm font-bold text-agentic-primary mb-3">
            Voice Type *
          </label>
          <select
            value={formData.voice_type}
            onChange={(e) => handleInputChange('voice_type', e.target.value)}
            className="w-full px-4 py-3 glass-effect rounded-xl border border-white/20 bg-black/20 text-white focus:border-cyan-400 focus:outline-none"
          >
            {VOICE_TYPES.map((voice) => (
              <option key={voice} value={voice} className="bg-agentic-primary">
                {voice.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* HeyGen API Key */}
        <div>
          <label className="block text-sm font-bold text-agentic-primary mb-2">
            HeyGen API Key *
          </label>
          <input
            type="password"
            value={formData.heygen_api_key}
            onChange={(e) => handleInputChange('heygen_api_key', e.target.value)}
            placeholder="Enter your HeyGen API key"
            className="w-full px-4 py-3 glass-effect rounded-xl border border-white/20 bg-black/20 text-white placeholder-agentic-secondary focus:border-cyan-400 focus:outline-none"
          />
          {errors.heygen_api_key && (
            <span className="text-red-400 text-sm mt-1 block">{errors.heygen_api_key}</span>
          )}
          <p className="text-xs text-agentic-secondary mt-2">
            Your API key is used to generate the avatar video and is not stored permanently.
          </p>
        </div>

        {/* Submission Notes */}
        <div>
          <label className="block text-sm font-bold text-agentic-primary mb-2">
            Submission Notes (Optional)
          </label>
          <textarea
            value={formData.submission_notes}
            onChange={(e) => handleInputChange('submission_notes', e.target.value)}
            placeholder="Any additional notes for the moderators..."
            className="w-full h-20 px-4 py-3 glass-effect rounded-xl border border-white/20 bg-black/20 text-white placeholder-agentic-secondary focus:border-cyan-400 focus:outline-none resize-none"
            maxLength={200}
          />
          <div className="text-right mt-1">
            <span className="text-agentic-secondary text-sm">
              {formData.submission_notes?.length || 0}/200
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing Neural Upload...</span>
            </div>
          ) : (
            <span>Submit Agent to Neural Network</span>
          )}
          
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </motion.button>
      </form>

      {/* Info Box */}
      <motion.div 
        className="mt-8 p-4 glass-effect rounded-xl border border-blue-400/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-start gap-3">
          <div className="text-blue-400 text-xl">ℹ️</div>
          <div className="text-sm text-agentic-secondary">
            <p className="font-medium text-blue-300 mb-2">Submission Process:</p>
            <ul className="space-y-1 text-xs">
              <li>• Your avatar will be generated using your HeyGen API key</li>
              <li>• Submissions require moderation approval before going live</li>
              <li>• You&apos;ll be notified once your agent joins the neural network</li>
              <li>• High-quality, engaging content gets featured status</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}