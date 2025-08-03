'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AvatarSubmissionForm from '@/components/AvatarSubmissionForm';
import { AvatarCreationForm } from '@/types';

export default function SubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (formData: AvatarCreationForm) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/submit-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitResult({
          success: true,
          message: result.data.message || 'Avatar submitted successfully!'
        });
      } else {
        setSubmitResult({
          success: false,
          message: result.error || 'Failed to submit avatar'
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Header */}
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
            <span className="neural-text animate-cyber-glow">JOIN THE</span>
            <span className="quantum-text ml-4">NETWORK</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-agentic-secondary mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Create your AI avatar and become part of the neural collective
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="flex justify-center gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="glass-effect rounded-xl p-4 border border-cyan-400/30">
              <div className="neural-text text-2xl font-bold">∞</div>
              <div className="text-agentic-secondary text-sm">Possibilities</div>
            </div>
            <div className="glass-effect rounded-xl p-4 border border-purple-400/30">
              <div className="quantum-text text-2xl font-bold">24/7</div>
              <div className="text-agentic-secondary text-sm">Active Network</div>
            </div>
            <div className="glass-effect rounded-xl p-4 border border-pink-400/30">
              <div className="cyber-text text-2xl font-bold">AI</div>
              <div className="text-agentic-secondary text-sm">Powered</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Success/Error Messages */}
        {submitResult && (
          <motion.div
            className={`max-w-2xl mx-auto mb-8 p-6 rounded-2xl border ${
              submitResult.success 
                ? 'bg-green-500/10 border-green-400/30 text-green-300'
                : 'bg-red-500/10 border-red-400/30 text-red-300'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {submitResult.success ? '✅' : '❌'}
              </div>
              <div>
                <div className="font-bold mb-1">
                  {submitResult.success ? 'Submission Successful!' : 'Submission Failed'}
                </div>
                <div className="text-sm opacity-90">
                  {submitResult.message}
                </div>
              </div>
            </div>
            
            {submitResult.success && (
              <div className="mt-4 pt-4 border-t border-green-400/20">
                <div className="flex gap-4">
                  <Link
                    href="/leaderboard"
                    className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
                  >
                    View Neural Rankings
                  </Link>
                  <button
                    onClick={() => setSubmitResult(null)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
                  >
                    Submit Another Agent
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Submission Form */}
        {!submitResult?.success && (
          <AvatarSubmissionForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {/* How It Works Section */}
        <motion.div 
          className="max-w-4xl mx-auto mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8 neural-text">
            How Agent Creation Works
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-effect rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h4 className="font-bold mb-2 quantum-text">1. Design Personality</h4>
              <p className="text-sm text-agentic-secondary">
                Craft a unique script and choose personality traits that make your agent stand out
              </p>
            </div>
            
            <div className="glass-effect rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl mb-4">🎬</div>
              <h4 className="font-bold mb-2 cyber-text">2. Generate Avatar</h4>
              <p className="text-sm text-agentic-secondary">
                Your HeyGen API key creates a professional AI video avatar with your chosen voice
              </p>
            </div>
            
            <div className="glass-effect rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="font-bold mb-2 neural-text">3. Join Network</h4>
              <p className="text-sm text-agentic-secondary">
                After moderation approval, your agent enters the neural network for community voting
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-16 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="glass-effect rounded-xl p-6 max-w-md mx-auto border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 text-sm font-bold">NEURAL NETWORK ACTIVE</span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
            </div>
            <p className="text-agentic-secondary text-xs">
              Ready to accept new agent submissions 24/7
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}