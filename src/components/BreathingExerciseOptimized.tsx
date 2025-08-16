
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Settings, Wind, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  description: string;
  color: string;
}

const breathingPatterns: BreathingPattern[] = [
  {
    name: "Tranquil Harmony",
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: "Perfect balance for everyday calm",
    color: "#3B82F6"
  },
  {
    name: "Serenity Flow",
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: "Deep relaxation and stress relief",
    color: "#8B5CF6"
  },
  {
    name: "Energy Boost",
    inhale: 6,
    hold: 2,
    exhale: 4,
    description: "Energizing breath for focus",
    color: "#10B981"
  },
  {
    name: "Meditation Bliss",
    inhale: 6,
    hold: 6,
    exhale: 6,
    description: "Deep meditative breathing",
    color: "#F59E0B"
  }
];

const BreathingExerciseOptimized: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'prepare' | 'inhale' | 'hold' | 'exhale'>('prepare');
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(breathingPatterns[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [totalCycles, setTotalCycles] = useState([10]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handlePhaseTransition();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handlePhaseTransition = () => {
    if (currentPhase === 'prepare') {
      setCurrentPhase('inhale');
      setTimeLeft(selectedPattern.inhale);
    } else if (currentPhase === 'inhale') {
      setCurrentPhase('hold');
      setTimeLeft(selectedPattern.hold);
    } else if (currentPhase === 'hold') {
      setCurrentPhase('exhale');
      setTimeLeft(selectedPattern.exhale);
    } else if (currentPhase === 'exhale') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      if (newCycles >= totalCycles[0]) {
        setIsActive(false);
        setCurrentPhase('prepare');
        setTimeLeft(0);
        setCycles(0);
      } else {
        setCurrentPhase('inhale');
        setTimeLeft(selectedPattern.inhale);
      }
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhase('prepare');
    setTimeLeft(3);
    setCycles(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('prepare');
    setTimeLeft(0);
    setCycles(0);
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'prepare': return 'Get Ready';
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Breathe';
    }
  };

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale': return 1.8;
      case 'hold': return 1.8;
      case 'exhale': return 1;
      default: return 1;
    }
  };

  const getCircleColor = () => {
    if (currentPhase === 'prepare') return '#94A3B8';
    return selectedPattern.color;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Wind className="h-8 w-8 text-blue-500" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Exquisite Breathing
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Transform your state with elegant breathing techniques
        </p>
      </motion.div>

      {/* Main Breathing Circle */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200/50 dark:border-blue-700/50">
        <CardContent className="p-8 flex flex-col items-center justify-center space-y-8 min-h-[400px]">
          {/* Breathing Circle */}
          <div className="relative flex items-center justify-center">
            <motion.div
              className="w-48 h-48 rounded-full border-4 border-opacity-30 flex items-center justify-center relative overflow-hidden"
              animate={{
                scale: getCircleScale(),
                borderColor: getCircleColor(),
                boxShadow: currentPhase !== 'prepare' ? `0 0 40px ${getCircleColor()}40` : 'none'
              }}
              transition={{
                duration: currentPhase === 'inhale' ? selectedPattern.inhale : 
                         currentPhase === 'hold' ? selectedPattern.hold : 
                         currentPhase === 'exhale' ? selectedPattern.exhale : 1,
                ease: "easeInOut"
              }}
              style={{ backgroundColor: `${getCircleColor()}10` }}
            >
              {/* Animated particles */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-white/60"
                      style={{
                        top: '10px',
                        left: '50%',
                        transformOrigin: '0 86px',
                        transform: `rotate(${i * 45}deg)`
                      }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </motion.div>
              )}
              
              {/* Center content */}
              <div className="text-center z-10 relative">
                <motion.div
                  className="text-6xl font-bold mb-2"
                  style={{ color: getCircleColor() }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {timeLeft > 0 ? timeLeft : <Sparkles className="h-12 w-12" />}
                </motion.div>
                <motion.div
                  className="text-lg font-medium"
                  style={{ color: getCircleColor() }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {getPhaseText()}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Progress and Info */}
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedPattern.name} • Cycle {cycles + 1} of {totalCycles[0]}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {selectedPattern.description}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              onClick={isActive ? pauseExercise : startExercise}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isActive ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
              {isActive ? 'Pause' : 'Begin'}
            </Button>
            
            <Button
              onClick={resetExercise}
              variant="outline"
              className="border-gray-300 dark:border-gray-600 px-6 py-3 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300 dark:border-gray-600"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Customization
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Breathing Pattern</label>
                    <Select value={selectedPattern.name} onValueChange={(value) => 
                      setSelectedPattern(breathingPatterns.find(p => p.name === value) || breathingPatterns[0])
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {breathingPatterns.map((pattern) => (
                          <SelectItem key={pattern.name} value={pattern.name}>
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: pattern.color }}
                              />
                              <div>
                                <div className="font-medium">{pattern.name}</div>
                                <div className="text-xs text-gray-500">{pattern.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Total Cycles: {totalCycles[0]}
                    </label>
                    <Slider
                      value={totalCycles}
                      onValueChange={setTotalCycles}
                      max={20}
                      min={5}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathingExerciseOptimized;
