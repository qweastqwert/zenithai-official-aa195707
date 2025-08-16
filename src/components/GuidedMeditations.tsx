
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface GuidedSession {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  instructions: string[];
  color: string;
  icon: string;
}

const guidedSessions: GuidedSession[] = [
  {
    id: 'breath-awareness',
    title: 'Breath Awareness',
    duration: 5,
    description: 'Focus on your natural breath to calm the mind and center yourself',
    instructions: [
      'Find a comfortable seated position and close your eyes',
      'Notice your natural breathing without trying to change it',
      'Feel the sensation of air entering through your nostrils',
      'Follow the breath as it fills your lungs completely',
      'Observe the gentle pause at the top of your inhale',
      'Feel the warm air leaving your body as you exhale',
      'When your mind wanders, gently return to your breath',
      'Continue this peaceful observation until the session ends'
    ],
    color: '#3B82F6',
    icon: '🫁'
  },
  {
    id: 'body-scan',
    title: 'Progressive Body Scan',
    duration: 10,
    description: 'Release tension by systematically relaxing each part of your body',
    instructions: [
      'Lie down comfortably and close your eyes',
      'Take three deep breaths to center yourself',
      'Focus on the top of your head, releasing any tension',
      'Move your attention to your forehead and eyes, letting them soften',
      'Relax your jaw, neck, and shoulders completely',
      'Feel your arms becoming heavy and relaxed',
      'Release tension from your chest and back',
      'Let your abdomen rise and fall naturally',
      'Relax your hips, thighs, and knees',
      'Feel your calves, ankles, and feet melting into relaxation',
      'Notice the peaceful feeling throughout your entire body'
    ],
    color: '#8B5CF6',
    icon: '🧘‍♀️'
  },
  {
    id: 'loving-kindness',
    title: 'Loving-Kindness Meditation',
    duration: 15,
    description: 'Cultivate compassion and love for yourself and others',
    instructions: [
      'Sit comfortably and place your hand on your heart',
      'Begin by sending love to yourself: "May I be happy"',
      'Continue: "May I be healthy, may I be at peace"',
      'Feel genuine warmth and kindness toward yourself',
      'Now bring a loved one to mind',
      'Send them the same wishes: "May you be happy"',
      'Extend these feelings: "May you be healthy, may you be at peace"',
      'Think of a neutral person - perhaps a neighbor',
      'Offer them the same loving wishes',
      'Now consider someone you have difficulty with',
      'Gently send them wishes for happiness and peace',
      'Finally, extend loving-kindness to all beings everywhere',
      'Rest in this feeling of universal love and connection'
    ],
    color: '#EC4899',
    icon: '💝'
  },
  {
    id: 'mindfulness',
    title: 'Present Moment Awareness',
    duration: 8,
    description: 'Cultivate awareness of the present moment through mindful observation',
    instructions: [
      'Sit with your eyes open or softly closed',
      'Notice five things you can see around you',
      'Listen carefully to four different sounds',
      'Feel three physical sensations in your body',
      'Notice two scents or smells in the air',
      'Taste one thing - perhaps the lingering taste in your mouth',
      'Now focus on your breath as an anchor to the present',
      'When thoughts arise, simply notice them and let them pass',
      'Return your attention to your breathing',
      'Feel yourself fully present in this moment',
      'Rest in this awareness of simply being here, now'
    ],
    color: '#10B981',
    icon: '🌅'
  },
  {
    id: 'stress-relief',
    title: 'Deep Stress Relief',
    duration: 12,
    description: 'Release accumulated stress and tension from your day',
    instructions: [
      'Find a quiet space and make yourself comfortable',
      'Take a deep breath in for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly for 6 counts',
      'Repeat this breathing pattern three more times',
      'Imagine a warm, golden light at the top of your head',
      'See this light slowly moving down through your body',
      'As it moves, it dissolves all tension and stress',
      'Feel your muscles relaxing as the light passes through',
      'Let any worries or concerns melt away',
      'The light reaches your toes, and your whole body feels peaceful',
      'Rest in this feeling of complete relaxation and calm'
    ],
    color: '#F59E0B',
    icon: '✨'
  },
  {
    id: 'confidence',
    title: 'Inner Confidence Building',
    duration: 7,
    description: 'Build self-confidence and inner strength through positive visualization',
    instructions: [
      'Sit tall with your shoulders back and spine straight',
      'Take three powerful, confident breaths',
      'Recall a time when you felt truly confident and strong',
      'Feel that confidence in your body right now',
      'Imagine yourself handling challenges with ease',
      'See yourself speaking with clarity and conviction',
      'Feel your inner strength growing with each breath',
      'Repeat silently: "I am capable, I am strong, I am confident"',
      'Visualize yourself succeeding in your goals',
      'Feel this confidence radiating from your core',
      'Know that this strength is always within you',
      'Carry this feeling with you as you return to your day'
    ],
    color: '#EF4444',
    icon: '💪'
  }
];

const GuidedMeditations: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<GuidedSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (selectedSession && isActive) {
      const totalSeconds = selectedSession.duration * 60;
      const instructionDuration = totalSeconds / selectedSession.instructions.length;
      const currentIndex = Math.floor((totalSeconds - timeLeft) / instructionDuration);
      setCurrentInstructionIndex(Math.min(currentIndex, selectedSession.instructions.length - 1));
    }
  }, [timeLeft, selectedSession, isActive]);

  const startSession = (session: GuidedSession) => {
    setSelectedSession(session);
    setTimeLeft(session.duration * 60);
    setCurrentInstructionIndex(0);
    setIsActive(true);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const resetSession = () => {
    setIsActive(false);
    setSelectedSession(null);
    setTimeLeft(0);
    setCurrentInstructionIndex(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedSession) {
    return (
      <div className="space-y-6">
        <Card className="overflow-hidden" style={{ background: `linear-gradient(135deg, ${selectedSession.color}20, white)` }}>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">{selectedSession.icon}</div>
              <h2 className="text-2xl font-bold" style={{ color: selectedSession.color }}>
                {selectedSession.title}
              </h2>
              
              <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                {formatTime(timeLeft)}
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={isActive ? pauseSession : resumeSession}
                  className="px-8 py-3"
                  style={{ backgroundColor: selectedSession.color }}
                >
                  {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isActive ? 'Pause' : 'Resume'}
                </Button>
                
                <Button onClick={resetSession} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  End Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5" style={{ color: selectedSession.color }} />
              Current Guidance
            </h3>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentInstructionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
              >
                {selectedSession.instructions[currentInstructionIndex]}
              </motion.p>
            </AnimatePresence>
            
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <span>Step {currentInstructionIndex + 1} of {selectedSession.instructions.length}</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: selectedSession.color,
                    width: `${((currentInstructionIndex + 1) / selectedSession.instructions.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Guided Meditation Sessions</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a session and let our gentle guidance lead you to inner peace
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guidedSessions.map((session) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{session.icon}</div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: session.color }}>
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {session.description}
                  </p>
                  <div className="text-sm font-medium" style={{ color: session.color }}>
                    {session.duration} minutes
                  </div>
                </div>
                
                <Button
                  onClick={() => startSession(session)}
                  className="w-full group-hover:shadow-md transition-all duration-300"
                  style={{ backgroundColor: session.color }}
                >
                  <Play className="mr-2 h-4 w-4" />
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
