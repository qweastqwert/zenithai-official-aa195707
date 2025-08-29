
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MoodSanctuary from '@/components/mood/MoodSanctuary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMoodData } from '@/hooks/useMoodData';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useAuth } from '@/hooks/useAuth';
import { Heart, TrendingUp, Calendar, Clock, Sparkles } from 'lucide-react';

const MoodTracking = () => {
  const [showMoodSanctuary, setShowMoodSanctuary] = useState(false);
  const { user } = useAuth();
  
  // Use appropriate hook based on authentication status
  const cookieMoodData = useMoodData();
  const supabaseMoodData = useMoodDataSupabase();
  
  const moodData = user ? supabaseMoodData : cookieMoodData;
  const { entries: moodEntries, getMoodStats } = moodData;
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

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-8 w-8 text-pink-500" />
              </motion.div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Elegant Mood Sanctuary
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Track your emotional journey with grace and discover patterns that illuminate your path to wellness
              {user && <span className="block text-sm mt-2 text-green-600">✨ Synced to your account</span>}
            </p>
          </motion.div>
          
          {/* Quick Track Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <Button
              onClick={() => setShowMoodSanctuary(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Open Mood Sanctuary
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-purple-800 dark:text-purple-300 mb-1">
                    {stats.totalEntries}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Total Entries</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 border-pink-200 dark:border-pink-700">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-pink-600 dark:text-pink-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-pink-800 dark:text-pink-300 mb-1">
                    {stats.last7DaysCount}
                  </div>
                  <div className="text-sm text-pink-600 dark:text-pink-400">This Week</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">
                    {stats.mostCommonMood ? moodEmojis[stats.mostCommonMood] : '😊'}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {stats.mostCommonMood ? `Most ${moodLabels[stats.mostCommonMood]}` : 'Track to see trends'}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Entries */}
          {moodEntries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-purple-200/50 dark:border-purple-700/50">
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
                          <span className="text-sm text-gray-500">• {entry.time}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.formattedDate || new Date(entry.date).toLocaleDateString()}
                        </div>
                        {entry.reason && (
                          <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">
                            "{entry.reason}"
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-800 dark:via-purple-900/20 dark:to-pink-900/20">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-6 text-center">Benefits of Elegant Mood Tracking</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-purple-800 dark:text-purple-300">Sublime Self-Awareness</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-400">
                      Develop exquisite consciousness of your emotional patterns and triggers.
                    </p>
                  </div>
                  
                  <div className="bg-pink-100 dark:bg-pink-900/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-pink-800 dark:text-pink-300">Pattern Recognition</h4>
                    <p className="text-sm text-pink-700 dark:text-pink-400">
                      Discover elegant connections between activities, people, and your emotional state.
                    </p>
                  </div>
                  
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-300">Enhanced Communication</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Express your feelings with greater eloquence and emotional vocabulary.
                    </p>
                  </div>
                  
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-green-800 dark:text-green-300">Progress Mastery</h4>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Measure and celebrate improvements in your emotional wellness journey.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Mood Sanctuary Modal */}
        <MoodSanctuary 
          isOpen={showMoodSanctuary}
          onClose={() => setShowMoodSanctuary(false)}
        />
      </main>
      <Footer />
    </>
  );
};

export default MoodTracking;
