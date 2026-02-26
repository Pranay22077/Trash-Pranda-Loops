import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showMessage, setShowMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        setShowMessage('Signed in successfully!');
        setTimeout(() => onClose(), 1000);
      } else {
        if (!username) {
          setError('Username is required');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await signUp(email, password, username);
        setShowMessage('Account created! You can now play.');
        setTimeout(() => onClose(), 1500);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || err.error_description || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[var(--bg-card)] rounded-2xl border-2 border-[var(--accent-primary)] shadow-2xl shadow-[var(--accent-primary)]/20 p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            ✕
          </button>

          {/* Title */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🦝</div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {mode === 'signin' ? 'Welcome Back!' : 'Join the Heist'}
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              {mode === 'signin' ? 'Sign in to continue your adventure' : 'Create an account to start playing'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/30 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                  placeholder="TrashMaster"
                  required={mode === 'signup'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/30 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/30 rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg px-4 py-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {showMessage && (
              <div className="bg-green-500/10 border border-green-500 rounded-lg px-4 py-3 text-green-200 text-sm">
                {showMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold rounded-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError('');
              }}
              className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
