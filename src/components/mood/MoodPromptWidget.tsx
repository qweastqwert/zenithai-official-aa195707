
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, X, ArrowLeft, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
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

// Animation variants for smoother, more refined transitions
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const }
  })
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
  }
};

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
  const [direction, setDirection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleMoodSelect = (mood: string) => {
    onMoodSelect(mood);
    setDirection(1);
    setTimeout(() => setStep('reason'), 200);
  };

  const handleReasonSubmit = (reason: string) => {
    onSubmit(reason);
  };

  const handleSkipReason = () => {
    onSubmit();
  };

  const handleBack = () => {
    setDirection(-1);
    setStep('select');
    onMoodSelect('');
  };

  // Mobile: Bottom sheet style with refined animations
  if (isMobile) {
    return (
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : "100%", 
          opacity: isVisible ? 1 : 0 
        }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ 
          type: "spring", 
          damping: 30, 
          stiffness: 300,
          mass: 0.8
        }}
        className="fixed bottom-[72px] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[420px] max-h-[65vh] overflow-y-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
      <Card className="bg-background/98 backdrop-blur-xl border border-border/50 shadow-xl rounded-xl overflow-hidden">
          <motion.div
            initial={false}
            animate={isMinimized ? { height: "auto" } : { height: "auto" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {isMinimized ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div variants={pulseVariants} animate="pulse">
                      <Heart className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span className="text-sm font-medium text-foreground">How are you feeling?</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsMinimized(false)} className="h-8 w-8 p-0">
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            ) : (
              <>
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <AnimatePresence mode="wait">
                        {step === 'reason' && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                          >
                            <Button variant="ghost" size="sm" onClick={handleBack} className="h-7 w-7 p-0 flex-shrink-0">
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <motion.div
                        className="flex-shrink-0"
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <Heart className="h-5 w-5 text-primary" />
                      </motion.div>
                      <CardTitle className="text-sm font-semibold text-foreground truncate">
                        {step === 'select' ? 'How are you feeling?' : 'Tell us more'}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-7 w-7 p-0">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-3 pb-3 pt-1">
                  <AnimatePresence mode="wait" custom={direction}>
                    {step === 'select' ? (
                      <motion.div
                        key="select"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <MoodSelection selectedMood={selectedMood} onMoodSelect={handleMoodSelect} compact />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="reason"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <MoodReasonInput 
                          selectedMood={selectedMood}
                          onSubmit={handleReasonSubmit}
                          onSkip={handleSkipReason}
                          compact
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </>
            )}
          </motion.div>
        </Card>
      </motion.div>
    );
  }

  // Tablet/Desktop: Side widget with refined animations
  return (
    <motion.div
      initial={{ x: 100, opacity: 0, scale: 0.9 }}
      animate={{ 
        x: isVisible ? 0 : 100, 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.9
      }}
      exit={{ x: 100, opacity: 0, scale: 0.9 }}
      transition={{ 
        type: "spring", 
        damping: 25, 
        stiffness: 250,
        mass: 0.8
      }}
      className={`fixed z-40 ${isTablet ? 'right-3 top-1/2 -translate-y-1/2 w-72' : 'right-4 top-1/2 -translate-y-1/2 w-80'}`}
    >
      <Card className="bg-background/98 backdrop-blur-xl border-2 border-primary/20 shadow-2xl rounded-2xl overflow-hidden">
        <motion.div
          initial={false}
          animate={isMinimized ? { height: "auto" } : { height: "auto" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {isMinimized ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div variants={pulseVariants} animate="pulse">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium text-foreground">Mood Check-in</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setIsMinimized(false)} className="h-7 w-7 p-0 hover:bg-primary/10">
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 hover:bg-destructive/10">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          ) : (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AnimatePresence mode="wait">
                      {step === 'reason' && (
                        <motion.div
                          initial={{ opacity: 0, x: -10, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -10, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button variant="ghost" size="sm" onClick={handleBack} className="h-7 w-7 p-0 hover:bg-primary/10">
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.div
                      animate={{ 
                        rotate: [0, 8, -8, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Heart className="h-5 w-5 text-primary" />
                    </motion.div>
                    <CardTitle className="text-lg text-foreground">
                      {step === 'select' ? 'How are you feeling?' : 'Tell us more'}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-7 w-7 p-0 hover:bg-primary/10">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 hover:bg-destructive/10">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <motion.p 
                  key={step}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-muted-foreground mt-1"
                >
                  {step === 'select' 
                    ? 'Take a moment to check in' 
                    : 'Help us understand better'
                  }
                </motion.p>
              </CardHeader>
              <CardContent className="space-y-4">
                <AnimatePresence mode="wait" custom={direction}>
                  {step === 'select' ? (
                    <motion.div
                      key="select"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <MoodSelection selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="reason"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
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
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default MoodPromptWidget;
