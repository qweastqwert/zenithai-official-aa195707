
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCw, Sparkles } from 'lucide-react';

interface JournalPromptsProps {
  onUsePrompt: (prompt: string) => void;
}

const JournalPrompts: React.FC<JournalPromptsProps> = ({ onUsePrompt }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const prompts = [
    "What are three things that brought you joy today, no matter how small?",
    "Describe a challenge you faced recently and how you overcame it.",
    "What would you tell your past self from a year ago?",
    "Write about a person who has positively impacted your life.",
    "What are you most grateful for right now?",
    "Describe your ideal day. What would it look like from start to finish?",
    "What's a skill or hobby you'd like to develop, and why?",
    "Write about a moment when you felt truly proud of yourself.",
    "What does self-care mean to you, and how do you practice it?",
    "Describe a place that makes you feel peaceful and explain why.",
    "What fears have you overcome, and what did you learn from the experience?",
    "Write about your hopes and dreams for the future.",
    "What advice would you give to someone going through a difficult time?",
    "Describe a random act of kindness you've witnessed or performed.",
    "What are some positive changes you've noticed in yourself lately?"
  ];

  const getRandomPrompt = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * prompts.length);
    } while (newIndex === currentPromptIndex && prompts.length > 1);
    setCurrentPromptIndex(newIndex);
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-pink-900/20 border-2 border-yellow-200/50 dark:border-yellow-700/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Daily Inspiration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPromptIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-yellow-200/50 dark:border-yellow-700/50"
          >
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
              "{prompts[currentPromptIndex]}"
            </p>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex gap-2">
          <Button
            onClick={() => onUsePrompt(prompts[currentPromptIndex])}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Use This Prompt
          </Button>
          <Button
            onClick={getRandomPrompt}
            variant="outline"
            size="icon"
            className="border-yellow-300 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalPrompts;
