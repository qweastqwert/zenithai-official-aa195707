import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Wind, 
  Heart, 
  Music, 
  Settings as SettingsIcon,
  BookOpen, 
  Brain,
  Flower2,
  Calendar,
  TrendingUp,
  Trophy
} from 'lucide-react';

import IntroAnimation from '@/components/IntroAnimation';
import MindMateEnhanced from '@/components/MindMateEnhanced';
import BreathingExerciseRevamped from '@/components/breathing/BreathingExerciseRevamped';
import SoothingMusic from '@/components/SoothingMusic';
import MoodSanctuary from '@/components/mood/MoodSanctuary';
import Journal from '@/components/Journal';
import MoodTracker from '@/components/MoodTracker';
import Settings from '@/components/Settings';
import Achievements from '@/components/achievements/Achievements';
import ProfileSettings from '@/components/ProfileSettings';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import MobileHeader from '@/components/navigation/MobileHeader';
import QuickInsights from '@/components/insights/QuickInsights';

import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useMoodData } from '@/hooks/useMoodData';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useJournal } from '@/hooks/useJournal';
import { useJournalSupabase } from '@/hooks/useJournalSupabase';
import { useAuth } from '@/hooks/useAuth';
import { getCookie, setCookie } from '@/utils/cookieUtils';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [showIntro, setShowIntro] = useState(false);
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);
  const { isMobile } = useDeviceDetection();
  const { user } = useAuth();

  // Use appropriate hooks based on authentication status
  const cookieMoodData = useMoodData();
  const supabaseMoodData = useMoodDataSupabase();
  const cookieJournal = useJournal();
  const supabaseJournal = useJournalSupabase();
  
  const moodData = user ? supabaseMoodData : cookieMoodData;
  const journalData = user ? supabaseJournal : cookieJournal;

  useEffect(() => {
    const hasSeenIntro = getCookie('zenith-intro-seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  useEffect(() => {
    const checkMoodPrompt = () => {
      const lastPrompt = getCookie('zenith-last-mood-prompt');
      const now = Date.now();
      const sixHours = 6 * 60 * 60 * 1000;
      
      if (!lastPrompt || (now - parseInt(lastPrompt)) > sixHours) {
        const timer = setTimeout(() => {
          setShowMoodPrompt(true);
        }, 10000);
        
        return () => clearTimeout(timer);
      }
    };

    if (!showIntro && currentView === 'home') {
      return checkMoodPrompt();
    }
  }, [showIntro, currentView]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setCookie('zenith-intro-seen', 'true', 8760);
  };

  const handleMoodPromptComplete = () => {
    setShowMoodPrompt(false);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleSettings = () => {
    setCurrentView('settings');
  };

  const handleBack = () => {
    setCurrentView('home');
  };

  const handleAchievements = () => {
    setCurrentView('achievements');
  };

  // Get page title based on current view
  const getPageTitle = () => {
    switch (currentView) {
      case 'mindmate': return 'MindMate';
      case 'journal': return 'Journal';
      case 'meditation': return 'Meditation';
      case 'mood': return 'Mood Sanctuary';
      case 'settings': return 'Settings';
      case 'achievements': return 'Achievements';
      case 'profile': return 'Profile';
      default: return 'Zenith';
    }
  };

  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {isMobile && (
        <MobileHeader 
          title={getPageTitle()}
          showBack={currentView !== 'home'}
          onBack={currentView !== 'home' ? handleBack : undefined}
          onSettings={handleSettings}
        />
      )}

      <div className={`${isMobile ? 'pb-20 pt-16' : 'p-8'} min-h-screen`}>
        <AnimatePresence mode="wait">
          {currentView === 'mindmate' && (
            <motion.div
              key="mindmate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <MindMateEnhanced />
            </motion.div>
          )}

          {currentView === 'journal' && (
            <Journal onClose={handleBack} />
          )}

          {currentView === 'meditation' && (
            <motion.div
              key="meditation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <BreathingExerciseRevamped />
            </motion.div>
          )}

          {currentView === 'mood' && (
            <MoodSanctuary 
              isOpen={true}
              onClose={handleBack}
            />
          )}

          {currentView === 'settings' && (
            <Settings />
          )}

          {currentView === 'achievements' && (
            <Achievements />
          )}

          {currentView === 'profile' && (
            <ProfileSettings />
          )}

          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto"
            >
              <div className="text-center mb-8">
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Welcome to Zenith
                </motion.h1>
                <motion.p 
                  className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Your personal sanctuary for mental wellness, mindfulness, and emotional balance
                </motion.p>
              </div>

              {/* Quick Insights */}
              <QuickInsights entries={moodData.entries} />

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    id: 'mindmate',
                    icon: Brain,
                    title: 'MindMate',
                    description: 'AI-powered mental health companion',
                    gradient: 'from-purple-500 to-pink-500'
                  },
                  {
                    id: 'journal',
                    icon: BookOpen,
                    title: 'Daily Journal',
                    description: 'Reflect and track your thoughts',
                    gradient: 'from-blue-500 to-cyan-500'
                  },
                  {
                    id: 'meditation',
                    icon: Flower2,
                    title: 'Meditation',
                    description: 'Guided breathing and mindfulness',
                    gradient: 'from-green-500 to-teal-500'
                  },
                  {
                    id: 'mood',
                    icon: Heart,
                    title: 'Mood Sanctuary',
                    description: 'Track and understand your emotions',
                    gradient: 'from-pink-500 to-rose-500'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                  >
                    <Card 
                      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-700"
                      onClick={() => handleNavigate(feature.id)}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                      {moodData.entries.length}
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Mood Entries</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                      {journalData.entries.length}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Journal Entries</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                      {new Date().toLocaleDateString('en-US', { day: 'numeric' })}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">Today</div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="text-center"
              >
                <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Start Your Wellness Journey Today</h3>
                    <p className="mb-6 opacity-90">
                      Take a moment to check in with yourself and begin building healthier mental habits
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        onClick={() => handleNavigate('mood')}
                        className="bg-white text-purple-600 hover:bg-gray-100"
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        Track Your Mood
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => handleNavigate('journal')}
                        className="border-white text-white hover:bg-white/10"
                      >
                        <BookOpen className="h-5 w-5 mr-2" />
                        Start Journaling
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isMobile && (
        <MobileNavigation
          currentView={currentView}
          onNavigate={handleNavigate}
          onSettings={handleSettings}
          onAchievements={handleAchievements}
        />
      )}

      <MoodTracker
        showPromptOnly={showMoodPrompt}
        onPromptComplete={handleMoodPromptComplete}
      />
    </div>
  );
};

export default Index;
