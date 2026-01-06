import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, Pause, X, Volume2, VolumeX } from 'lucide-react';
import { useSpeechSynthesis, SpeechItem } from '@/hooks/useSpeechSynthesis';

interface BreathingExerciseWidgetProps {
  cycles?: number;
  intensity?: 'light' | 'moderate' | 'deep'; // AI-controlled intensity
  customMessage?: string; // AI custom message
  inhaleDuration?: number;
  holdDuration?: number;
  exhaleDuration?: number;
  onSkip?: () => void;
  onComplete?: () => void;
}

const intensitySettings = {
  light: { inhale: 3, hold: 2, exhale: 3, cycles: 2 },
  moderate: { inhale: 4, hold: 4, exhale: 4, cycles: 3 },
  deep: { inhale: 4, hold: 7, exhale: 8, cycles: 5 },
};

const BreathingExerciseWidget: React.FC<BreathingExerciseWidgetProps> = ({ 
  cycles,
  intensity = 'moderate',
  customMessage,
  inhaleDuration,
  holdDuration,
  exhaleDuration,
  onSkip,
  onComplete 
}) => {
  const settings = intensitySettings[intensity];
  const finalCycles = cycles ?? settings.cycles;
  const phaseDurations = {
    inhale: inhaleDuration ?? settings.inhale,
    hold: holdDuration ?? settings.hold,
    exhale: exhaleDuration ?? settings.exhale,
  };

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(phaseDurations.inhale);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenPhaseRef = useRef<string>('');
  
  const { speak, stop: stopSpeech, isSpeaking, isSupported } = useSpeechSynthesis();

  const getPhaseText = () => {
    if (phase === 'inhale') return 'Breathe In';
    if (phase === 'hold') return 'Hold';
    return 'Breathe Out';
  };

  // TTS guidance
  useEffect(() => {
    if (ttsEnabled && isActive && lastSpokenPhaseRef.current !== phase) {
      lastSpokenPhaseRef.current = phase;
      const text = phase === 'inhale' 
        ? `Breathe in slowly for ${phaseDurations.inhale} seconds`
        : phase === 'hold'
        ? `Hold your breath`
        : `Breathe out slowly for ${phaseDurations.exhale} seconds`;
      speak(text, { rate: 0.8 });
    }
  }, [phase, isActive, ttsEnabled, speak, phaseDurations]);

  useEffect(() => {
    if (isActive && currentCycle < finalCycles) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (phase === 'inhale') {
              setPhase('hold');
              return phaseDurations.hold;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return phaseDurations.exhale;
            } else {
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
  }, [isActive, phase, currentCycle, finalCycles, phaseDurations]);

  useEffect(() => {
    if (currentCycle >= finalCycles && isActive) {
      setIsActive(false);
      if (ttsEnabled) {
        speak('Great job! You completed the breathing exercise. Take a moment to notice how you feel.', { rate: 0.85 });
      }
      onComplete?.();
    }
  }, [currentCycle, finalCycles, isActive, onComplete, ttsEnabled, speak]);

  const handleToggle = () => {
    if (!isActive && ttsEnabled && currentCycle === 0) {
      speak(customMessage || 'Let\'s begin the breathing exercise. Find a comfortable position and relax your shoulders.', { rate: 0.85 });
      setTimeout(() => setIsActive(true), 3000);
    } else {
      setIsActive(!isActive);
    }
  };

  const handleSkip = () => {
    stopSpeech();
    onSkip?.();
  };

  const getCircleScale = () => {
    if (!isActive) return 1;
    if (phase === 'inhale') return 1.5;
    if (phase === 'hold') return 1.5;
    return 1;
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
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Breathing Exercise
              {intensity !== 'moderate' && (
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-800">
                  {intensity}
                </span>
              )}
            </h3>
            <div className="flex gap-1">
              {isSupported && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setTtsEnabled(!ttsEnabled)} 
                  className="h-6 w-6"
                  title={ttsEnabled ? 'Disable voice guidance' : 'Enable voice guidance'}
                >
                  {ttsEnabled ? <Volume2 className="h-4 w-4 text-blue-600" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleSkip} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {customMessage && (
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 italic">
              "{customMessage}"
            </p>
          )}
          
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
                Cycle {currentCycle + 1} of {finalCycles}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {phaseDurations.inhale}s in • {phaseDurations.hold}s hold • {phaseDurations.exhale}s out
              </p>
            </div>

            <Button
              onClick={handleToggle}
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
