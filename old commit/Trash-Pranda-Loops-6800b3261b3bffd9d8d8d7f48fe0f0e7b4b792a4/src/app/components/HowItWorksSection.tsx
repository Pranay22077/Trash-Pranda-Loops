import { motion } from 'motion/react';

const steps = [
  {
    number: '01',
    title: 'Enter the Kitchen',
    description: 'You spawn at the entrance. 60 seconds on the clock. NPCs begin their patrol routes.',
    emoji: '🚪',
  },
  {
    number: '02',
    title: 'Collect Snacks',
    description: 'Navigate the kitchen, avoid NPCs, and collect snacks. Better snacks = more points but higher risk.',
    emoji: '🍪',
  },
  {
    number: '03',
    title: 'Manage Stealth',
    description: 'Watch your noise meter and detection level. Hide when needed. Use abilities strategically.',
    emoji: '🤫',
  },
  {
    number: '04',
    title: 'Complete or Reset',
    description: 'Survive 60 seconds or get caught. Either way, earn points and unlock new abilities for the next loop.',
    emoji: '🔄',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-to-play" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)] via-[#2d1b3d] to-[var(--bg-secondary)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--accent-primary)] mb-4">
            HOW TO PLAY
          </div>
          <h2 className="font-[var(--font-heading)] font-bold text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            Simple to Learn, Hard to Master
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Get started in seconds, spend hours perfecting your runs
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12`}
            >
              {/* Number Badge and Content */}
              <div className="flex-1 flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/40">
                  <span className="font-[var(--font-heading)] font-bold text-2xl text-white">
                    {step.number}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-[var(--font-heading)] font-semibold text-2xl lg:text-3xl text-[var(--text-primary)] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1 max-w-md">
                <div className="aspect-video bg-[var(--bg-card)] rounded-2xl border-2 border-[var(--accent-primary)]/20 flex items-center justify-center text-8xl shadow-xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5 group-hover:opacity-0 transition-opacity duration-300" />
                  <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    {step.emoji}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
