import React from 'react';

interface SplineSceneProps {
  variant?: 'hero' | 'philosophy' | 'cta';
  className?: string;
}

const SplineScene: React.FC<SplineSceneProps> = ({ variant = 'hero', className = '' }) => {
  if (variant === 'hero') {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {/* Floating orbs */}
        <div className="absolute top-[15%] left-[20%] w-[30rem] h-[30rem] rounded-full bg-primary/20 blur-[120px] animate-float" />
        <div className="absolute top-[50%] right-[10%] w-[25rem] h-[25rem] rounded-full bg-purple-500/15 blur-[100px] animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute bottom-[10%] left-[40%] w-[20rem] h-[20rem] rounded-full bg-indigo-400/15 blur-[80px] animate-float" style={{ animationDelay: '4s', animationDuration: '10s' }} />
        {/* Mesh grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }} />
      </div>
    );
  }

  if (variant === 'philosophy') {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Central glowing orb */}
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/25 via-purple-500/20 to-indigo-500/15 blur-[60px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-primary/15 via-transparent to-purple-400/10 blur-[40px] animate-float" style={{ animationDuration: '6s' }} />
            <div className="absolute inset-16 rounded-full bg-primary/10 blur-[30px] animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }} />
          </div>
        </div>
      </div>
    );
  }

  // CTA variant
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div className="absolute top-[20%] left-[15%] w-96 h-96 rounded-full bg-white/5 blur-[100px] animate-float" />
      <div className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full bg-purple-300/5 blur-[80px] animate-float" style={{ animationDelay: '3s' }} />
    </div>
  );
};

export default SplineScene;
