
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Clock, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import MoodSelection from './MoodSelection';
import MoodReasonInput from './MoodReasonInput';
import { useMoodData, MoodEntry } from '@/hooks/useMoodData';

interface MoodSanctuaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoodSanctuary: React.FC<MoodSanctuaryProps> = ({ isOpen, onClose }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [step, setStep] = useState<'select' | 'reason'>('select');
  const { moodEntries, saveMoodEntry, getMoodStats } = useMoodData();
  const stats = getMoodStats();

  const moodEmojis: { [key: string]: string } = {
    'ecstatic': '🤩',
    'joyful': '😊', 
    'content': '🙂',
    'neutral': '😐',
    'melancholy': '😕',
    'troubled': '😢',
    'distressed': '😭'
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

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setStep('reason');
  };

  const handleMoodSubmit = (reason?: string) => {
    if (selectedMood) {
      saveMoodEntry(selectedMood, reason || '');
      // Reset form
      setSelectedMood('');
      setStep('select');
      // Show success message or animation here if needed
    }
  };

  const handleBack = () => {
    setStep('select');
    setSelectedMood('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-purple-800/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-2 border-purple-200/50 dark:border-purple-700/50 shadow-2xl h-full flex flex-col">
            <CardHeader className="text-center pb-4 relative border-b border-purple-200/30 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Heart className="h-8 w-8 text-purple-600" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                      Mood Sanctuary
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Your sacred space for emotional wellness
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-hidden">
              <Tabs defaultValue="log" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 m-6 mb-0 flex-shrink-0">
                  <TabsTrigger value="log" className="text-base">Log Mood</TabsTrigger>
                  <TabsTrigger value="reflections" className="text-base">Reflections</TabsTrigger>
                </TabsList>

                <ScrollArea className="flex-1">
                  <div className="p-6">
                    <TabsContent value="log" className="space-y-6 mt-0">
                      <AnimatePresence mode="wait">
                        {step === 'select' ? (
                          <motion.div
                            key="select"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <div className="text-center">
                              <h3 className="text-xl font-semibold mb-2">How are you feeling right now?</h3>
                              <p className="text-gray-600 dark:text-gray-400">Take a moment to check in with yourself</p>
                            </div>
                            <MoodSelection selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="reason"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="mb-4">
                              <Button variant="ghost" onClick={handleBack} className="mb-4">
                                ← Back to mood selection
                              </Button>
                            </div>
                            <MoodReasonInput 
                              selectedMood={selectedMood}
                              onSubmit={handleMoodSubmit}
                              onSkip={() => handleMoodSubmit()}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </TabsContent>

                    <TabsContent value="reflections" className="space-y-6 mt-0">
                      {/* Stats Section */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                          <CardContent className="p-4 text-center">
                            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                              {stats.totalEntries}
                            </div>
                            <div className="text-sm text-purple-600 dark:text-purple-400">Total Entries</div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30">
                          <CardContent className="p-4 text-center">
                            <Calendar className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-pink-800 dark:text-pink-300">
                              {stats.last7DaysCount}
                            </div>
                            <div className="text-sm text-pink-600 dark:text-pink-400">This Week</div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">
                              {stats.mostCommonMood ? moodEmojis[stats.mostCommonMood] : '😊'}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                              {stats.mostCommonMood ? `Most ${moodLabels[stats.mostCommonMood]}` : 'Track to see trends'}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Recent Entries */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-purple-600" />
                            Recent Reflections
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <ScrollArea className="h-96 p-4">
                            {moodEntries.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>No mood entries yet. Start by logging your first mood!</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {moodEntries.slice(0, 10).map((entry: MoodEntry, index: number) => (
                                  <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                  >
                                    <div className="text-3xl">{moodEmojis[entry.mood]}</div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">{moodLabels[entry.mood]}</span>
                                        <span className="text-sm text-gray-500">• {entry.time}</span>
                                      </div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {entry.formattedDate}
                                      </div>
                                      {entry.reason && (
                                        <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                                          "{entry.reason}"
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </ScrollArea>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MoodSanctuary;
