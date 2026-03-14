import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import SplineScene from './SplineScene';

const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-br from-primary/95 via-purple-700 to-indigo-900">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <SplineScene
          scene="https://prod.spline.design/PwbEVKnbziNXYgZG/scene.splinecode"
          className="w-full h-full"
          fallback={
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-300/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
            </div>
          }
        />
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center mb-6 premium-glow">
              <img 
                src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png"
                alt="Zenith AI Logo"
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white font-playfair leading-tight">
            The best time to start
            <br />
            was yesterday.
            <br />
            <span className="text-white/70 text-2xl sm:text-3xl">The second best is now.</span>
          </h2>
          
          <p className="text-base sm:text-lg mb-10 text-white/60 leading-relaxed font-light max-w-lg mx-auto">
            Your mind doesn't need fixing — it needs understanding.
            Let Zenith be your mirror, your guide, your quiet companion.
          </p>
          
          <Button 
            asChild 
            className="bg-white text-primary hover:bg-white/90 text-base sm:text-lg font-semibold px-10 sm:px-14 py-5 sm:py-6 shadow-2xl w-full sm:w-auto min-h-[52px] transition-all duration-300"
          >
            <Link to="/chat">
              <Crown className="mr-2 h-5 w-5" />
              Start for Free
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
