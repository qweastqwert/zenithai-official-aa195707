
import React from 'react';
import { motion } from 'framer-motion';

interface BreathingCircleProps {
  phase: 'prepare' | 'inhale' | 'hold' | 'exhale';
  timeLeft: number;
  pattern: {
    name: string;
    color: string;
    inhale: number;
    hold: number;
    exhale: number;
  };
  isActive: boolean;
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({ 
  phase, 
  timeLeft, 
  pattern, 
  isActive 
}) => {
  const getPhaseText = () => {
    switch (phase) {
      case 'prepare': return 'Get Ready';
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Breathe';
    }
  };

  const getCircleScale = () => {
    if (!isActive) return 1;
    
    switch (phase) {
      case 'inhale': return 1.3;
      case 'hold': return 1.3;
      case 'exhale': return 1;
      default: return 1;
    }
  };

  const getAnimationDuration = () => {
    switch (phase) {
      case 'inhale': return pattern.inhale;
      case 'exhale': return pattern.exhale;
      case 'hold': return 0.3;
      default: return 0.5;
    }
  };

  const getEasing = () => {
    switch (phase) {
      case 'inhale': return 'easeOut';
      case 'exhale': return 'easeIn';
      default: return 'easeInOut';
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="w-48 h-48 rounded-full border-4 flex items-center justify-center relative overflow-hidden backdrop-blur-sm"
        animate={{
          scale: getCircleScale(),
          borderColor: pattern.color,
          boxShadow: isActive && phase !== 'prepare' 
            ? `0 0 30px ${pattern.color}30, 0 0 60px ${pattern.color}15` 
            : `0 0 0px ${pattern.color}00`
        }}
        transition={{
          scale: {
            duration: getAnimationDuration(),
            ease: getEasing()
          },
          borderColor: {
            duration: 0.3
          },
          boxShadow: {
            duration: 0.5
          }
        }}
        style={{ 
          backgroundColor: `${pattern.color}08`,
          borderColor: pattern.color
        }}
      >
        {/* Animated particles */}
        {isActive && phase !== 'prepare' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/60"
                style={{
                  top: '12px',
                  left: '50%',
                  transformOrigin: '0 84px',
                  transform: `rotate(${i * 60}deg)`
                }}
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
        
        {/* Center content */}
        <div className="text-center z-10 relative">
          <motion.div
            className="text-4xl font-bold mb-2"
            style={{ color: pattern.color }}
            animate={{ 
              scale: timeLeft <= 3 && timeLeft > 0 && phase !== 'prepare' ? [1, 1.1, 1] : 1,
              opacity: timeLeft === 0 && phase !== 'prepare' ? 0.6 : 1
            }}
            transition={{ 
              scale: { duration: 0.5, ease: "easeInOut" },
              opacity: { duration: 0.3 }
            }}
          >
            {timeLeft}
          </motion.div>
          <motion.div
            className="text-sm font-medium uppercase tracking-wide"
            style={{ color: pattern.color }}
            animate={{ 
              opacity: isActive ? [0.7, 1, 0.7] : 0.8
            }}
            transition={{ 
              duration: isActive ? 2 : 0.3, 
              repeat: isActive ? Infinity : 0 
            }}
          >
            {getPhaseText()}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BreathingCircle;
