import { useEffect, useState } from 'react';
import { Medal, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../../lib/database';

interface LeaderboardEntry {
  id: string;
  username: string;
  display_name: string | null;
  total_score: number;
  total_snacks_collected: number;
  rank: string;
}

export function LeaderboardSection() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
    
    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(loadLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await db.getGlobalLeaderboard(10);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'var(--snack-common)'; // Gold
    if (rank === 2) return '#c0c0c0'; // Silver
    if (rank === 3) return '#cd7f32'; // Bronze
    return 'var(--text-secondary)';
  };

  return (
    <section id="leaderboard" className="py-24 lg:py-32 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--accent-primary)] mb-4">
            TOP PLAYERS
          </div>
          <h2 className="font-[var(--font-heading)] font-bold text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            Global Leaderboard
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Compete for the highest scores • Updates in real-time
          </p>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-[var(--bg-card)] rounded-3xl p-6 lg:p-10 border border-white/5 shadow-2xl"
        >
          {loading ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              Loading leaderboard...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🦝</div>
              <p className="text-[var(--text-secondary)]">
                Be the first to set a high score!
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-[80px_1fr_120px_100px_120px] gap-4 pb-4 mb-4 border-b-2 border-white/10">
                <div className="font-[var(--font-heading)] font-semibold text-sm uppercase text-[var(--text-secondary)]">
                  Rank
                </div>
                <div className="font-[var(--font-heading)] font-semibold text-sm uppercase text-[var(--text-secondary)]">
                  Player
                </div>
                <div className="font-[var(--font-heading)] font-semibold text-sm uppercase text-[var(--text-secondary)] text-right">
                  Score
                </div>
                <div className="font-[var(--font-heading)] font-semibold text-sm uppercase text-[var(--text-secondary)] text-right">
                  Snacks
                </div>
                <div className="font-[var(--font-heading)] font-semibold text-sm uppercase text-[var(--text-secondary)] text-right">
                  Rank
                </div>
              </div>

              {/* Table Rows */}
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="grid grid-cols-[80px_1fr_120px] md:grid-cols-[80px_1fr_120px_100px_120px] gap-4 items-center py-5 px-4 rounded-xl border border-transparent hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-elevated)] transition-all duration-200"
                    >
                      {/* Rank */}
                      <div className="flex items-center gap-2">
                        {rank <= 3 ? (
                          <div className="flex items-center gap-2">
                            <Trophy size={20} style={{ color: getMedalColor(rank) }} />
                            <span className="font-[var(--font-heading)] font-bold text-lg" style={{ color: getMedalColor(rank) }}>
                              #{rank}
                            </span>
                          </div>
                        ) : (
                          <span className="font-[var(--font-heading)] text-lg text-[var(--text-secondary)]">
                            #{rank}
                          </span>
                        )}
                      </div>

                      {/* Player */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-lg">
                          🦝
                        </div>
                        <span className="font-[var(--font-body)] font-semibold text-[var(--text-primary)]">
                          {entry.display_name || entry.username}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="font-[var(--font-mono)] font-bold text-lg text-[var(--accent-primary)] text-right">
                        {entry.total_score.toLocaleString()}
                      </div>

                      {/* Snacks */}
                      <div className="hidden md:flex items-center justify-end gap-2">
                        <span className="font-[var(--font-body)] text-[var(--text-secondary)]">
                          {entry.total_snacks_collected}
                        </span>
                        <span className="text-lg">🧀</span>
                      </div>

                      {/* Rank Title */}
                      <div className="hidden md:block font-[var(--font-mono)] text-xs text-[var(--text-secondary)] text-right">
                        {entry.rank}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
