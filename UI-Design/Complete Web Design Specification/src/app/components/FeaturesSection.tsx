import { Clock, Eye, Star, Gem, Users, Dice6 } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    icon: Clock,
    title: '60-Second Loops',
    description: 'Each run lasts exactly 60 seconds. Time resets, but your knowledge persists. Learn patterns and optimize your route.',
    color: 'var(--accent-primary)',
  },
  {
    icon: Eye,
    title: 'Avoid Detection',
    description: 'Movement generates noise. NPCs detect via sight and sound. Hide strategically and time your moves perfectly.',
    color: 'var(--accent-secondary)',
  },
  {
    icon: Star,
    title: 'Unlock Abilities',
    description: 'Earn points from successful heists. Unlock permanent abilities like Dash, Silent Paws, and Time Sense.',
    color: 'var(--accent-success)',
  },
  {
    icon: Gem,
    title: 'High-Value Snacks',
    description: 'Better snacks are harder to reach and make more noise. Push your luck or play it safe.',
    color: 'var(--accent-warning)',
  },
  {
    icon: Users,
    title: 'Smart Enemies',
    description: 'Humans and pets patrol with predictable patterns. They investigate sounds and remember your last position.',
    color: 'var(--accent-warm)',
  },
  {
    icon: Dice6,
    title: 'Always Fresh',
    description: 'Snack positions randomize each loop. Multiple strategies viable. High replayability.',
    color: 'var(--snack-legendary)',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 bg-[var(--bg-secondary)] relative">
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
            GAME FEATURES
          </div>
          <h2 className="font-[var(--font-heading)] font-bold text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            Master the Perfect Heist
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Every loop is a chance to learn, adapt, and steal the ultimate snack
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="bg-[var(--bg-card)] p-10 rounded-3xl border border-white/10 hover:border-[var(--accent-primary)] transition-all duration-300 group"
            >
              <div
                className="w-16 h-16 mb-6 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300"
                style={{
                  backgroundColor: `color-mix(in srgb, ${feature.color} 15%, transparent)`,
                }}
              >
                <feature.icon size={32} style={{ color: feature.color }} />
              </div>
              <h3 className="font-[var(--font-heading)] font-semibold text-2xl text-[var(--text-primary)] mb-4">
                {feature.title}
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
