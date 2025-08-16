
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, ArrowLeft } from 'lucide-react';
import MoodSelection from './MoodSelection';
import MoodReasonInput from './MoodReasonInput';

interface MoodPromptProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  onSubmit: (reason?: string) => void;
  onClose: () => void;
  isMobile?: boolean;
}

const MoodPrompt: React.FC<MoodPromptProps> = ({ 
  selectedMood, 
  onMoodSelect, 
  onSubmit, 
  onClose,
  isMobile = false 
}) => {
  const [step, setStep] = useState<'select' | 'reason'>('select');

  const handleMoodSelect = (mood: string) => {
    onMoodSelect(mood);
    setTimeout(() => setStep('reason'), 300);
  };

  const handleReasonSubmit = (reason: string) => {
    onSubmit(reason);
  };

  const handleSkipReason = () => {
    onSubmit();
  };

  const handleBack = () => {
    setStep('select');
    onMoodSelect('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}
      >
        <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-2 border-purple-200/50 dark:border-purple-700/50 shadow-2xl">
          <CardHeader className="text-center pb-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {step === 'reason' && (
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Heart className="h-6 w-6" style={{ color: 'var(--zenith-primary)' }} />
                </motion.div>
                <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-900 dark:text-gray-100`}>
                  {step === 'select' ? 'How are you feeling?' : 'Tell us more'}
                </CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <motion.p 
              className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 dark:text-gray-400 mt-2`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {step === 'select' 
                ? 'Take a moment to check in with yourself' 
                : 'Help us understand your current state'
              }
            </motion.p>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 'select' ? (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MoodSelection selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
                </motion.div>
              ) : (
                <motion.div
                  key="reason"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MoodReasonInput 
                    selectedMood={selectedMood}
                    onSubmit={handleReasonSubmit}
                    onSkip={handleSkipReason}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MoodPrompt;
