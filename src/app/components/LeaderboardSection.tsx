import { Medal, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

const leaderboardData = [
  { rank: 1, player: 'ShadowPanda', score: 2450, snacks: 15, time: '58.2s', avatar: '🦝' },
  { rank: 2, player: 'NightThief', score: 2380, snacks: 14, time: '57.8s', avatar: '🦝' },
  { rank: 3, player: 'StealthMaster', score: 2290, snacks: 13, time: '56.4s', avatar: '🦝' },
  { rank: 4, player: 'CookieMonster', score: 2150, snacks: 12, time: '55.1s', avatar: '🦝' },
  { rank: 5, player: 'QuickPaws', score: 2020, snacks: 11, time: '53.9s', avatar: '🦝' },
  { rank: 6, player: 'TrashKing', score: 1980, snacks: 11, time: '52.7s', avatar: '🦝' },
  { rank: 7, player: 'SilentBandit', score: 1890, snacks: 10, time: '51.2s', avatar: '🦝' },
  { rank: 8, player: 'SnackHunter', score: 1850, snacks: 10, time: '50.5s', avatar: '🦝' },
  { rank: 9, player: 'MidnightRaid', score: 1780, snacks: 9, time: '49.8s', avatar: '🦝' },
  { rank: 10, player: 'LootGoblin', score: 1720, snacks: 9, time: '48.3s', avatar: '🦝' },
];

export function LeaderboardSection() {
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
            Compete for the highest scores
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
          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-[80px_1fr_120px_100px_100px] gap-4 pb-4 mb-4 border-b-2 border-white/10">
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
              Time
            </div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2">
            {leaderboardData.map((entry, index) => (
              <motion.div
                key={entry.player}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="grid grid-cols-[80px_1fr_120px] md:grid-cols-[80px_1fr_120px_100px_100px] gap-4 items-center py-5 px-4 rounded-xl border border-transparent hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-elevated)] transition-all duration-200"
              >
                {/* Rank */}
                <div className="flex items-center gap-2">
                  {entry.rank <= 3 ? (
                    <div className="flex items-center gap-2">
                      <Trophy size={20} style={{ color: getMedalColor(entry.rank) }} />
                      <span className="font-[var(--font-heading)] font-bold text-lg" style={{ color: getMedalColor(entry.rank) }}>
                        #{entry.rank}
                      </span>
                    </div>
                  ) : (
                    <span className="font-[var(--font-heading)] text-lg text-[var(--text-secondary)]">
                      #{entry.rank}
                    </span>
                  )}
                </div>

                {/* Player */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-lg">
                    {entry.avatar}
                  </div>
                  <span className="font-[var(--font-body)] font-semibold text-[var(--text-primary)]">
                    {entry.player}
                  </span>
                </div>

                {/* Score */}
                <div className="font-[var(--font-mono)] font-bold text-lg text-[var(--accent-primary)] text-right">
                  {entry.score.toLocaleString()}
                </div>

                {/* Snacks */}
                <div className="hidden md:flex items-center justify-end gap-2">
                  <span className="font-[var(--font-body)] text-[var(--text-secondary)]">
                    {entry.snacks}
                  </span>
                  <span className="text-lg">🍪</span>
                </div>

                {/* Time */}
                <div className="hidden md:block font-[var(--font-mono)] text-[var(--text-secondary)] text-right">
                  {entry.time}
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-8 text-center">
            <button className="px-8 py-3 rounded-full border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold hover:bg-[var(--accent-primary)]/10 transition-all duration-300">
              View Full Leaderboard
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
