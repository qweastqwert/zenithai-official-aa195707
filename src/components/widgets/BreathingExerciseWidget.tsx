import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';

interface BreathingExerciseWidgetProps {
  cycles?: number;
  onSkip?: () => void;
  onComplete?: () => void;
}

const BreathingExerciseWidget: React.FC<BreathingExerciseWidgetProps> = ({ 
  cycles = 3,
  onSkip,
  onComplete 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [currentCycle, setCurrentCycle] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 4
  };

  useEffect(() => {
    if (isActive && currentCycle < cycles) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            if (phase === 'inhale') {
              setPhase('hold');
              return phaseDurations.hold;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return phaseDurations.exhale;
            } else {
              // Complete cycle
              setCurrentCycle((c) => c + 1);
              setPhase('inhale');
              return phaseDurations.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, phase, currentCycle, cycles]);

  useEffect(() => {
    if (currentCycle >= cycles && isActive) {
      setIsActive(false);
      onComplete?.();
    }
  }, [currentCycle, cycles, isActive, onComplete]);

  const getCircleScale = () => {
    if (!isActive) return 1;
    if (phase === 'inhale') return 1.5;
    if (phase === 'hold') return 1.5;
    return 1;
  };

  const getPhaseText = () => {
    if (phase === 'inhale') return 'Breathe In';
    if (phase === 'hold') return 'Hold';
    return 'Breathe Out';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Breathing Exercise</h3>
            <Button variant="ghost" size="icon" onClick={onSkip} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <motion.div
              animate={{ scale: getCircleScale() }}
              transition={{ duration: phaseDurations[phase], ease: "easeInOut" }}
              className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 dark:from-blue-600 dark:to-purple-600 flex items-center justify-center shadow-2xl"
            >
              <div className="text-center text-white">
                <div className="text-3xl font-bold">{timeLeft}</div>
                <div className="text-xs">{getPhaseText()}</div>
              </div>
            </motion.div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Cycle {currentCycle + 1} of {cycles}
              </p>
            </div>

            <Button
              onClick={() => setIsActive(!isActive)}
              className="w-full"
              variant={isActive ? "secondary" : "default"}
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {currentCycle === 0 ? 'Start' : 'Resume'}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BreathingExerciseWidget;
