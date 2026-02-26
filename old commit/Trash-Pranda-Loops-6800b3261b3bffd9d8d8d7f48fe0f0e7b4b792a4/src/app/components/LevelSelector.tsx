import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/database';
import { Level, UserProgress } from '../../lib/supabase';
import { Lock, Star, Trophy } from 'lucide-react';

interface LevelSelectorProps {
  onSelectLevel: (level: Level) => void;
  onClose: () => void;
}

export function LevelSelector({ onSelectLevel, onClose }: LevelSelectorProps) {
  const { user } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevels();
  }, [user]);

  const loadLevels = async () => {
    try {
      console.log('Loading levels...');
      const allLevels = await db.getAllLevels();
      console.log('Levels loaded:', allLevels.length);
      setLevels(allLevels);
      
      if (user) {
        console.log('Loading user progress...');
        const userProgress = await db.getUserProgress(user.id);
        console.log('User progress loaded:', userProgress.length);
        setProgress(userProgress);
      }
    } catch (error) {
      console.error('Error loading levels:', error);
      alert('Failed to load levels. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = (levelId: number) => {
    return progress.find(p => p.level_id === levelId);
  };

  const isLevelUnlocked = (level: Level) => {
    // For now, unlock all levels for everyone (no auth required)
    return true;
    
    // Original logic (commented out for now):
    // if (level.level_number === 1) return true;
    // if (!user) return level.level_number === 1;
    // const levelProgress = getLevelProgress(level.id);
    // return levelProgress?.unlocked || false;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      case 'master': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 border-2 border-[var(--accent-primary)]/30">
        <div className="text-center text-white">
          <p className="mb-4">Loading levels...</p>
          <p className="text-sm text-[var(--text-secondary)]">
            If this takes too long, check your internet connection
          </p>
        </div>
      </div>
    );
  }

  if (levels.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 border-2 border-[var(--accent-primary)]/30">
        <div className="text-center text-white">
          <p className="mb-4">No levels found!</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Please run the database setup SQL in Supabase
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-[var(--accent-primary)] rounded-lg hover:opacity-80"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-6 border-2 border-[var(--accent-primary)]/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Select Level</h3>
        <button
          onClick={onClose}
          className="text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {levels.map((level) => {
          const levelProgress = getLevelProgress(level.id);
          const unlocked = isLevelUnlocked(level);

          return (
            <motion.button
              key={level.id}
              onClick={() => unlocked && onSelectLevel(level)}
              disabled={!unlocked}
              whileHover={unlocked ? { scale: 1.05 } : {}}
              whileTap={unlocked ? { scale: 0.95 } : {}}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${unlocked ? 'bg-[var(--bg-elevated)] hover:border-[var(--accent-primary)] border-[var(--accent-primary)]/30' : 'bg-[var(--bg-secondary)] opacity-50 cursor-not-allowed border-gray-600'}
              `}
            >
              {/* Level Number */}
              <div className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                {level.level_number}
              </div>

              {/* Level Name */}
              <div className="text-sm font-medium text-[var(--text-primary)] mb-1">
                {level.name}
              </div>

              {/* Difficulty */}
              <div className={`text-xs ${getDifficultyColor(level.difficulty)} uppercase mb-2`}>
                {level.difficulty}
              </div>

              {/* Stars */}
              {levelProgress && levelProgress.stars > 0 && (
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className={star <= levelProgress.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                    />
                  ))}
                </div>
              )}

              {/* Best Score */}
              {levelProgress && levelProgress.best_score > 0 && (
                <div className="text-xs text-[var(--text-secondary)]">
                  Best: {levelProgress.best_score}
                </div>
              )}

              {/* Lock Icon */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={32} className="text-gray-600" />
                </div>
              )}

              {/* Completed Badge */}
              {levelProgress?.completed && (
                <div className="absolute top-2 right-2">
                  <Trophy size={16} className="text-yellow-400" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
