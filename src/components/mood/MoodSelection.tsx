
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface MoodSelectionProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
}

const MoodSelection: React.FC<MoodSelectionProps> = ({ selectedMood, onMoodSelect }) => {
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
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
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
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
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
            className={`w-full h-24 md:h-28 flex flex-col items-center justify-center space-y-2 transition-all duration-300 relative overflow-hidden group ${
              selectedMood === mood.id 
                ? 'shadow-xl ring-4 ring-opacity-50' 
                : 'hover:shadow-lg hover:border-opacity-70'
            }`}
            style={selectedMood === mood.id ? { 
              backgroundColor: mood.color, 
              borderColor: mood.color,
              boxShadow: `0 0 20px ${mood.color}40`
            } : {}}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <motion.span 
              className="text-3xl md:text-4xl relative z-10"
              animate={selectedMood === mood.id ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: selectedMood === mood.id ? Infinity : 0, repeatDelay: 2 }}
            >
              {mood.emoji}
            </motion.span>
            <span className="text-xs md:text-sm font-medium relative z-10">{mood.label}</span>
            
            {/* Shimmer effect */}
            {selectedMood === mood.id && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            )}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MoodSelection;
