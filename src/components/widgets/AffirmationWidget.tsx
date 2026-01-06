import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface AffirmationWidgetProps {
  category?: 'self-love' | 'anxiety' | 'motivation' | 'general';
  onSkip?: () => void;
  onComplete?: () => void;
}

const affirmations = {
  'self-love': [
    "I am worthy of love and respect.",
    "I accept myself completely as I am.",
    "I am enough, just as I am.",
    "I deserve happiness and peace.",
    "I am proud of who I am becoming.",
  ],
  'anxiety': [
    "This feeling is temporary and will pass.",
    "I am safe in this moment.",
    "I have survived difficult moments before.",
    "I can handle whatever comes my way.",
    "I choose peace over worry.",
  ],
  'motivation': [
    "I have the power to create change.",
    "Every step forward is progress.",
    "I am capable of achieving my goals.",
    "My potential is limitless.",
    "Today I choose to be my best self.",
  ],
  'general': [
    "I am grateful for this moment.",
    "I radiate positivity and attract goodness.",
    "I trust the journey of my life.",
    "I am open to new possibilities.",
    "My mind is calm and at peace.",
  ],
};

const categoryColors = {
  'self-love': 'from-pink-400 to-rose-500',
  'anxiety': 'from-blue-400 to-cyan-500',
  'motivation': 'from-orange-400 to-amber-500',
  'general': 'from-purple-400 to-violet-500',
};

const categoryBg = {
  'self-love': 'from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950',
  'anxiety': 'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950',
  'motivation': 'from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950',
  'general': 'from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950',
};

const AffirmationWidget: React.FC<AffirmationWidgetProps> = ({ 
  category = 'general',
  onSkip,
  onComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedAffirmations, setSavedAffirmations] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentAffirmations = affirmations[category];
  const currentAffirmation = currentAffirmations[currentIndex];

  const nextAffirmation = () => {
    if (currentIndex < currentAffirmations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevAffirmation = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleSave = () => {
    if (savedAffirmations.includes(currentAffirmation)) {
      setSavedAffirmations(savedAffirmations.filter(a => a !== currentAffirmation));
    } else {
      setSavedAffirmations([...savedAffirmations, currentAffirmation]);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    onComplete?.();
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className={`bg-gradient-to-br ${categoryBg[category]} border-2 border-purple-200 dark:border-purple-800 shadow-lg`}>
          <CardContent className="p-6 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${categoryColors[category]} flex items-center justify-center`}
            >
              <Star className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
              You're Amazing! 💜
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
              {savedAffirmations.length > 0 
                ? `You saved ${savedAffirmations.length} affirmation${savedAffirmations.length > 1 ? 's' : ''} to remember.`
                : 'Keep these positive thoughts with you today.'
              }
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
      <Card className={`bg-gradient-to-br ${categoryBg[category]} border-2 border-purple-200 dark:border-purple-800 shadow-lg overflow-hidden`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 capitalize">
                {category.replace('-', ' ')} Affirmations
              </h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onSkip} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Affirmation card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <motion.div 
                className={`relative p-8 rounded-xl bg-gradient-to-br ${categoryColors[category]} text-white text-center shadow-xl`}
                animate={{ 
                  boxShadow: ['0 10px 40px rgba(139, 92, 246, 0.3)', '0 10px 60px rgba(139, 92, 246, 0.5)', '0 10px 40px rgba(139, 92, 246, 0.3)']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* Decorative elements */}
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 opacity-50" />
                </motion.div>
                
                <p className="text-xl font-medium leading-relaxed">
                  {currentAffirmation}
                </p>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSave}
                  className="absolute bottom-2 right-2 text-white hover:bg-white/20"
                >
                  <Heart 
                    className={`w-5 h-5 ${savedAffirmations.includes(currentAffirmation) ? 'fill-current' : ''}`} 
                  />
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevAffirmation}
              disabled={currentIndex === 0}
              className="text-purple-600 dark:text-purple-400 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex gap-1">
              {currentAffirmations.map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentIndex 
                      ? `bg-gradient-to-r ${categoryColors[category]}` 
                      : 'bg-purple-200 dark:bg-purple-700'
                  }`}
                  animate={{ scale: i === currentIndex ? 1.3 : 1 }}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextAffirmation}
              disabled={currentIndex === currentAffirmations.length - 1}
              className="text-purple-600 dark:text-purple-400 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <Button
            onClick={handleComplete}
            className={`w-full mt-4 bg-gradient-to-r ${categoryColors[category]} text-white hover:opacity-90`}
          >
            I Feel Better
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AffirmationWidget;
