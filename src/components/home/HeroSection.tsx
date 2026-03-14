import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown, BookOpen, Gem, Sparkles } from 'lucide-react';
import SplineScene from './SplineScene';

interface HeroSectionProps {
  showFeatures: boolean;
  setShowFeatures: (v: boolean) => void;
  parallaxOffset: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ showFeatures, setShowFeatures, parallaxOffset }) => {
  return (
    <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-20 px-3 sm:px-4 min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Spline Background — Ambient abstract blob */}
      <div 
        className="absolute inset-0 z-0 opacity-70 dark:opacity-50 pointer-events-none"
        style={{ transform: `translateY(${parallaxOffset * 0.15}px)` }}
      >
        <SplineScene
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          className="w-full h-full"
          fallback={
            <div className="w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          }
        />
      </div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/60 via-transparent to-background/70 dark:from-background/70 dark:via-background/20 dark:to-background/80" />

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 royal-fade-in">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center shadow-xl premium-glow">
              <img 
                src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png"
                alt="Zenith AI Logo"
                className="w-16 h-16 sm:w-20 sm:h-20"
              />
            </div>
          </div>

          {/* Title with deep meaning */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 text-foreground royal-fade-in px-3" style={{ animationDelay: '0.2s' }}>
            Reach Your <span className="font-playfair italic text-primary">Zenith</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-3 text-foreground/80 royal-fade-in font-light leading-relaxed px-4 max-w-2xl mx-auto" style={{ animationDelay: '0.3s' }}>
            The highest point isn't a destination — it's a practice.
          </p>

          <p className="text-sm sm:text-base mb-8 sm:mb-10 text-foreground/60 royal-fade-in font-light px-6 max-w-xl mx-auto" style={{ animationDelay: '0.4s' }}>
            AI-powered meditation, mood intelligence, and personalized wellness — 
            crafted for the journey inward.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-5 mb-8 sm:mb-10 royal-fade-in px-4" style={{ animationDelay: '0.5s' }}>
            <Button 
              asChild 
              className="zenith-button-primary text-base sm:text-lg font-semibold px-8 sm:px-10 py-5 sm:py-6 shadow-xl w-full sm:w-auto min-h-[52px]"
              onClick={() => setShowFeatures(true)}
            >
              <Link to="/chat">
                <Crown className="mr-2 h-5 w-5" />
                Begin Your Journey
              </Link>
            </Button>
            {showFeatures && (
              <>
                <Button 
                  asChild 
                  className="zenith-button-secondary text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-5 animate-slide-in-left w-full sm:w-auto min-h-[44px]"
                  style={{ animationDelay: '0.2s' }}
                >
                  <Link to="/resources">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Wisdom Library
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="zenith-button-secondary text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-5 animate-slide-in-right w-full sm:w-auto min-h-[44px]"
                  style={{ animationDelay: '0.4s' }}
                >
                  <Link to="/meditation">
                    <Gem className="mr-2 h-4 w-4" />
                    Meditation
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Meaningful quote */}
          <div className="royal-fade-in px-6" style={{ animationDelay: '0.7s' }}>
            <blockquote className="text-sm sm:text-base text-muted-foreground/60 italic font-light max-w-lg mx-auto border-l-2 border-primary/30 pl-4 text-left">
              "The mind is everything. What you think, you become."
              <span className="block text-xs mt-1 not-italic text-muted-foreground/40">— Buddha</span>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
