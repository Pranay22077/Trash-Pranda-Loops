import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from './AuthModal';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Play', href: '#play' },
    { name: 'Leaderboard', href: '#leaderboard' },
    { name: 'Stats', href: '#stats' },
  ];

  const handlePlayNow = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      document.getElementById('play')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-2xl shadow-lg shadow-[var(--accent-primary)]/40">
                🦝
              </div>
              <span className="font-[var(--font-heading)] font-bold text-xl text-[var(--text-primary)]">
                Trash Panda Loops
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent-primary)] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              
              {user && profile ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-full border border-[var(--accent-primary)]/30">
                    <User size={16} className="text-[var(--accent-primary)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">{profile.username}</span>
                    <span className="text-xs text-[var(--text-secondary)]">•</span>
                    <span className="text-xs text-[var(--accent-warning)]">{profile.total_score}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-danger)] transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePlayNow}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold shadow-lg shadow-[var(--accent-primary)]/40 hover:scale-105 hover:shadow-xl hover:shadow-[var(--accent-primary)]/60 transition-all duration-300"
                >
                  Sign In / Play
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[var(--text-primary)] p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 top-[70px] bg-[var(--bg-secondary)] z-40"
            >
              <div className="flex flex-col items-center gap-6 py-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-[var(--text-primary)] text-lg hover:text-[var(--accent-primary)] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                
                {user && profile ? (
                  <>
                    <div className="text-center">
                      <div className="text-[var(--text-primary)] font-medium">{profile.username}</div>
                      <div className="text-sm text-[var(--text-secondary)]">Score: {profile.total_score}</div>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="px-8 py-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--accent-danger)] text-[var(--accent-danger)] font-semibold"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handlePlayNow();
                      setMobileMenuOpen(false);
                    }}
                    className="px-12 py-4 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold shadow-lg shadow-[var(--accent-primary)]/40"
                  >
                    Sign In / Play
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
