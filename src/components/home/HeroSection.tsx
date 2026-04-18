import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown, BookOpen, Gem } from 'lucide-react';
import { motion } from 'framer-motion';
import SplineScene from './SplineScene';

interface HeroSectionProps {
  showFeatures: boolean;
  setShowFeatures: (v: boolean) => void;
  parallaxOffset: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ showFeatures, setShowFeatures, parallaxOffset }) => {
  return (
    <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-20 px-3 sm:px-4 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated CSS Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ transform: `translateY(${parallaxOffset * 0.15}px)` }}
      >
        <SplineScene variant="hero" className="w-full h-full" />
      </div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/60 via-transparent to-background/70 dark:from-background/70 dark:via-background/20 dark:to-background/80" />

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center shadow-xl premium-glow">
              <img 
                src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png"
                alt="Zenith AI Logo"
                className="w-16 h-16 sm:w-20 sm:h-20"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 text-foreground px-3"
          >
            Reach Your <span className="font-playfair italic text-primary">Zenith</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-2xl mb-3 text-foreground/80 font-light leading-relaxed px-4 max-w-2xl mx-auto"
          >
            The highest point isn't a destination — it's a practice.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base mb-8 sm:mb-10 text-foreground/60 font-light px-6 max-w-xl mx-auto"
          >
            AI-powered meditation, mood intelligence, and personalized wellness — 
            crafted for the journey inward.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-5 mb-8 sm:mb-10 px-4"
          >
            <Button 
              asChild 
              className="zenith-button-primary text-base sm:text-lg font-semibold px-8 sm:px-10 py-5 sm:py-6 shadow-xl w-full sm:w-auto min-h-[52px]"
              onClick={() => setShowFeatures(true)}
            >
              <Link to="/chat">
                Begin Your Journey
              </Link>
            </Button>
            {showFeatures && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full sm:w-auto"
                >
                  <Button 
                    asChild 
                    className="zenith-button-secondary text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-5 w-full sm:w-auto min-h-[44px]"
                  >
                    <Link to="/resources">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Wisdom Library
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full sm:w-auto"
                >
                  <Button 
                    asChild 
                    className="zenith-button-secondary text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-5 w-full sm:w-auto min-h-[44px]"
                  >
                    <Link to="/meditation">
                      <Gem className="mr-2 h-4 w-4" />
                      Meditation
                    </Link>
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="px-6"
          >
            <blockquote className="text-sm sm:text-base text-foreground/70 italic font-light max-w-lg mx-auto border-l-2 border-primary/50 pl-4 text-left">
              "The mind is everything. What you think, you become."
              <span className="block text-xs mt-1 not-italic text-foreground/50">— Buddha</span>
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
