import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
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
    name: "Executive Balance",
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: "Perfect equilibrium for focus and composure",
    color: "#3B82F6"
  },
  {
    name: "Serenity Suite",
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: "Deep relaxation for the sophisticated mind",
    color: "#8B5CF6"
  },
  {
    name: "Vitality Protocol",
    inhale: 6,
    hold: 2,
    exhale: 4,
    description: "Energizing breath for peak performance",
    color: "#10B981"
  },
  {
    name: "Harmony Flow",
    inhale: 4,
    hold: 0,
    exhale: 4,
    description: "Effortless calm for immediate clarity",
    color: "#F59E0B"
  },
  {
    name: "Meditation Mastery",
    inhale: 6,
    hold: 6,
    exhale: 6,
    description: "Deep contemplative breathing technique",
    color: "#EC4899"
  },
  {
    name: "Reset Ritual",
    inhale: 3,
    hold: 3,
    exhale: 3,
    description: "Quick restoration for busy lifestyles",
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

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

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

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      clearCurrentInterval();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        console.log(`Phase: ${currentPhase}, Time: ${prev}`);
        
        if (prev <= 1) {
          if (currentPhase === 'exhale') {
            const newCycles = cycles + 1;
            setCycles(newCycles);
            
            if (newCycles >= totalCycles) {
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
          className="text-center space-y-6 p-8 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 rounded-3xl border border-indigo-200/50 dark:border-indigo-700/50 shadow-2xl backdrop-blur-sm"
        >
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Session Complete
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Exquisite work. You have completed your breathing practice with grace and intention.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-indigo-500" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Breathing Studio
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          {selectedPattern.description}
        </p>
      </motion.div>

      {/* Main breathing interface */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-gray-800 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200/50 dark:border-indigo-700/50 shadow-2xl backdrop-blur-sm rounded-3xl">
        <CardContent className="p-12 flex flex-col items-center justify-center space-y-8 min-h-[500px]">
          <BreathingCircle
            phase={currentPhase}
            timeLeft={timeLeft}
            pattern={selectedPattern}
            isActive={isActive}
          />

          <div className="text-center space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase">
              {selectedPattern.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 italic">
              Curated for Excellence
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
