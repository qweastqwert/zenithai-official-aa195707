import React from 'react';
import { Brain, Clock, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: 'Meditate',
    subtitle: 'Still the noise',
    description: 'Guided sessions that teach your mind the art of stillness. Because clarity lives in the quiet.',
    gradient: 'from-primary via-purple-600 to-indigo-700',
  },
  {
    icon: Clock,
    title: 'Understand',
    subtitle: 'Know your patterns',
    description: 'Track emotions across time. See what triggers joy, what steals peace — and learn to navigate both.',
    gradient: 'from-pink-500 via-rose-500 to-red-500',
  },
  {
    icon: BookOpen,
    title: 'Grow',
    subtitle: 'Feed the mind',
    description: 'Curated articles and tools from psychology and wellness research, presented when you need them most.',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-muted/30 dark:bg-muted/10 reveal-on-scroll">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">What Zenith Offers</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground font-playfair">
            Three pillars of <span className="royal-gradient-text">inner strength</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Simple tools with profound impact. Each one designed to build a different dimension of your mental resilience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group border-none bg-card/80 backdrop-blur-sm hover:bg-card shadow-sm hover:shadow-xl transition-all duration-500 reveal-on-scroll overflow-hidden"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-8 sm:p-10 flex flex-col items-start text-left relative">
                {/* Subtle gradient accent on hover */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">{feature.subtitle}</span>
                <h3 className="text-2xl font-bold mb-3 text-foreground font-playfair">{feature.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
