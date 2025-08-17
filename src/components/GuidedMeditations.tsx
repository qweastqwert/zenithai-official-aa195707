
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

interface GuidedSession {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  instructions: string[];
  color: string;
}

const guidedSessions: GuidedSession[] = [
  {
    id: 'mindful-breathing',
    title: 'Mindful Breathing',
    duration: 5,
    description: 'Focus on your breath to cultivate present-moment awareness',
    instructions: [
      'Find a comfortable seated position with your back straight',
      'Close your eyes gently or soften your gaze',
      'Take three deep breaths to settle into this moment',
      'Now breathe naturally, focusing on the sensation of breathing',
      'Notice the air entering and leaving your nostrils',
      'When your mind wanders, gently return to your breath',
      'Continue breathing mindfully for the remaining time'
    ],
    color: '#3B82F6'
  },
  {
    id: 'body-scan',
    title: 'Progressive Body Scan',
    duration: 10,
    description: 'Release tension by systematically relaxing each part of your body',
    instructions: [
      'Lie down comfortably or sit with your back supported',
      'Close your eyes and take several deep breaths',
      'Start by focusing on your toes, noticing any sensations',
      'Gradually move your attention up through your feet and legs',
      'Continue scanning up through your torso, arms, and hands',
      'Notice your neck, face, and the top of your head',
      'If you find tension, breathe into that area and let it soften',
      'End by feeling your whole body relaxed and at peace'
    ],
    color: '#8B5CF6'
  },
  {
    id: 'loving-kindness',
    title: 'Loving-Kindness Meditation',
    duration: 15,
    description: 'Cultivate compassion and goodwill towards yourself and others',
    instructions: [
      'Sit comfortably and close your eyes',
      'Begin by directing loving-kindness towards yourself',
      'Silently repeat: "May I be happy, may I be healthy, may I be at peace"',
      'Feel genuine care and compassion for yourself',
      'Now bring to mind someone you love dearly',
      'Direct the same wishes to them: "May you be happy, may you be healthy"',
      'Extend these wishes to a neutral person, then to someone difficult',
      'Finally, send loving-kindness to all beings everywhere'
    ],
    color: '#EC4899'
  },
  {
    id: 'mountain-meditation',
    title: 'Mountain Meditation',
    duration: 12,
    description: 'Develop stability and groundedness through mountain visualization',
    instructions: [
      'Sit with dignity, imagining yourself as a mountain',
      'Feel your base rooted firmly to the earth',
      'Your spine rises like a mountain peak toward the sky',
      'Notice how mountains remain stable through all weather',
      'Rain, snow, and storms pass by, but the mountain remains',
      'Similarly, let thoughts and emotions pass through you',
      'You are solid, grounded, and unmovable at your core',
      'Rest in this mountain-like stability and strength'
    ],
    color: '#10B981'
  },
  {
    id: 'gratitude-meditation',
    title: 'Gratitude Practice',
    duration: 8,
    description: 'Cultivate appreciation and thankfulness for life\'s blessings',
    instructions: [
      'Settle into a comfortable position and breathe deeply',
      'Bring to mind something you\'re grateful for today',
      'Really feel the appreciation in your heart',
      'Now think of a person you\'re thankful to have in your life',
      'Notice the warmth and joy that gratitude brings',
      'Expand to appreciate your body, your home, nature around you',
      'Let this feeling of gratitude fill your entire being',
      'End by setting an intention to notice more to be grateful for'
    ],
    color: '#F59E0B'
  }
];

const GuidedMeditations: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<GuidedSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Update instruction based on time
  useEffect(() => {
    if (selectedSession && isActive) {
      const totalTime = selectedSession.duration * 60;
      const timePerInstruction = totalTime / selectedSession.instructions.length;
      const elapsed = totalTime - timeLeft;
      const instructionIndex = Math.min(
        Math.floor(elapsed / timePerInstruction),
        selectedSession.instructions.length - 1
      );
      setCurrentInstruction(instructionIndex);
    }
  }, [timeLeft, selectedSession, isActive]);

  const startSession = (session: GuidedSession) => {
    setSelectedSession(session);
    setTimeLeft(session.duration * 60);
    setCurrentInstruction(0);
    setIsActive(true);
  };

  const pauseResume = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(selectedSession ? selectedSession.duration * 60 : 0);
    setCurrentInstruction(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedSession) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2" style={{ color: selectedSession.color }}>
              {selectedSession.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{selectedSession.description}</p>
          </div>

          <Card className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-gray-800 dark:via-purple-900/20 dark:to-blue-900/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-4xl font-mono" style={{ color: selectedSession.color }}>
                {formatTime(timeLeft)}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentInstruction}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="min-h-[60px] flex items-center justify-center"
                >
                  <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md">
                    {selectedSession.instructions[currentInstruction]}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={pauseResume}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isActive ? 'Pause' : 'Resume'}
                </Button>
                
                <Button
                  onClick={resetSession}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                
                <Button
                  onClick={() => setSelectedSession(null)}
                  variant="outline"
                  size="lg"
                >
                  Back to Sessions
                </Button>
              </div>

              <div className="text-sm text-gray-500">
                Instruction {currentInstruction + 1} of {selectedSession.instructions.length}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Guided Meditation Sessions</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a guided session to deepen your meditation practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guidedSessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader style={{ backgroundColor: `${session.color}15` }}>
                <CardTitle className="flex items-center justify-between">
                  <span style={{ color: session.color }}>{session.title}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Timer className="h-4 w-4 mr-1" />
                    {session.duration} min
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-600 dark:text-gray-400">{session.description}</p>
                <Button
                  onClick={() => startSession(session)}
                  className="w-full"
                  style={{ backgroundColor: session.color, color: 'white' }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GuidedMeditations;
