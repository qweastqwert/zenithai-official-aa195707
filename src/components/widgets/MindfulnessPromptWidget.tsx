import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { X, Sparkles, RefreshCw, Heart } from 'lucide-react';

interface MindfulnessPromptWidgetProps {
  prompt?: string;
  onSkip?: () => void;
  onComplete?: () => void;
}

const defaultPrompts = [
  "Notice your breath right now. Is it shallow or deep? Fast or slow? Just observe without changing it.",
  "What emotion are you feeling in this exact moment? Where do you feel it in your body?",
  "Look around you. Find something beautiful that you hadn't noticed before.",
  "Think of one thing you're grateful for right now, no matter how small.",
  "How does your body feel sitting or standing where you are? Notice any tension.",
  "What sounds can you hear right now? Near and far, loud and quiet.",
  "Picture someone you love. Send them a silent wish for happiness.",
  "What would you tell your younger self right now?",
  "Name three things that made you smile today, even briefly.",
  "What's one kind thing you can do for yourself today?",
];

const MindfulnessPromptWidget: React.FC<MindfulnessPromptWidgetProps> = ({ 
  prompt: initialPrompt,
  onSkip,
  onComplete 
}) => {
  const [currentPrompt, setCurrentPrompt] = useState(initialPrompt || defaultPrompts[0]);
  const [reflection, setReflection] = useState('');
  const [isReflecting, setIsReflecting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!initialPrompt) {
      const randomIndex = Math.floor(Math.random() * defaultPrompts.length);
      setCurrentPrompt(defaultPrompts[randomIndex]);
    }
  }, [initialPrompt]);

  const shufflePrompt = () => {
    const filtered = defaultPrompts.filter(p => p !== currentPrompt);
    const randomIndex = Math.floor(Math.random() * filtered.length);
    setCurrentPrompt(filtered[randomIndex]);
    setReflection('');
    setIsReflecting(false);
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
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
          <CardContent className="p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
              Moment of Mindfulness ✨
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Thank you for taking this moment to be present with yourself.
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
      <Card className="bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950 dark:to-rose-950 border-2 border-amber-200 dark:border-amber-800 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">Mindfulness Moment</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onSkip} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <motion.div
            key={currentPrompt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-rose-100/50 dark:from-amber-900/30 dark:to-rose-900/30 rounded-xl" />
            
            <div className="relative p-6 text-center">
              <motion.p 
                className="text-lg font-medium text-amber-900 dark:text-amber-100 leading-relaxed italic"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                "{currentPrompt}"
              </motion.p>
            </div>
          </motion.div>

          <div className="mt-4 space-y-3">
            {!isReflecting ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={shufflePrompt}
                  className="flex-1 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Prompt
                </Button>
                <Button
                  onClick={() => setIsReflecting(true)}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-rose-400 text-white hover:opacity-90"
                >
                  Reflect
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="w-full p-3 text-sm rounded-lg border border-amber-200 dark:border-amber-700 bg-white/50 dark:bg-amber-900/50 text-amber-900 dark:text-amber-100 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  rows={3}
                />
                <Button
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-amber-400 to-rose-400 text-white hover:opacity-90"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Complete Reflection
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MindfulnessPromptWidget;
