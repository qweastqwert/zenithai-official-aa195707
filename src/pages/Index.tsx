
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, BookOpen, Heart, Brain, Music, Wind, Settings as SettingsIcon, Trophy, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MoodTracker from '@/components/MoodTracker';
import Journal from '@/components/Journal';
import MindMateEnhanced from '@/components/MindMateEnhanced';
import MeditationTimer from '@/components/MeditationTimer';
import SoothingMusic from '@/components/SoothingMusic';
import BreathingExerciseOptimized from '@/components/BreathingExerciseOptimized';
import Settings from '@/components/Settings';
import Achievements from '@/components/achievements/Achievements';
import ProfileSettings from '@/components/ProfileSettings';
import QuickInsights from '@/components/insights/QuickInsights';
import { useMoodData } from '@/hooks/useMoodData';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useJournal } from '@/hooks/useJournal';
import { useJournalSupabase } from '@/hooks/useJournalSupabase';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import MobileHeader from '@/components/navigation/MobileHeader';

const Index = () => {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();
  const { trackActivity } = useActivityTracker();

  // Use appropriate hooks based on authentication status
  const cookieMoodData = useMoodData();
  const supabaseMoodData = useMoodDataSupabase();
  const cookieJournal = useJournal();
  const supabaseJournal = useJournalSupabase();
  
  const moodData = user ? supabaseMoodData : cookieMoodData;
  const journalData = user ? supabaseJournal : cookieJournal;

  const handleOpenMoodTracker = () => {
    setShowMoodTracker(true);
    trackActivity('mood');
  };

  const handleOpenJournal = () => {
    setShowJournal(true);
    trackActivity('journal');
  };

  const handleOpenMindMate = () => {
    setActiveView('mindmate');
    trackActivity('mindmate');
  };

  const handleOpenMeditation = () => {
    setActiveView('meditation');
    trackActivity('meditation');
  };

  const handleOpenBreathing = () => {
    setActiveView('breathing');
    trackActivity('breathing');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'mindmate':
        return <MindMateEnhanced onBack={() => setActiveView('dashboard')} />;
      case 'meditation':
        return (
          <div className="min-h-screen bg-gradient-to-br from-zenith-softpurple via-white to-zenith-lightblue p-4 pt-20">
            <div className="max-w-2xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => setActiveView('dashboard')} 
                className="mb-6"
              >
                ← Back to Dashboard
              </Button>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6" style={{ color: 'var(--zenith-primary)' }} />
                    Meditation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MeditationTimer />
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'music':
        return (
          <div className="min-h-screen bg-gradient-to-br from-zenith-softpurple via-white to-zenith-lightblue p-4 pt-20">
            <div className="max-w-4xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => setActiveView('dashboard')} 
                className="mb-6"
              >
                ← Back to Dashboard
              </Button>
              <SoothingMusic />
            </div>
          </div>
        );
      case 'breathing':
        return (
          <div className="min-h-screen bg-gradient-to-br from-zenith-softpurple via-white to-zenith-lightblue p-4 pt-20">
            <div className="max-w-2xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => setActiveView('dashboard')} 
                className="mb-6"
              >
                ← Back to Dashboard
              </Button>
              <BreathingExerciseOptimized />
            </div>
          </div>
        );
      case 'settings':
        return <Settings onBack={() => setActiveView('dashboard')} />;
      case 'achievements':
        return <Achievements onBack={() => setActiveView('dashboard')} />;
      case 'profile':
        return <ProfileSettings onBack={() => setActiveView('dashboard')} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-zenith-softpurple via-white to-zenith-lightblue">
            <MobileHeader />
            
            <div className="pt-20 pb-24 px-4">
              <div className="max-w-6xl mx-auto space-y-8">
                {/* Welcome Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center space-y-4"
                >
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-zenith-primary via-zenith-purple to-zenith-darkpurple bg-clip-text text-transparent">
                    Welcome {profile?.name ? `back, ${profile.name}` : 'to Zenith'}
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Your personal sanctuary for mental wellness and emotional balance
                  </p>
                </motion.div>

                {/* Quick Insights */}
                {(moodData.entries.length > 0 || journalData.entries.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
                          Your Wellness Journey
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <QuickInsights 
                          moodEntries={moodData.entries} 
                          journalEntries={journalData.entries} 
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Main Features Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {/* MindMate Card */}
                  <Card 
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-700"
                    onClick={handleOpenMindMate}
                  >
                    <CardHeader className="text-center pb-4">
                      <motion.div
                        className="mx-auto mb-4 p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 10 }}
                      >
                        <Heart className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl">MindMate</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Chat with your caring AI companion for emotional support and meaningful conversations
                      </p>
                      <Button className="w-full group-hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'var(--zenith-primary)' }}>
                        Start Conversation
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Mood Tracker Card */}
                  <Card 
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                    onClick={handleOpenMoodTracker}
                  >
                    <CardHeader className="text-center pb-4">
                      <motion.div
                        className="mx-auto mb-4 p-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: -10 }}
                      >
                        <Calendar className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl">Mood Sanctuary</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Track your emotions, discover patterns, and gain insights into your emotional well-being
                      </p>
                      <Button className="w-full group-hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'var(--zenith-primary)' }}>
                        Track Mood
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Journal Card */}
                  <Card 
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 border-2 border-transparent hover:border-green-200 dark:hover:border-green-700"
                    onClick={handleOpenJournal}
                  >
                    <CardHeader className="text-center pb-4">
                      <motion.div
                        className="mx-auto mb-4 p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 10 }}
                      >
                        <BookOpen className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl">Daily Journal</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Reflect on your thoughts and experiences through guided journaling prompts
                      </p>
                      <Button className="w-full group-hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'var(--zenith-primary)' }}>
                        Write Today
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Meditation Card */}
                  <Card 
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-700"
                    onClick={handleOpenMeditation}
                  >
                    <CardHeader className="text-center pb-4">
                      <motion.div
                        className="mx-auto mb-4 p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: -10 }}
                      >
                        <Brain className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl">Meditation</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Find inner peace with guided meditation sessions and calming background music
                      </p>
                      <Button className="w-full group-hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'var(--zenith-primary)' }}>
                        Start Session
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Breathing Exercises Card */}
                  <Card 
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50 dark:from-gray-800 dark:to-teal-900/20 border-2 border-transparent hover:border-teal-200 dark:hover:border-teal-700"
                    onClick={handleOpenBreathing}
                  >
                    <CardHeader className="text-center pb-4">
                      <motion.div
                        className="mx-auto mb-4 p-4 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 10 }}
                      >
                        <Wind className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl">Breathing</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Practice mindful breathing techniques to reduce stress and find balance
                      </p>
                      <Button className="w-full group-hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'var(--zenith-primary)' }}>
                        Start Exercise
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Music Card */}
                  <Card 
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/20 border-2 border-transparent hover:border-pink-200 dark:hover:border-pink-700"
                    onClick={() => setActiveView('music')}
                  >
                    <CardHeader className="text-center pb-4">
                      <motion.div
                        className="mx-auto mb-4 p-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: -10 }}
                      >
                        <Music className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl">Soothing Music</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Immerse yourself in carefully curated music for relaxation and focus
                      </p>
                      <Button className="w-full group-hover:scale-105 transition-transform duration-300" style={{ backgroundColor: 'var(--zenith-primary)' }}>
                        Play Music
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            <MobileNavigation 
              currentView={activeView}
              onNavigate={setActiveView}
            />

            {/* Modals */}
            <AnimatePresence>
              {showMoodTracker && (
                <MoodTracker 
                  showPromptOnly={true}
                  onPromptComplete={() => setShowMoodTracker(false)}
                />
              )}
              
              {showJournal && (
                <Journal onClose={() => setShowJournal(false)} />
              )}
            </AnimatePresence>
          </div>
        );
    }
  };

  return renderActiveView();
};

export default Index;
