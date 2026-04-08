
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Wind } from 'lucide-react';
import BreathingCircle from './BreathingCircle';
import BreathingControls from './BreathingControls';
import BreathingSettings from './BreathingSettings';

interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  description: string;
  color: string;
}

const breathingPatterns: BreathingPattern[] = [
  {
    name: "Box Breathing",
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: "Perfect balance for focus and calm",
    color: "#3B82F6"
  },
  {
    name: "4-7-8 Relaxation",
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: "Deep relaxation and stress relief",
    color: "#8B5CF6"
  },
  {
    name: "Energizing Breath",
    inhale: 6,
    hold: 2,
    exhale: 4,
    description: "Boost energy and alertness",
    color: "#10B981"
  },
  {
    name: "Triangle Breathing",
    inhale: 4,
    hold: 0,
    exhale: 4,
    description: "Simple and effective for quick calm",
    color: "#F59E0B"
  },
  {
    name: "Deep Meditation",
    inhale: 6,
    hold: 6,
    exhale: 6,
    description: "Deep meditative breathing",
    color: "#EC4899"
  },
  {
    name: "Quick Reset",
    inhale: 3,
    hold: 3,
    exhale: 3,
    description: "Fast stress relief technique",
    color: "#06B6D4"
  }
];

type Phase = 'prepare' | 'inhale' | 'hold' | 'exhale';

const BreathingExerciseRevamped: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('prepare');
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [isComplete, setIsComplete] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear interval helper
  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Get next phase duration
  const getNextPhase = useCallback((phase: Phase): { nextPhase: Phase; duration: number } => {
    switch (phase) {
      case 'prepare':
        return { nextPhase: 'inhale', duration: selectedPattern.inhale };
      case 'inhale':
        if (selectedPattern.hold > 0) {
          return { nextPhase: 'hold', duration: selectedPattern.hold };
        } else {
          return { nextPhase: 'exhale', duration: selectedPattern.exhale };
        }
      case 'hold':
        return { nextPhase: 'exhale', duration: selectedPattern.exhale };
      case 'exhale':
        return { nextPhase: 'inhale', duration: selectedPattern.inhale };
      default:
        return { nextPhase: 'prepare', duration: 3 };
    }
  }, [selectedPattern]);

  // Main timer effect
  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      clearCurrentInterval();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        console.log(`Phase: ${currentPhase}, Time: ${prev}`);
        
        if (prev <= 1) {
          // Time to transition
          if (currentPhase === 'exhale') {
            const newCycles = cycles + 1;
            setCycles(newCycles);
            
            if (newCycles >= totalCycles) {
              // Exercise complete
              setIsActive(false);
              setCurrentPhase('prepare');
              setIsComplete(true);
              
              setTimeout(() => {
                setIsComplete(false);
                setCycles(0);
              }, 3000);
              
              return 0;
            }
          }
          
          // Move to next phase
          const { nextPhase, duration } = getNextPhase(currentPhase);
          setCurrentPhase(nextPhase);
          return duration;
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearCurrentInterval();
  }, [isActive, timeLeft, currentPhase, cycles, totalCycles, getNextPhase, clearCurrentInterval]);

  const startExercise = () => {
    console.log('Starting exercise');
    setIsActive(true);
    setCurrentPhase('prepare');
    setTimeLeft(3);
    setCycles(0);
    setIsComplete(false);
  };

  const pauseExercise = () => {
    console.log('Pausing exercise');
    setIsActive(false);
    clearCurrentInterval();
  };

  const resetExercise = () => {
    console.log('Resetting exercise');
    setIsActive(false);
    setCurrentPhase('prepare');
    setTimeLeft(0);
    setCycles(0);
    setIsComplete(false);
    clearCurrentInterval();
  };

  const handlePatternChange = (pattern: BreathingPattern) => {
    setSelectedPattern(pattern);
    resetExercise();
  };

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="text-6xl">🎉</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Session Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Great job completing your breathing exercise. You've taken an important step for your wellbeing.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-8">
      {/* Header - compact on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <p className="text-sm text-muted-foreground">
          {selectedPattern.description}
        </p>
      </motion.div>

      {/* Main breathing interface */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10 border border-primary/20">
        <CardContent className="p-4 sm:p-8 flex flex-col items-center justify-center space-y-4 sm:space-y-8 min-h-[320px] sm:min-h-[400px]">
          <BreathingCircle
            phase={currentPhase}
            timeLeft={timeLeft}
            pattern={selectedPattern}
            isActive={isActive}
          />

          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              {selectedPattern.name}
            </div>
          </div>

          <BreathingControls
            isActive={isActive}
            onStart={startExercise}
            onPause={pauseExercise}
            onReset={resetExercise}
            onSettings={() => setShowSettings(!showSettings)}
            cycles={cycles}
            totalCycles={totalCycles}
          />
        </CardContent>
      </Card>

      {/* Settings panel */}
      <BreathingSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        patterns={breathingPatterns}
        selectedPattern={selectedPattern}
        onPatternChange={handlePatternChange}
        totalCycles={totalCycles}
        onCyclesChange={setTotalCycles}
      />
    </div>
  );
};

export default BreathingExerciseRevamped;
