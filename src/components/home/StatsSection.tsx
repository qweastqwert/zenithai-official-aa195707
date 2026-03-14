import React from 'react';

const stats = [
  { value: '10,000+', label: 'Minds at peace', sublabel: 'users finding clarity' },
  { value: '500+', label: 'Hours of stillness', sublabel: 'guided meditations' },
  { value: '50+', label: 'Paths to wisdom', sublabel: 'curated resources' },
];

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 border-y border-border/50 reveal-on-scroll">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="group">
              <div className="text-4xl sm:text-5xl font-bold royal-gradient-text mb-2 font-playfair">{stat.value}</div>
              <div className="text-foreground font-medium text-sm sm:text-base">{stat.label}</div>
              <div className="text-muted-foreground/50 text-xs mt-1">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
