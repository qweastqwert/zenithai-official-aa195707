import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSection, { staggerContainer, staggerItem } from './AnimatedSection';
import SplineScene from './SplineScene';

const pillars = [
  {
    title: 'Presence over Perfection',
    desc: 'Not about being perfect — about being present. Our AI meets you where you are.',
    gradient: 'from-primary to-primary/20',
  },
  {
    title: 'Patterns reveal Purpose',
    desc: 'Track your moods, sleep, and thoughts. The data tells a story only you can write.',
    gradient: 'from-purple-500 to-purple-500/20',
  },
  {
    title: 'Growth is not linear',
    desc: 'Bad days are data, not defeats. Zenith helps you find clarity in chaos.',
    gradient: 'from-indigo-500 to-indigo-500/20',
  },
];

const PhilosophySection: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Orb background */}
      <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none hidden md:block">
        <SplineScene variant="philosophy" className="w-full h-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl">
          <AnimatedSection>
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">The Philosophy</span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground font-playfair leading-tight">
              Your mind deserves
              <br />
              <span className="royal-gradient-text">the same care</span>
              <br />
              as your body.
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
              We built Zenith AI on a simple truth: mental wellness isn't a luxury, it's a foundation. 
              Every meditation, every mood check-in, every conversation with your AI companion 
              is a step toward understanding yourself more deeply.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-6"
          >
            {pillars.map((pillar) => (
              <motion.div key={pillar.title} variants={staggerItem} className="flex items-start gap-4">
                <div className={`w-1 h-12 bg-gradient-to-b ${pillar.gradient} rounded-full flex-shrink-0 mt-1`} />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
