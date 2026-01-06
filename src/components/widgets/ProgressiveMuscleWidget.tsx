import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipForward, Check } from 'lucide-react';

interface ProgressiveMuscleWidgetProps {
  onSkip?: () => void;
  onComplete?: () => void;
}

const muscleGroups = [
  { name: 'Hands', instruction: 'Make tight fists with both hands', duration: 5 },
  { name: 'Arms', instruction: 'Tense your biceps by bending your elbows', duration: 5 },
  { name: 'Shoulders', instruction: 'Raise your shoulders up toward your ears', duration: 5 },
  { name: 'Face', instruction: 'Scrunch up your face, squeezing eyes shut', duration: 5 },
  { name: 'Chest', instruction: 'Take a deep breath and hold it', duration: 5 },
  { name: 'Stomach', instruction: 'Tighten your stomach muscles', duration: 5 },
  { name: 'Legs', instruction: 'Tense your thighs and calves', duration: 5 },
  { name: 'Feet', instruction: 'Curl your toes downward tightly', duration: 5 },
];

const ProgressiveMuscleWidget: React.FC<ProgressiveMuscleWidgetProps> = ({ 
  onSkip,
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<'tense' | 'relax'>('tense');
  const [timeLeft, setTimeLeft] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentGroup = muscleGroups[currentStep];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (phase === 'tense') {
              setPhase('relax');
              return 5;
            } else {
              // Move to next muscle group
              if (currentStep < muscleGroups.length - 1) {
                setCurrentStep(currentStep + 1);
                setPhase('tense');
                return 5;
              } else {
                // Exercise complete
                setIsActive(false);
                setIsComplete(true);
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
  }, [isActive, phase, currentStep, onComplete]);

  const skipToNext = () => {
    if (currentStep < muscleGroups.length - 1) {
      setCurrentStep(currentStep + 1);
      setPhase('tense');
      setTimeLeft(5);
    } else {
      setIsActive(false);
      setIsComplete(true);
      onComplete?.();
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 border-2 border-teal-200 dark:border-teal-800 shadow-lg">
          <CardContent className="p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2">
              Body Relaxed! 🧘
            </h3>
            <p className="text-sm text-teal-700 dark:text-teal-300">
              Great work releasing tension from your body. Notice how relaxed you feel now.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-2 border-teal-200 dark:border-teal-800 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-teal-900 dark:text-teal-100">Progressive Muscle Relaxation</h3>
            <Button variant="ghost" size="icon" onClick={onSkip} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1 mb-6">
            {muscleGroups.map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-1 rounded-full overflow-hidden bg-teal-200 dark:bg-teal-800"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-400 to-cyan-400"
                  initial={{ width: '0%' }}
                  animate={{ width: i < currentStep ? '100%' : i === currentStep ? '50%' : '0%' }}
                />
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStep}-${phase}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              {/* Body part indicator */}
              <motion.div
                className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg ${
                  phase === 'tense' 
                    ? 'bg-gradient-to-br from-orange-400 to-red-400' 
                    : 'bg-gradient-to-br from-teal-400 to-cyan-400'
                }`}
                animate={{ 
                  scale: phase === 'tense' ? [1, 1.1, 1] : [1, 0.95, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="text-center text-white">
                  <div className="text-3xl font-bold">{timeLeft}</div>
                  <div className="text-xs uppercase tracking-wider">
                    {phase === 'tense' ? 'Tense' : 'Relax'}
                  </div>
                </div>
              </motion.div>

              <h4 className="text-xl font-bold text-teal-900 dark:text-teal-100 mb-2">
                {currentGroup.name}
              </h4>
              
              <p className={`text-sm mb-4 ${
                phase === 'tense' 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-teal-600 dark:text-teal-400'
              }`}>
                {phase === 'tense' 
                  ? currentGroup.instruction 
                  : 'Now slowly release and feel the tension melt away...'}
              </p>

              <p className="text-xs text-teal-500 dark:text-teal-400 mb-4">
                Step {currentStep + 1} of {muscleGroups.length}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2">
            <Button
              onClick={() => setIsActive(!isActive)}
              className={`flex-1 ${
                isActive 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-gradient-to-r from-teal-400 to-cyan-400 hover:opacity-90'
              } text-white`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {currentStep === 0 && phase === 'tense' ? 'Start' : 'Resume'}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={skipToNext}
              className="border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-300"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressiveMuscleWidget;
