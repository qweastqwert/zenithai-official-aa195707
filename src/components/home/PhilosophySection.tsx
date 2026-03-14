import React from 'react';
import SplineScene from './SplineScene';

const PhilosophySection: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* 3D Scene — Interactive floating object */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-60 dark:opacity-40 pointer-events-none hidden md:block">
        <SplineScene
          scene="https://prod.spline.design/pvM5sSiYV2ivGeya/scene.splinecode"
          className="w-full h-full"
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/15 via-purple-400/10 to-primary/5 blur-2xl animate-float" />
            </div>
          }
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl">
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

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-1 h-12 bg-gradient-to-b from-primary to-primary/20 rounded-full flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Presence over Perfection</h3>
                <p className="text-sm text-muted-foreground">
                  Not about being perfect — about being present. Our AI meets you where you are.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-purple-500/20 rounded-full flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Patterns reveal Purpose</h3>
                <p className="text-sm text-muted-foreground">
                  Track your moods, sleep, and thoughts. The data tells a story only you can write.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-indigo-500/20 rounded-full flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Growth is not linear</h3>
                <p className="text-sm text-muted-foreground">
                  Bad days are data, not defeats. Zenith helps you find clarity in chaos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
