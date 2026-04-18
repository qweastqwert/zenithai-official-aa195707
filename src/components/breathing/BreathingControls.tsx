
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface BreathingControlsProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSettings: () => void;
  cycles: number;
  totalCycles: number;
}

const BreathingControls: React.FC<BreathingControlsProps> = ({
  isActive,
  onStart,
  onPause,
  onReset,
  onSettings,
  cycles,
  totalCycles
}) => {
  const progress = totalCycles > 0 ? (cycles / totalCycles) * 100 : 0;
  return (
    <div className="space-y-5 w-full">
      {/* Progress info */}
      <div className="text-center w-full max-w-xs mx-auto">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Cycle <span className="font-semibold text-foreground">{cycles}</span> of {totalCycles}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="relative w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          {isActive && progress > 0 && (
            <div
              className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_linear_infinite]"
              style={{ left: `${Math.max(0, progress - 8)}%` }}
            />
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={isActive ? onPause : onStart}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2 fill-current" />}
          {isActive ? 'Pause' : 'Begin'}
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          size="icon"
          className="rounded-full hover:rotate-180 transition-transform duration-500"
          aria-label="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          onClick={onSettings}
          variant="outline"
          size="icon"
          className="rounded-full hover:rotate-90 transition-transform duration-300"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BreathingControls;
