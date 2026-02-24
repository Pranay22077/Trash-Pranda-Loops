import { RotateCcw, Cookie, Trophy, Zap, Clock, Eye, Rocket, Award } from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  {
    icon: RotateCcw,
    number: '127',
    label: 'Total Loops',
    trend: '+12 today',
    color: 'var(--accent-primary)',
  },
  {
    icon: Cookie,
    number: '1,234',
    label: 'Snacks Collected',
    trend: '+89 today',
    color: 'var(--accent-warning)',
  },
  {
    icon: Trophy,
    number: '2,450',
    label: 'Best Score',
    trend: 'Top 5%',
    color: 'var(--accent-secondary)',
  },
  {
    icon: Zap,
    number: '3/5',
    label: 'Abilities Unlocked',
    progress: 60,
    color: 'var(--accent-success)',
  },
];

const achievements = [
  { icon: '🎯', title: 'First Heist', unlocked: true, color: 'var(--accent-primary)' },
  { icon: '⚡', title: 'Speed Demon', unlocked: true, color: 'var(--accent-warning)' },
  { icon: '👻', title: 'Ghost', unlocked: true, color: 'var(--accent-secondary)' },
  { icon: '🎁', title: 'Collector', unlocked: false, color: 'var(--text-muted)' },
  { icon: '🏆', title: 'Veteran', unlocked: false, color: 'var(--text-muted)' },
  { icon: '💎', title: 'Legendary Thief', unlocked: false, color: 'var(--text-muted)' },
  { icon: '🔥', title: 'On Fire', unlocked: false, color: 'var(--text-muted)' },
  { icon: '🌟', title: 'Perfect Run', unlocked: false, color: 'var(--text-muted)' },
];

export function StatsSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b3d] via-[var(--bg-primary)] to-[var(--bg-primary)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--accent-primary)] mb-4">
            YOUR PROGRESS
          </div>
          <h2 className="font-[var(--font-heading)] font-bold text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            Track Your Journey
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-[var(--bg-card)] p-8 rounded-2xl border-l-4 shadow-lg relative overflow-hidden"
              style={{ borderLeftColor: stat.color }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${stat.color} 15%, transparent)`,
                    }}
                  >
                    <stat.icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="font-[var(--font-heading)] font-bold text-5xl text-[var(--text-primary)] mb-2">
                  {stat.number}
                </div>
                <div className="text-[var(--text-secondary)] mb-3">{stat.label}</div>
                {stat.trend && (
                  <div className="text-sm text-[var(--accent-success)] font-semibold">
                    {stat.trend}
                  </div>
                )}
                {stat.progress !== undefined && (
                  <div className="mt-3">
                    <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: stat.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-[var(--font-heading)] font-bold text-3xl text-[var(--text-primary)] mb-8 text-center">
            Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: achievement.unlocked ? 1.1 : 1 }}
                className={`bg-[var(--bg-card)] p-4 rounded-xl border ${
                  achievement.unlocked
                    ? 'border-[var(--accent-primary)]/30 shadow-lg shadow-[var(--accent-primary)]/10'
                    : 'border-white/5'
                } flex flex-col items-center text-center transition-all duration-300`}
              >
                <div
                  className={`text-5xl mb-2 ${
                    !achievement.unlocked && 'grayscale opacity-30'
                  }`}
                >
                  {achievement.icon}
                </div>
                <div
                  className={`text-sm font-semibold ${
                    achievement.unlocked
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  {achievement.title}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
