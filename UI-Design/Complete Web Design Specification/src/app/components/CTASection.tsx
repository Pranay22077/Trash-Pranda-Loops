import { motion } from 'motion/react';

export function CTASection() {
  return (
    <section className="py-20 bg-[var(--accent-primary)] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🍪</div>
        <div className="absolute top-20 right-20 text-5xl">🍕</div>
        <div className="absolute bottom-10 left-1/4 text-7xl">🧀</div>
        <div className="absolute bottom-20 right-1/3 text-6xl">🍩</div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-[var(--font-heading)] font-bold text-4xl lg:text-5xl text-[var(--bg-primary)] mb-4">
            Ready to Start Your Heist?
          </h2>
          <p className="text-xl text-[var(--bg-primary)]/80 mb-10">
            Join thousands of raccoons stealing snacks
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="h-16 px-16 rounded-full bg-[var(--bg-primary)] text-[var(--accent-primary)] font-bold text-xl flex items-center justify-center gap-3 mx-auto shadow-2xl hover:shadow-[0_20px_60px_rgba(15,20,25,0.4)] transition-all duration-300"
          >
            <span className="text-2xl">🦝</span>
            Play Now - It's Free
          </motion.button>

          <p className="mt-6 text-sm text-[var(--bg-primary)]/60">
            No download required • Works on all devices
          </p>
        </motion.div>
      </div>
    </section>
  );
}
