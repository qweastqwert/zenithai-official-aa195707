import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './AnimatedSection';

const stats = [
  { value: '10,000+', label: 'Minds at peace', sublabel: 'users finding clarity' },
  { value: '500+', label: 'Hours of stillness', sublabel: 'guided meditations' },
  { value: '50+', label: 'Paths to wisdom', sublabel: 'curated resources' },
];

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 border-y border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={staggerItem} className="group">
              <div className="text-4xl sm:text-5xl font-bold royal-gradient-text mb-2 font-playfair">{stat.value}</div>
              <div className="text-foreground font-medium text-sm sm:text-base">{stat.label}</div>
              <div className="text-muted-foreground/50 text-xs mt-1">{stat.sublabel}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
