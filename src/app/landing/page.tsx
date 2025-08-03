'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(0);
  const [stats, setStats] = useState({
    swipesToday: 47832,
    topAvatar: 'NeoGhost',
    totalUsers: 10247
  });

  // Sample avatars for preview
  const sampleAvatars = [
    { name: 'NeoGhost', personality: 'Mysterious Hacker', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', votes: 2847 },
    { name: 'Steve 3.0', personality: 'Tech Visionary', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', votes: 2156 },
    { name: 'Eclipse Monk', personality: 'Digital Sage', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face', votes: 1923 },
    { name: 'Void Walker', personality: 'Quantum Entity', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face', votes: 1687 },
  ];

  // Auto-rotate avatars
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAvatar((prev) => (prev + 1) % sampleAvatars.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sampleAvatars.length]);

  // Simulate real-time stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        swipesToday: prev.swipesToday + Math.floor(Math.random() * 5) + 1
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send to your backend
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-void text-white overflow-x-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Floating Particles */}
        <div className="cyber-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="neon-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 8}s`
              }}
            />
          ))}
        </div>

        {/* Background Video Simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Tagline */}
            <motion.h1
              className="text-6xl md:text-8xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="holo-text">SWIPE THROUGH</span>
              <br />
              <span className="neon-text">SOULS OF THE FUTURE</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="text-xl md:text-2xl text-text-secondary mb-8 font-mono"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              300+ AI avatars. Real voices. No names. Just vibes.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Link
                href="/app"
                className="inline-block cyber-btn text-xl px-12 py-6 mb-12 hover:scale-105 transition-transform"
              >
                ENTER THE UNIVERSE
              </Link>
            </motion.div>

            {/* Floating Avatar Preview */}
            <motion.div
              className="relative w-32 h-32 mx-auto mb-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAvatar}
                  className="absolute inset-0 rounded-full overflow-hidden border-2 border-neon-cyan"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={sampleAvatars[currentAvatar].image}
                    alt={sampleAvatars[currentAvatar].name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/20 to-transparent" />
                </motion.div>
              </AnimatePresence>
              
              {/* Pulse Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-neon-cyan animate-ping opacity-20" />
            </motion.div>

            {/* Current Avatar Info */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="neon-cyan-text font-mono text-lg font-bold">
                {sampleAvatars[currentAvatar].name}
              </div>
              <div className="text-text-muted text-sm">
                {sampleAvatars[currentAvatar].personality}
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-text-muted text-sm font-mono">EXPLORE</span>
              <motion.div
                className="w-6 h-10 border-2 border-neon-cyan rounded-full flex justify-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="w-1 h-3 bg-neon-cyan rounded-full mt-2"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl md:text-6xl font-black text-center mb-16 holo-text"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              HOW IT WORKS
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  title: 'Watch AI-Generated Avatars Talk',
                  description: 'Experience lifelike digital personalities with unique voices and stories',
                  icon: '👁️'
                },
                {
                  step: '02',
                  title: 'Swipe Anonymously',
                  description: 'No profiles, no names, no pressure. Just pure personality connection',
                  icon: '👆'
                },
                {
                  step: '03',
                  title: 'Let the Crowd Decide',
                  description: 'Community voting determines which avatars become legendary',
                  icon: '🏆'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center cyber-card p-8"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <div className="text-6xl mb-6">{item.icon}</div>
                  <div className="neon-purple-text font-mono text-sm font-bold mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-4 neon-text">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Avatars Preview */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-4xl md:text-6xl font-black text-center mb-16 holo-text"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              MEET THE COLLECTIVE
            </motion.h2>

            <div className="grid md:grid-cols-4 gap-6">
              {sampleAvatars.map((avatar, index) => (
                <motion.div
                  key={index}
                  className="cyber-card p-6 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-neon-cyan">
                    <Image
                      src={avatar.image}
                      alt={avatar.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="neon-cyan-text font-mono font-bold mb-2">
                    {avatar.name}
                  </h3>
                  <p className="text-text-muted text-sm mb-3">
                    {avatar.personality}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="neon-green-text">👍</span>
                    <span className="text-neon-green font-mono text-sm">
                      {avatar.votes.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Pulse */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-6xl font-black mb-16 holo-text"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              NEURAL PULSE
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="cyber-card p-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="neon-cyan-text text-4xl font-black font-mono mb-2">
                  {stats.swipesToday.toLocaleString()}
                </div>
                <div className="text-text-secondary">Swipes Today</div>
              </motion.div>

              <motion.div
                className="cyber-card p-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="neon-pink-text text-4xl font-black font-mono mb-2">
                  {stats.topAvatar}
                </div>
                <div className="text-text-secondary">Top Avatar</div>
              </motion.div>

              <motion.div
                className="cyber-card p-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="neon-green-text text-4xl font-black font-mono mb-2">
                  {stats.totalUsers.toLocaleString()}+
                </div>
                <div className="text-text-secondary">Early Users</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Anonymous Leaderboard */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-4xl md:text-6xl font-black text-center mb-16 holo-text"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              TOP RATED THIS WEEK
            </motion.h2>

            <div className="space-y-4">
              {sampleAvatars.slice(0, 3).map((avatar, index) => (
                <motion.div
                  key={index}
                  className="leaderboard-item p-6"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[60px]">
                      <div className={`text-4xl font-black font-mono ${
                        index === 0 ? 'text-neon-cyan' : 
                        index === 1 ? 'text-neon-pink' : 'text-neon-purple'
                      }`}>
                        {index === 0 ? '👑' : index === 1 ? '⚡' : '🔥'}
                      </div>
                      <div className="text-text-muted text-xs font-mono">
                        {index === 0 ? 'PRIME' : index === 1 ? 'ALPHA' : 'BETA'}
                      </div>
                    </div>

                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-neon-cyan">
                      <Image
                        src={avatar.image}
                        alt={avatar.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="neon-text font-mono font-bold mb-1">
                        {avatar.name}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {avatar.personality}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="neon-green-text font-mono text-xl font-bold">
                        {avatar.votes.toLocaleString()}
                      </div>
                      <div className="text-text-muted text-xs">VOTES</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Waitlist CTA */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-6xl font-black mb-8 holo-text"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              JOIN THE FUTURE
            </motion.h2>

            <motion.p
              className="text-xl text-text-secondary mb-12 font-mono"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join {stats.totalUsers.toLocaleString()}+ early users shaping the future of identity
            </motion.p>

            <motion.form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-carbon border-2 border-steel-gray rounded-lg text-white placeholder-text-muted focus:border-neon-cyan focus:outline-none font-mono"
                required
              />
              <button
                type="submit"
                className="cyber-btn px-8 py-4 whitespace-nowrap"
                disabled={isSubmitted}
              >
                {isSubmitted ? 'JOINED!' : 'JOIN WAITLIST'}
              </button>
            </motion.form>

            {isSubmitted && (
              <motion.div
                className="mt-6 text-neon-green font-mono"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                ✓ Welcome to the neural collective
              </motion.div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-steel-gray">
          <div className="max-w-4xl mx-auto text-center">
            <div className="neon-text font-mono text-2xl font-bold mb-4">
              NEURAL.MATCH
            </div>
            <div className="text-text-muted text-sm font-mono">
              The future of anonymous social discovery
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}