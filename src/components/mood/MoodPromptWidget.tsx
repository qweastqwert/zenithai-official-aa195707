
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import MoodSelection from './MoodSelection';
import MoodReasonInput from './MoodReasonInput';

interface MoodPromptWidgetProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  onSubmit: (reason?: string) => void;
  onClose: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
}

const MoodPromptWidget: React.FC<MoodPromptWidgetProps> = ({ 
  selectedMood, 
  onMoodSelect, 
  onSubmit, 
  onClose,
  isMobile = false,
  isTablet = false
}) => {
  const [step, setStep] = useState<'select' | 'reason'>('select');
  const [isMinimized, setIsMinimized] = useState(false);

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

  // Mobile: Bottom sheet style
  if (isMobile) {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-20 left-2 right-2 z-40"
      >
        <Card className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-xl border-2 border-purple-200/50 dark:border-purple-700/50 shadow-2xl rounded-2xl">
          {isMinimized ? (
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" style={{ color: 'var(--zenith-primary)' }} />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">How are you feeling?</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setIsMinimized(false)}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader className="pb-2 pt-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {step === 'reason' && (
                      <Button variant="ghost" size="sm" onClick={handleBack} className="h-7 w-7 p-0">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <Heart className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
                    <CardTitle className="text-base text-gray-900 dark:text-gray-100">
                      {step === 'select' ? 'How are you feeling?' : 'Tell us more'}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-7 w-7 p-0">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-2">
                <AnimatePresence mode="wait">
                  {step === 'select' ? (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MoodSelection selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="reason"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
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
            </>
          )}
        </Card>
      </motion.div>
    );
  }

  // Tablet/Desktop: Side widget
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 w-80"
    >
      <Card className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-xl border-2 border-purple-200/50 dark:border-purple-700/50 shadow-2xl rounded-2xl">
        {isMinimized ? (
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" style={{ color: 'var(--zenith-primary)' }} />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Mood Check-in</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(false)}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        ) : (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {step === 'reason' && (
                    <Button variant="ghost" size="sm" onClick={handleBack} className="h-7 w-7 p-0">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Heart className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
                  </motion.div>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                    {step === 'select' ? 'How are you feeling?' : 'Tell us more'}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-7 w-7 p-0">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {step === 'select' 
                  ? 'Take a moment to check in' 
                  : 'Help us understand better'
                }
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {step === 'select' ? (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MoodSelection selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="reason"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
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
          </>
        )}
      </Card>
    </motion.div>
  );
};

export default MoodPromptWidget;
