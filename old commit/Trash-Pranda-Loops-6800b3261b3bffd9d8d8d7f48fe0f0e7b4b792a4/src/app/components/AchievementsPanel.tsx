import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/database';
import { Achievement, UserAchievement } from '../../lib/supabase';
import { Trophy, Lock } from 'lucide-react';

interface AchievementsPanelProps {
  onClose: () => void;
}

export function AchievementsPanel({ onClose }: AchievementsPanelProps) {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const loadAchievements = async () => {
    try {
      const allAchievements = await db.getAllAchievements();
      setAchievements(allAchievements);
      
      if (user) {
        const unlocked = await db.getUserAchievements(user.id);
        setUserAchievements(unlocked);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (achievementId: number) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-400/10';
      case 'rare': return 'border-blue-400 bg-blue-400/10';
      case 'epic': return 'border-purple-400 bg-purple-400/10';
      case 'legendary': return 'border-yellow-400 bg-yellow-400/10';
      default: return 'border-gray-600 bg-gray-600/10';
    }
  };

  if (loading) {
    return <div className="text-center text-white p-4">Loading achievements...</div>;
  }

  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-6 border-2 border-[var(--accent-primary)]/30">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">
            Achievements
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>
        <p className="text-[var(--text-secondary)] text-center">
          {unlockedCount} / {totalCount} Unlocked
        </p>
        <div className="w-full h-2 bg-[var(--bg-secondary)] rounded-full mt-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const unlocked = isUnlocked(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${getRarityColor(achievement.rarity)}
                ${unlocked ? '' : 'opacity-50'}
              `}
            >
              {/* Icon */}
              <div className="text-4xl mb-2 text-center">
                {unlocked ? achievement.icon : '🔒'}
              </div>

              {/* Name */}
              <h4 className="text-lg font-bold text-[var(--text-primary)] text-center mb-1">
                {achievement.name}
              </h4>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] text-center mb-2">
                {achievement.description}
              </p>

              {/* Points */}
              <div className="flex items-center justify-center gap-2">
                <Trophy size={14} className="text-yellow-400" />
                <span className="text-sm text-yellow-400 font-bold">
                  {achievement.points} pts
                </span>
              </div>

              {/* Rarity Badge */}
              <div className="absolute top-2 right-2">
                <span className={`
                  text-xs px-2 py-1 rounded-full uppercase font-bold
                  ${achievement.rarity === 'legendary' ? 'bg-yellow-400 text-black' :
                    achievement.rarity === 'epic' ? 'bg-purple-400 text-white' :
                    achievement.rarity === 'rare' ? 'bg-blue-400 text-white' :
                    'bg-gray-400 text-white'}
                `}>
                  {achievement.rarity}
                </span>
              </div>

              {/* Lock Overlay */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                  <Lock size={32} className="text-gray-400" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
