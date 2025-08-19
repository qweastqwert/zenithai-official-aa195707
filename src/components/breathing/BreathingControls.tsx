
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
    <div className="space-y-8">
      {/* Progress info */}
      <div className="text-center space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
          Session Progress: {cycles} of {totalCycles}
        </div>
        <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${(cycles / totalCycles) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
          {cycles === totalCycles ? "Session Complete" : "In Progress"}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-6">
        <Button
          onClick={isActive ? onPause : onStart}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-medium border border-white/20"
        >
          {isActive ? <Pause className="h-6 w-6 mr-3" /> : <Play className="h-6 w-6 mr-3" />}
          {isActive ? 'Pause' : 'Begin Session'}
        </Button>
        
        <Button
          onClick={onReset}
          variant="outline"
          className="border-2 border-gray-300 dark:border-gray-600 px-8 py-4 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset
        </Button>
        
        <Button
          onClick={onSettings}
          variant="outline"
          size="icon"
          className="rounded-full border-2 border-gray-300 dark:border-gray-600 w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BreathingControls;
