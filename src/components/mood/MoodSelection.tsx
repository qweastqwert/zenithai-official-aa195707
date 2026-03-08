
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface MoodSelectionProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  compact?: boolean;
}

const MoodSelection: React.FC<MoodSelectionProps> = ({ selectedMood, onMoodSelect, compact = false }) => {
  const moods = [
    { id: 'ecstatic', emoji: '🤩', label: 'Ecstatic', color: '#10B981', description: 'Absolutely amazing!' },
    { id: 'joyful', emoji: '😊', label: 'Joyful', color: '#3B82F6', description: 'Feeling wonderful' },
    { id: 'content', emoji: '🙂', label: 'Content', color: '#8B5CF6', description: 'Pleasantly satisfied' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#F59E0B', description: 'Just okay' },
    { id: 'melancholy', emoji: '😕', label: 'Melancholy', color: '#F97316', description: 'Somewhat down' },
    { id: 'troubled', emoji: '😢', label: 'Troubled', color: '#EF4444', description: 'Feeling low' },
    { id: 'distressed', emoji: '😭', label: 'Distressed', color: '#991B1B', description: 'Very upset' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={compact 
        ? "grid grid-cols-3 sm:grid-cols-4 gap-2" 
        : "grid grid-cols-4 gap-3"
      }
    >
      {moods.map((mood) => (
        <motion.div
          key={mood.id}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => onMoodSelect(mood.id)}
            variant={selectedMood === mood.id ? "default" : "outline"}
            className={`w-full flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group ${
              compact 
                ? 'h-14 space-y-0.5 p-1.5' 
                : 'h-24 md:h-28 space-y-2'
            } ${
              selectedMood === mood.id 
                ? 'shadow-lg ring-2 ring-opacity-50' 
                : 'hover:shadow-md hover:border-opacity-70'
            }`}
            style={selectedMood === mood.id ? { 
              backgroundColor: mood.color, 
              borderColor: mood.color,
              boxShadow: `0 0 15px ${mood.color}30`
            } : {}}
          >
            <motion.span 
              className={compact ? "text-xl" : "text-3xl md:text-4xl"}
              animate={selectedMood === mood.id ? { rotate: [0, 5, -5, 0] } : {}}
              transition={{ duration: 0.5, repeat: selectedMood === mood.id ? Infinity : 0, repeatDelay: 2 }}
            >
              {mood.emoji}
            </motion.span>
            <span className={`font-medium ${compact ? 'text-[10px] leading-tight' : 'text-xs md:text-sm'}`}>
              {mood.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MoodSelection;
