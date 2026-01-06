import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Hand, Ear, Wind, Heart, ChevronRight, Check } from 'lucide-react';

interface GroundingExerciseWidgetProps {
  onSkip?: () => void;
  onComplete?: () => void;
}

const steps = [
  { sense: 'See', icon: Eye, count: 5, prompt: 'things you can see', color: 'from-blue-400 to-cyan-400' },
  { sense: 'Touch', icon: Hand, count: 4, prompt: 'things you can feel', color: 'from-green-400 to-emerald-400' },
  { sense: 'Hear', icon: Ear, count: 3, prompt: 'things you can hear', color: 'from-yellow-400 to-orange-400' },
  { sense: 'Smell', icon: Wind, count: 2, prompt: 'things you can smell', color: 'from-pink-400 to-rose-400' },
  { sense: 'Taste', icon: Heart, count: 1, prompt: 'thing you can taste', color: 'from-purple-400 to-violet-400' },
];

const GroundingExerciseWidget: React.FC<GroundingExerciseWidgetProps> = ({ 
  onSkip,
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [inputs, setInputs] = useState<string[][]>(steps.map(s => Array(s.count).fill('')));

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  };

  const handleInputChange = (itemIndex: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[currentStep][itemIndex] = value;
    setInputs(newInputs);
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-200 dark:border-green-800 shadow-lg">
          <CardContent className="p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              You're Grounded! 🌿
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Great job connecting with your senses. You're present in this moment.
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
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">5-4-3-2-1 Grounding</h3>
            <Button variant="ghost" size="icon" onClick={onSkip} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < currentStep ? 'bg-indigo-500' : 
                  i === currentStep ? 'bg-indigo-400' : 'bg-indigo-200 dark:bg-indigo-700'
                }`}
                animate={{ scale: i === currentStep ? 1.3 : 1 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                animate={{ 
                  boxShadow: ['0 0 20px rgba(99, 102, 241, 0.3)', '0 0 40px rgba(99, 102, 241, 0.5)', '0 0 20px rgba(99, 102, 241, 0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>

              <h4 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
                {step.count} {step.prompt}
              </h4>
              <p className="text-sm text-indigo-600 dark:text-indigo-300 mb-4">
                Take a moment to notice {step.count} {step.prompt} around you
              </p>

              <div className="space-y-2 mb-4">
                {Array(step.count).fill(null).map((_, i) => (
                  <motion.input
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    type="text"
                    placeholder={`${i + 1}. What do you ${step.sense.toLowerCase()}?`}
                    value={inputs[currentStep][i]}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-indigo-200 dark:border-indigo-700 bg-white/50 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-100 placeholder:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className={`w-full bg-gradient-to-r ${step.color} text-white hover:opacity-90`}
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  'Complete'
                )}
              </Button>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GroundingExerciseWidget;
