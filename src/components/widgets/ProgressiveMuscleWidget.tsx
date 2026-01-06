import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipForward, Check, Volume2, VolumeX } from 'lucide-react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface ProgressiveMuscleWidgetProps {
  intensity?: 'quick' | 'standard' | 'thorough';
  customIntro?: string;
  onSkip?: () => void;
  onComplete?: () => void;
}

const muscleGroupsByIntensity = {
  quick: [
    { name: 'Hands', instruction: 'Make tight fists with both hands', duration: 5 },
    { name: 'Shoulders', instruction: 'Raise shoulders up to your ears', duration: 5 },
    { name: 'Face', instruction: 'Scrunch up your entire face', duration: 5 },
  ],
  standard: [
    { name: 'Hands', instruction: 'Make tight fists with both hands', duration: 5 },
    { name: 'Arms', instruction: 'Tense your biceps by bending your elbows', duration: 5 },
    { name: 'Shoulders', instruction: 'Raise your shoulders up toward your ears', duration: 5 },
    { name: 'Face', instruction: 'Scrunch up your face, squeezing eyes shut', duration: 5 },
    { name: 'Stomach', instruction: 'Tighten your stomach muscles', duration: 5 },
    { name: 'Legs', instruction: 'Tense your thighs and calves', duration: 5 },
  ],
  thorough: [
    { name: 'Hands', instruction: 'Make tight fists with both hands', duration: 7 },
    { name: 'Forearms', instruction: 'Extend fingers and bend wrists back', duration: 7 },
    { name: 'Biceps', instruction: 'Bend elbows and make a muscle', duration: 7 },
    { name: 'Shoulders', instruction: 'Raise shoulders up to your ears', duration: 7 },
    { name: 'Forehead', instruction: 'Raise eyebrows as high as possible', duration: 7 },
    { name: 'Eyes', instruction: 'Squeeze your eyes shut tightly', duration: 7 },
    { name: 'Jaw', instruction: 'Clench jaw and press tongue to roof', duration: 7 },
    { name: 'Chest', instruction: 'Take a deep breath and hold it', duration: 7 },
    { name: 'Stomach', instruction: 'Tighten your stomach muscles', duration: 7 },
    { name: 'Thighs', instruction: 'Squeeze thighs together tightly', duration: 7 },
    { name: 'Calves', instruction: 'Point toes up toward shins', duration: 7 },
    { name: 'Feet', instruction: 'Curl your toes tightly', duration: 7 },
  ],
};

const ProgressiveMuscleWidget: React.FC<ProgressiveMuscleWidgetProps> = ({ 
  intensity = 'standard',
  customIntro,
  onSkip,
  onComplete 
}) => {
  const muscleGroups = muscleGroupsByIntensity[intensity];
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<'tense' | 'relax'>('tense');
  const [timeLeft, setTimeLeft] = useState(muscleGroups[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { speak, stop: stopSpeech, isSupported } = useSpeechSynthesis();

  const currentGroup = muscleGroups[currentStep];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (phase === 'tense') {
              setPhase('relax');
              if (ttsEnabled) speak('Release... let all the tension melt away', { rate: 0.75 });
              return 5;
            } else {
              if (currentStep < muscleGroups.length - 1) {
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                setPhase('tense');
                if (ttsEnabled) {
                  setTimeout(() => speak(`Now, ${muscleGroups[nextStep].name}. ${muscleGroups[nextStep].instruction}`, { rate: 0.8 }), 500);
                }
                return muscleGroups[nextStep].duration;
              } else {
                setIsActive(false);
                setIsComplete(true);
                if (ttsEnabled) speak('Wonderful. Notice how relaxed your body feels now.', { rate: 0.8 });
                onComplete?.();
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, phase, currentStep, muscleGroups, onComplete, ttsEnabled, speak]);

  const startExercise = () => {
    if (ttsEnabled && currentStep === 0 && phase === 'tense') {
      speak(customIntro || 'Let\'s begin progressive muscle relaxation. Find a comfortable position.', { rate: 0.8 });
      setTimeout(() => {
        speak(`First, ${currentGroup.name}. ${currentGroup.instruction}`, { rate: 0.8 });
        setIsActive(true);
      }, 4000);
    } else {
      setIsActive(true);
    }
  };

  const skipToNext = () => {
    if (currentStep < muscleGroups.length - 1) {
      setCurrentStep(currentStep + 1);
      setPhase('tense');
      setTimeLeft(muscleGroups[currentStep + 1].duration);
    } else {
      setIsActive(false);
      setIsComplete(true);
      onComplete?.();
    }
  };

  const handleSkip = () => {
    stopSpeech();
    onSkip?.();
  };

  if (isComplete) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 border-2 border-teal-200 dark:border-teal-800 shadow-lg">
          <CardContent className="p-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">Body Relaxed!</h3>
            <p className="text-sm text-teal-700 dark:text-teal-300">Great work releasing tension from your body.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }}>
      <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-2 border-teal-200 dark:border-teal-800 shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-teal-900 dark:text-teal-100">
              Progressive Muscle Relaxation
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-teal-200 dark:bg-teal-800">{intensity}</span>
            </h3>
            <div className="flex gap-1">
              {isSupported && (
                <Button variant="ghost" size="icon" onClick={() => setTtsEnabled(!ttsEnabled)} className="h-6 w-6">
                  {ttsEnabled ? <Volume2 className="h-4 w-4 text-teal-600" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={handleSkip} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {customIntro && <p className="text-sm text-teal-700 dark:text-teal-300 mb-4 italic">"{customIntro}"</p>}

          <div className="flex gap-1 mb-6">
            {muscleGroups.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-teal-200 dark:bg-teal-800">
                <div className={`h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all ${i < currentStep ? 'w-full' : i === currentStep ? 'w-1/2' : 'w-0'}`} />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`${currentStep}-${phase}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <motion.div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg ${phase === 'tense' ? 'bg-gradient-to-br from-orange-400 to-red-400' : 'bg-gradient-to-br from-teal-400 to-cyan-400'}`} animate={{ scale: phase === 'tense' ? [1, 1.1, 1] : [1, 0.95, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">{timeLeft}</div>
                  <div className="text-xs uppercase">{phase}</div>
                </div>
              </motion.div>
              <h4 className="text-xl font-bold text-teal-900 dark:text-teal-100 mb-2">{currentGroup.name}</h4>
              <p className={`text-sm mb-4 ${phase === 'tense' ? 'text-orange-600 dark:text-orange-400' : 'text-teal-600 dark:text-teal-400'}`}>
                {phase === 'tense' ? currentGroup.instruction : 'Release and feel the tension melt away...'}
              </p>
              <p className="text-xs text-teal-500 mb-4">Step {currentStep + 1} of {muscleGroups.length}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2">
            <Button onClick={isActive ? () => setIsActive(false) : startExercise} className={`flex-1 ${isActive ? 'bg-gray-500' : 'bg-gradient-to-r from-teal-400 to-cyan-400'} text-white`}>
              {isActive ? <><Pause className="w-4 h-4 mr-2" />Pause</> : <><Play className="w-4 h-4 mr-2" />{currentStep === 0 ? 'Start' : 'Resume'}</>}
            </Button>
            <Button variant="outline" onClick={skipToNext} className="border-teal-300 text-teal-700">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressiveMuscleWidget;
