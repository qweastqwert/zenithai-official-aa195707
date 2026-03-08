import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Clock, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import MoodSelection from './MoodSelection';
import MoodReasonInput from './MoodReasonInput';
import { useMoodData } from '@/hooks/useMoodData';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useAuth } from '@/hooks/useAuth';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { MoodEntry } from '@/types/mood';

interface MoodSanctuaryProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoodSanctuary: React.FC<MoodSanctuaryProps> = ({ isOpen, onClose }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [step, setStep] = useState<'select' | 'reason'>('select');
  const { user } = useAuth();
  const { isMobile } = useDeviceDetection();
  
  // Use appropriate hook based on authentication status
  const cookieMoodData = useMoodData();
  const supabaseMoodData = useMoodDataSupabase();
  
  const moodData = user ? supabaseMoodData : cookieMoodData;
  const { entries: moodEntries, addEntry: saveMoodEntry, getMoodStats } = moodData;
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

  const handleMoodSubmit = async (reason?: string) => {
    if (selectedMood) {
      if (user) {
        await saveMoodEntry(selectedMood, reason || '');
      } else {
        cookieMoodData.saveMoodEntry(selectedMood, reason || '');
      }
      setSelectedMood('');
      setStep('select');
    }
  };

  const handleBack = () => {
    setStep('select');
    setSelectedMood('');
  };

  if (!isOpen) return null;

  // Mobile fullscreen view
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-50 bg-background flex flex-col"
          style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1.5 -ml-1.5">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h1 className="text-base font-semibold">Mood Sanctuary</h1>
            </div>
            <div className="w-8" />
          </div>

          {/* Mobile Content */}
          <Tabs defaultValue="log" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2 mx-4 mt-3 max-w-[calc(100%-2rem)] flex-shrink-0">
              <TabsTrigger value="log" className="text-sm">Log Mood</TabsTrigger>
              <TabsTrigger value="reflections" className="text-sm">Reflections</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 pb-8">
                <TabsContent value="log" className="space-y-4 mt-0">
                  <AnimatePresence mode="wait">
                    {step === 'select' ? (
                      <motion.div
                        key="select"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-1">How are you feeling?</h3>
                          <p className="text-muted-foreground text-sm">Take a moment to check in</p>
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
                        <Button variant="ghost" onClick={handleBack} className="mb-3 -ml-2">
                          ← Back
                        </Button>
                        <MoodReasonInput 
                          selectedMood={selectedMood}
                          onSubmit={handleMoodSubmit}
                          onSkip={() => handleMoodSubmit()}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="reflections" className="space-y-4 mt-0">
                  {/* Stats Section - Mobile optimized */}
                  <div className="grid grid-cols-3 gap-2">
                    <Card className="bg-primary/10 border-primary/20">
                      <CardContent className="p-3 text-center">
                        <TrendingUp className="h-4 w-4 text-primary mx-auto mb-1" />
                        <div className="text-lg font-bold text-primary">{stats.totalEntries}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-pink-500/10 border-pink-500/20">
                      <CardContent className="p-3 text-center">
                        <Calendar className="h-4 w-4 text-pink-500 mx-auto mb-1" />
                        <div className="text-lg font-bold text-pink-500">{stats.last7DaysCount}</div>
                        <div className="text-xs text-muted-foreground">Week</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-500/10 border-blue-500/20">
                      <CardContent className="p-3 text-center">
                        <div className="text-xl mb-1">
                          {stats.mostCommonMood ? moodEmojis[stats.mostCommonMood] : '😊'}
                        </div>
                        <div className="text-xs text-muted-foreground">Common</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Entries - Mobile */}
                  <Card>
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        Recent Reflections
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-[50vh] overflow-y-auto px-4 pb-4">
                        {moodEntries.length === 0 ? (
                          <div className="text-center py-6 text-muted-foreground">
                            <p className="text-sm">No entries yet. Start by logging your first mood!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {moodEntries.slice(0, 10).map((entry: MoodEntry, index: number) => (
                              <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                              >
                                <div className="text-2xl flex-shrink-0">{moodEmojis[entry.mood]}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-medium text-sm">{moodLabels[entry.mood]}</span>
                                    <span className="text-xs text-muted-foreground">• {entry.time}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {entry.formattedDate || new Date(entry.date).toLocaleDateString()}
                                  </div>
                                  {entry.reason && (
                                    <div className="text-xs text-foreground/80 mt-1 italic line-clamp-2">
                                      "{entry.reason}"
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop/Tablet view
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background/90 to-secondary/20 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <Card className="bg-card/95 backdrop-blur-xl border-border shadow-2xl h-full flex flex-col">
            <CardHeader className="text-center pb-4 relative border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Heart className="h-8 w-8 text-primary" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">
                      Mood Sanctuary
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      Your sacred space for emotional wellness {user && '(Synced)'}
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
                <TabsList className="grid w-full grid-cols-2 m-6 mb-0 max-w-md flex-shrink-0">
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
                              <p className="text-muted-foreground">Take a moment to check in with yourself</p>
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
                        <Card className="bg-primary/10 border-primary/20">
                          <CardContent className="p-4 text-center">
                            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-primary">
                              {stats.totalEntries}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Entries</div>
                          </CardContent>
                        </Card>

                        <Card className="bg-pink-500/10 border-pink-500/20">
                          <CardContent className="p-4 text-center">
                            <Calendar className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-pink-500">
                              {stats.last7DaysCount}
                            </div>
                            <div className="text-sm text-muted-foreground">This Week</div>
                          </CardContent>
                        </Card>

                        <Card className="bg-blue-500/10 border-blue-500/20">
                          <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">
                              {stats.mostCommonMood ? moodEmojis[stats.mostCommonMood] : '😊'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {stats.mostCommonMood ? `Most ${moodLabels[stats.mostCommonMood]}` : 'Track to see trends'}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Recent Entries */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Recent Reflections
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <ScrollArea className="h-96 p-4">
                            {moodEntries.length === 0 ? (
                              <div className="text-center py-8 text-muted-foreground">
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
                                    className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50"
                                  >
                                    <div className="text-3xl">{moodEmojis[entry.mood]}</div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">{moodLabels[entry.mood]}</span>
                                        <span className="text-sm text-muted-foreground">• {entry.time}</span>
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {entry.formattedDate || new Date(entry.date).toLocaleDateString()}
                                      </div>
                                      {entry.reason && (
                                        <div className="text-sm text-foreground/80 mt-2 italic">
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
