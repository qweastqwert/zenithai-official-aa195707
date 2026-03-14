import React, { Suspense, lazy, useState } from 'react';
import { Loader2 } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  fallback?: React.ReactNode;
}

const SplineScene: React.FC<SplineSceneProps> = ({ scene, className = '', fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return fallback || (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-primary/5 rounded-3xl flex items-center justify-center backdrop-blur-xl">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-purple-500 to-primary/60 animate-pulse opacity-60" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
            <span className="text-sm text-muted-foreground font-medium">Loading 3D scene...</span>
          </div>
        </div>
      )}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
        </div>
      }>
        <Spline
          scene={scene}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>
    </div>
  );
};

export default SplineScene;
