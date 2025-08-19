
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
  return (
    <div className="space-y-6">
      {/* Progress info */}
      <div className="text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Cycle {cycles} of {totalCycles}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(cycles / totalCycles) * 100}%` }}
          />
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={isActive ? onPause : onStart}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
          {isActive ? 'Pause' : 'Begin'}
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
          className="border-gray-300 dark:border-gray-600 px-6 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        
        <Button
          onClick={onSettings}
          variant="outline"
          size="icon"
          className="rounded-full border-gray-300 dark:border-gray-600"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BreathingControls;
