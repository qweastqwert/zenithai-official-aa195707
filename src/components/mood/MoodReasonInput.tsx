
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, SkipForward } from 'lucide-react';

interface MoodReasonInputProps {
  selectedMood: string;
  onSubmit: (reason: string) => void;
  onSkip: () => void;
  compact?: boolean;
}

const MoodReasonInput: React.FC<MoodReasonInputProps> = ({ selectedMood, onSubmit, onSkip, compact = false }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onSubmit(reason.trim());
  };

  const moodLabels: { [key: string]: string } = {
    'ecstatic': 'Ecstatic',
    'joyful': 'Joyful', 
    'content': 'Content',
    'neutral': 'Neutral',
    'melancholy': 'Melancholy',
    'troubled': 'Troubled',
    'distressed': 'Distressed'
  };

  const moodEmojis: { [key: string]: string } = {
    'ecstatic': '🤩',
    'joyful': '😊', 
    'content': '🙂',
    'neutral': '😐',
    'melancholy': '😕',
    'troubled': '😢',
    'distressed': '😭'
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{moodEmojis[selectedMood]}</span>
          <span className="text-sm font-medium text-foreground">
            Feeling {moodLabels[selectedMood]}
          </span>
        </div>
        
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="What's contributing to this mood? (Optional)"
          className="min-h-[60px] text-sm resize-none bg-background/50"
          maxLength={500}
        />

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button
            onClick={onSkip}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            Skip
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-800 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200/50 dark:border-purple-700/50">
        <CardContent className="p-6 space-y-6">
          <motion.div 
            className="text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="text-6xl mb-3">
              {moodEmojis[selectedMood]}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              You're feeling {moodLabels[selectedMood]}
            </h3>
            <motion.div
              className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Sparkles className="h-4 w-4" />
              <span>Would you like to share why? (Optional)</span>
              <Sparkles className="h-4 w-4" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="What's contributing to this mood? Share your thoughts..."
              className="min-h-[100px] resize-none border-purple-200/50 dark:border-purple-700/50 focus:border-purple-400 dark:focus:border-purple-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {reason.length}/500
            </div>
          </motion.div>

          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Save Mood
            </Button>
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex-1 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Skip
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MoodReasonInput;
