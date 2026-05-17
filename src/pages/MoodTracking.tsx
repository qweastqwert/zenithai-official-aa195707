
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import MoodSanctuary from '@/components/mood/MoodSanctuary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMoodData } from '@/hooks/useMoodData';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, TrendingUp, Calendar, Clock, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MoodTracking = () => {
  const [showMoodSanctuary, setShowMoodSanctuary] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const cookieMoodData = useMoodData();
  const supabaseMoodData = useMoodDataSupabase();
  
  const moodData = user ? supabaseMoodData : cookieMoodData;
  const { entries: moodEntries, getMoodStats } = moodData;
  const stats = getMoodStats();

  const moodEmojis: { [key: string]: string } = {
    'ecstatic': '🤩', 'joyful': '😊', 'content': '🙂', 'neutral': '😐',
    'melancholy': '😕', 'troubled': '😢', 'distressed': '😭'
  };

  const moodLabels: { [key: string]: string } = {
    'ecstatic': 'Ecstatic', 'joyful': 'Joyful', 'content': 'Content',
    'neutral': 'Neutral', 'melancholy': 'Melancholy', 'troubled': 'Troubled', 'distressed': 'Distressed'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <SEO
        title="Mood Tracking — Zenith AI"
        description="Log your moods, discover trends and triggers, and build emotional self-awareness with the Mood Sanctuary."
        path="/mood-tracking"
      />
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center gap-3 p-4 border-b border-border/40 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
          <button onClick={() => navigate('/chat')} className="p-1"><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-lg font-semibold">Mood Sanctuary</h1>
        </div>
      )}

      <main className={`${isMobile ? 'pt-4 pb-8' : 'pt-24 pb-16'} px-4`}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center ${isMobile ? 'mb-6' : 'mb-12'}`}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Heart className="h-8 w-8 text-pink-500" />
              </motion.div>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>
                Mood Sanctuary
              </h1>
            </div>
            <p className={`${isMobile ? 'text-sm' : 'text-xl'} text-muted-foreground max-w-2xl mx-auto`}>
              Track your emotional journey and discover patterns that illuminate your path to wellness
              {user && <span className="block text-sm mt-2 text-green-600">✨ Synced to your account</span>}
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="text-center mb-8">
            <Button
              onClick={() => setShowMoodSanctuary(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-full shadow-lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Open Mood Sanctuary
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <div className={`grid ${isMobile ? 'grid-cols-3 gap-3' : 'grid-cols-1 md:grid-cols-3 gap-6'} mb-8`}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 border-border">
                <CardContent className={`${isMobile ? 'p-3' : 'p-6'} text-center`}>
                  <TrendingUp className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-purple-600 dark:text-purple-400 mx-auto mb-2`} />
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-purple-800 dark:text-purple-300 mb-1`}>{stats.totalEntries}</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Total Entries</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 border-pink-200 dark:border-pink-700">
                <CardContent className={`${isMobile ? 'p-3' : 'p-6'} text-center`}>
                  <Calendar className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-pink-600 dark:text-pink-400 mx-auto mb-2`} />
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-pink-800 dark:text-pink-300 mb-1`}>{stats.last7DaysCount}</div>
                  <div className="text-xs text-pink-600 dark:text-pink-400">This Week</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
                <CardContent className={`${isMobile ? 'p-3' : 'p-6'} text-center`}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-4xl'} mb-2`}>{stats.mostCommonMood ? moodEmojis[stats.mostCommonMood] : '😊'}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    {stats.mostCommonMood ? `Most ${moodLabels[stats.mostCommonMood]}` : 'Track to see'}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Entries */}
          {moodEntries.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Recent Reflections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {moodEntries.slice(0, 5).map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
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
                          <div className="text-sm text-foreground/70 mt-2 italic">"{entry.reason}"</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
        
        <MoodSanctuary 
          isOpen={showMoodSanctuary}
          onClose={() => setShowMoodSanctuary(false)}
        />
      </main>
    </div>
  );
};

export default MoodTracking;
