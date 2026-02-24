import { Play, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import Prism from './backgrounds/Prism';

export function HeroSection() {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToGame = () => {
    document.getElementById('play')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen pt-[70px] relative overflow-hidden">
      {/* Animated Background with Prism */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-[60%_40%] gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-[var(--font-heading)] font-extrabold text-4xl sm:text-5xl lg:text-[56px] text-[var(--text-primary)] leading-tight mb-6">
              Steal Snacks in 60-Second Time Loops
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-10">
              You're a clever raccoon stuck in a temporal anomaly. Master the perfect heist, avoid detection, and unlock new abilities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={scrollToGame}
                className="h-14 px-12 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-[var(--accent-primary)]/50 hover:scale-105 hover:shadow-xl hover:shadow-[var(--accent-primary)]/60 transition-all duration-300">
                <Play size={20} fill="white" />
                Play Now
              </button>
              <button className="h-14 px-10 rounded-full bg-transparent border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold text-lg flex items-center justify-center gap-3 hover:bg-[var(--accent-primary)]/10 transition-all duration-300">
                <PlayCircle size={20} />
                Watch Trailer
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-[var(--bg-card)] p-4 rounded-xl border border-white/5"
              >
                <div className="font-[var(--font-heading)] font-bold text-2xl text-[var(--accent-primary)] mb-1">
                  10K+
                </div>
                <div className="text-sm text-[var(--text-secondary)]">Players</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-[var(--bg-card)] p-4 rounded-xl border border-white/5"
              >
                <div className="font-[var(--font-heading)] font-bold text-2xl text-[var(--accent-secondary)] mb-1">
                  60s
                </div>
                <div className="text-sm text-[var(--text-secondary)]">Per Loop</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-[var(--bg-card)] p-4 rounded-xl border border-white/5"
              >
                <div className="font-[var(--font-heading)] font-bold text-2xl text-[var(--accent-success)] mb-1">
                  ∞
                </div>
                <div className="text-sm text-[var(--text-secondary)]">Replayability</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Game Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square max-w-[500px] mx-auto bg-[var(--bg-card)] rounded-3xl border-2 border-[var(--accent-primary)]/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 animate-pulse" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-8xl mb-8"
                >
                  🦝
                </motion.div>
                
                {/* Floating Snacks */}
                <div className="absolute top-20 left-20">
                  <motion.div
                    animate={{ rotate: 360, y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="text-4xl"
                  >
                    🍪
                  </motion.div>
                </div>
                <div className="absolute top-32 right-24">
                  <motion.div
                    animate={{ rotate: -360, y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="text-4xl"
                  >
                    🍕
                  </motion.div>
                </div>
                <div className="absolute bottom-32 left-28">
                  <motion.div
                    animate={{ rotate: 360, y: [0, -12, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                    className="text-4xl"
                  >
                    🧀
                  </motion.div>
                </div>

                {/* Timer */}
                <div className="mt-auto w-full">
                  <div className="bg-[var(--bg-primary)] rounded-2xl p-6 border border-[var(--accent-primary)]/30">
                    <div className="text-center mb-3">
                      <div className="font-[var(--font-mono)] text-5xl font-bold text-[var(--accent-primary)]">
                        {countdown.toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)] mt-1">seconds remaining</div>
                    </div>
                    
                    {/* Detection Meter */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                        <span>Detection</span>
                        <span>23%</span>
                      </div>
                      <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[var(--accent-success)] via-[var(--accent-warning)] to-[var(--accent-danger)]"
                          initial={{ width: '0%' }}
                          animate={{ width: '23%' }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
