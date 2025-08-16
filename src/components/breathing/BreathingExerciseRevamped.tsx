
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
  instructions: string[];
}

const breathingPatterns: BreathingPattern[] = [
  {
    name: "Box Breathing",
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: "Perfect balance for focus and calm",
    color: "#3B82F6",
    instructions: [
      "Sit comfortably with your back straight",
      "Inhale slowly through your nose for 4 counts",
      "Hold your breath gently for 4 counts",
      "Exhale slowly through your mouth for 4 counts",
      "This creates a 'box' pattern of equal timing"
    ]
  },
  {
    name: "4-7-8 Relaxation",
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: "Deep relaxation and stress relief",
    color: "#8B5CF6",
    instructions: [
      "Place your tongue against the roof of your mouth",
      "Exhale completely through your mouth",
      "Inhale through your nose for 4 counts",
      "Hold your breath for 7 counts",
      "Exhale through your mouth for 8 counts with a 'whoosh' sound"
    ]
  },
  {
    name: "Energizing Breath",
    inhale: 6,
    hold: 2,
    exhale: 4,
    description: "Boost energy and alertness",
    color: "#10B981",
    instructions: [
      "Sit up tall to open your chest",
      "Take a long, deep inhale for 6 counts",
      "Hold briefly for 2 counts to energize",
      "Exhale with control for 4 counts",
      "Feel the revitalizing oxygen flowing through your body"
    ]
  },
  {
    name: "Triangle Breathing",
    inhale: 4,
    hold: 0,
    exhale: 4,
    description: "Simple and effective for quick calm",
    color: "#F59E0B",
    instructions: [
      "This is perfect for beginners",
      "Breathe in slowly for 4 counts",
      "Breathe out slowly for 4 counts",
      "No holding - just smooth, even breathing",
      "Focus on the rhythm and flow"
    ]
  },
  {
    name: "Deep Meditation",
    inhale: 6,
    hold: 6,
    exhale: 6,
    description: "Deep meditative breathing",
    color: "#EC4899",
    instructions: [
      "Find a quiet, comfortable position",
      "Breathe deeply into your belly for 6 counts",
      "Hold the breath mindfully for 6 counts",
      "Release slowly and completely for 6 counts",
      "Let each breath deepen your meditative state"
    ]
  },
  {
    name: "Quick Reset",
    inhale: 3,
    hold: 3,
    exhale: 3,
    description: "Fast stress relief technique",
    color: "#06B6D4",
    instructions: [
      "Perfect for busy moments",
      "Quick inhale for 3 counts",
      "Brief hold for 3 counts",
      "Quick exhale for 3 counts",
      "Rapid stress relief in under a minute"
    ]
  },
  {
    name: "Anxiety Relief",
    inhale: 4,
    hold: 4,
    exhale: 6,
    description: "Longer exhale to calm anxiety",
    color: "#8B5CF6",
    instructions: [
      "Breathe in gently for 4 counts",
      "Hold peacefully for 4 counts",
      "Exhale slowly for 6 counts to activate calm",
      "The longer exhale triggers your relaxation response",
      "Feel anxiety melting away with each breath"
    ]
  },
  {
    name: "Power Breathing",
    inhale: 8,
    hold: 4,
    exhale: 8,
    description: "Build inner strength and confidence",
    color: "#EF4444",
    instructions: [
      "Stand or sit with confidence",
      "Take a powerful inhale for 8 counts",
      "Hold with strength for 4 counts",
      "Exhale with control for 8 counts",
      "Feel your inner power growing with each cycle"
    ]
  },
  {
    name: "Sleep Preparation",
    inhale: 3,
    hold: 5,
    exhale: 7,
    description: "Prepare your body for restful sleep",
    color: "#6366F1",
    instructions: [
      "Lie down comfortably in bed",
      "Gentle inhale for 3 counts",
      "Hold softly for 5 counts",
      "Long, releasing exhale for 7 counts",
      "Let each breath guide you toward peaceful sleep"
    ]
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
    setIsActive(true);
    setCurrentPhase('prepare');
    setTimeLeft(3);
    setCycles(0);
    setIsComplete(false);
  };

  const pauseExercise = () => {
    setIsActive(false);
    clearCurrentInterval();
  };

  const resetExercise = () => {
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
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Wind className="h-8 w-8 text-blue-500" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Breathing Exercise
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {selectedPattern.description}
        </p>
      </motion.div>

      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200/50 dark:border-blue-700/50">
        <CardContent className="p-8 flex flex-col items-center justify-center space-y-8 min-h-[400px]">
          <BreathingCircle
            phase={currentPhase}
            timeLeft={timeLeft}
            pattern={selectedPattern}
            isActive={isActive}
          />

          <div className="text-center space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
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

      <BreathingSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        patterns={breathingPatterns}
        selectedPattern={selectedPattern}
        onPatternChange={handlePatternChange}
        totalCycles={totalCycles}
        onCyclesChange={setTotalCycles}
      />

      {/* Instructions Card */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">How to Practice {selectedPattern.name}</h3>
          <ul className="space-y-2">
            {selectedPattern.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingExerciseRevamped;
