import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Settings as SettingsIcon, Wind, Heart, Brain, Flower2, ArrowLeft, BookOpen, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MindMateWithVerification from '@/components/MindMateWithVerification';
import CharactersChat from '@/components/CharactersChat';
import OnboardingForm from '@/components/OnboardingForm';
import SongMenu from '@/components/SongMenu';
import CompactSidebar from '@/components/CompactSidebar';
import Settings from '@/components/Settings';
import MoodTracker from '@/components/MoodTracker';
import MeditationTimer from '@/components/MeditationTimer';
import Journal from '@/components/Journal';
import MobileNavigation from '@/components/navigation/MobileNavigation';
import MobileHeader from '@/components/navigation/MobileHeader';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '@/utils/cookieUtils';
import EventsMenu from '@/components/events/EventsMenu';
import Achievements from '@/components/achievements/Achievements';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import AchievementNotification from '@/components/achievements/AchievementNotification';
import { useAchievements } from '@/hooks/useAchievements';
import { useMoodPromptFrequency } from '@/hooks/useMoodPromptFrequency';
import { useSyncData } from '@/hooks/useSyncData';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { SleepPrompt } from './sleep/SleepPrompt';
import { useSleepProfile } from '@/hooks/useSleepProfile';

const ChatInterface = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [activeChatbot, setActiveChatbot] = useState<'mindmate' | 'characters' | 'meditation' | 'journal' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMoodPrompt, setShowMoodPrompt] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [newAchievement, setNewAchievement] = useState<any>(null);
  const [showSleepPrompt, setShowSleepPrompt] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { hasProfile, profile } = useProfile();
  const { profile: sleepProfile, loading: sleepProfileLoading } = useSleepProfile();
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  const navigate = useNavigate();
  const { trackActivity } = useActivityTracker();
  const { getNewlyUnlocked } = useAchievements();
  const { shouldShowPrompt, recordPromptShown, recordPromptDismissed } = useMoodPromptFrequency();
  const { isSyncing } = useSyncData();

  // Use mobile interface for mobile devices, desktop for tablets in landscape and desktop
  const useMobileInterface = isMobile && !isDesktop;

  // Create the missing handleNavigateToMindMate function
  const handleNavigateToMindMate = (autoPrompt?: string) => {
    handleNavigation('mindmate', autoPrompt);
  };

  // Check for new achievements
  useEffect(() => {
    const checkForNewAchievements = () => {
      const newlyUnlocked = getNewlyUnlocked();
      const lastChecked = localStorage.getItem('zenith-last-achievement-check');
      const currentUnlocked = newlyUnlocked.map(a => a.id).join(',');
      
      if (lastChecked !== currentUnlocked && newlyUnlocked.length > 0) {
        const newest = newlyUnlocked[newlyUnlocked.length - 1];
        setNewAchievement(newest);
        localStorage.setItem('zenith-last-achievement-check', currentUnlocked);
      }
    };

    if (hasProfile) {
      checkForNewAchievements();
    }
  }, [hasProfile, getNewlyUnlocked]);

  // Check if user needs sleep profile setup
  useEffect(() => {
    if (!user || !hasProfile || sleepProfileLoading) return;
    
    if (profile && !sleepProfile) {
      // Existing user without sleep profile - show prompt after a delay
      const timer = setTimeout(() => {
        setShowSleepPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, profile, sleepProfile, hasProfile, sleepProfileLoading]);

  // Check for mood prompt
  useEffect(() => {
    if (hasProfile) {
      const lastPrompt = getCookie('zenith-last-mood-prompt');
      const now = Date.now();
      const fourHours = 4 * 60 * 60 * 1000;
      
      if (!lastPrompt || (now - parseInt(lastPrompt)) >= fourHours) {
        const timer = setTimeout(() => setShowMoodPrompt(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [hasProfile]);

  // Wait for intro animation then show options
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show onboarding if user doesn't have profile yet
  if (isAuthenticated && !hasProfile) {
    return <OnboardingForm onComplete={() => {}} />;
  }

  // Handle navigation with activity tracking
  const handleNavigation = (destination: string, autoPrompt?: string) => {
    if (destination === 'home') {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveChatbot(null);
        setIsTransitioning(false);
      }, 300);
    } else if (destination === 'mindmate') {
      trackActivity('mindmate');
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveChatbot('mindmate');
        setIsTransitioning(false);
        if (autoPrompt) {
          localStorage.setItem('zenith-auto-prompt', autoPrompt);
        }
      }, 300);
    } else if (destination === 'characters') {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveChatbot('characters');
        setIsTransitioning(false);
      }, 300);
    } else if (destination === 'meditation') {
      trackActivity('meditation');
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveChatbot('meditation');
        setIsTransitioning(false);
      }, 300);
    } else if (destination === 'journal') {
      trackActivity('journal');
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveChatbot('journal');
        setIsTransitioning(false);
      }, 300);
    } else if (destination === 'sleep') {
      trackActivity('sleep');
      navigate('/sleep-tracking');
    } else if (destination === 'mood') {
      trackActivity('mood');
      navigate('/mood-tracking');
    } else if (destination === 'breathing') {
      trackActivity('breathing');
      navigate('/breathing-exercises');
    } else if (destination === 'music') {
      navigate('/soothing-music');
    } else if (destination === 'achievements') {
      setShowAchievements(true);
    }
  };

  // Mobile Journal View
  if (activeChatbot === 'journal' && useMobileInterface) {
    return (
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key="journal-mobile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900"
          >
            <MobileHeader
              title="Daily Journal"
              showBack
              onBack={() => setActiveChatbot(null)}
              onSettings={() => setShowSettings(true)}
            />
            <div className="pb-16">
              <Journal onClose={() => setActiveChatbot(null)} />
            </div>
            <MobileNavigation
              currentView="journal"
              onNavigate={handleNavigation}
              onSettings={() => setShowSettings(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Journal View
  if (activeChatbot === 'journal') {
    return (
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key="journal"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative min-h-screen overflow-hidden"
          >
            <Journal onClose={() => setActiveChatbot(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Mobile MindMate View
  if (activeChatbot === 'mindmate' && useMobileInterface) {
    return (
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key="mindmate-mobile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900"
          >
            <MobileHeader
              title="MindMate"
              showBack
              onBack={() => setActiveChatbot(null)}
              onSettings={() => setShowSettings(true)}
            />
            <div className="pb-16">
              <MindMateWithVerification profile={profile} onBack={() => setActiveChatbot(null)} />
            </div>
            <MobileNavigation
              currentView="mindmate"
              onNavigate={handleNavigation}
              onSettings={() => setShowSettings(true)}
            />
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop MindMate View
  if (activeChatbot === 'mindmate') {
    return (
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key="mindmate"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative min-h-screen overflow-hidden"
          >
            <CompactSidebar 
              onNavigate={handleNavigation}
              onSettings={() => setShowSettings(true)}
            />
            <div className="ml-16 md:ml-20 min-h-screen">
              <MindMateWithVerification profile={profile} onBack={() => setActiveChatbot(null)} />
            </div>
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Mobile Characters View
  if (activeChatbot === 'characters' && useMobileInterface) {
    return (
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key="characters-mobile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900"
          >
            <MobileHeader
              title="Characters Chat"
              showBack
              onBack={() => setActiveChatbot(null)}
              onSettings={() => setShowSettings(true)}
            />
            <div className="pb-16">
              <CharactersChat onBack={() => setActiveChatbot(null)} />
            </div>
            <MobileNavigation
              currentView="characters"
              onNavigate={handleNavigation}
              onSettings={() => setShowSettings(true)}
            />
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Characters View
  if (activeChatbot === 'characters') {
    return (
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key="characters"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative min-h-screen overflow-hidden"
          >
            <CompactSidebar 
              onNavigate={handleNavigation}
              onSettings={() => setShowSettings(true)}
            />
            <div className="ml-16 md:ml-20 min-h-screen">
              <CharactersChat onBack={() => setActiveChatbot(null)} />
            </div>
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Mobile Meditation View
  if (activeChatbot === 'meditation' && useMobileInterface) {
    return (
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key="meditation-mobile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-screen bg-gradient-to-b from-zenith-softpurple to-white dark:from-gray-900 dark:to-gray-800"
          >
            <MobileHeader
              title="Meditation Center"
              showBack
              onBack={() => setActiveChatbot(null)}
              onSettings={() => setShowSettings(true)}
            />
            <div className="p-3 pb-16">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Find peace and clarity through mindfulness practice</p>
              </div>
              <MeditationTimer />
            </div>
            <MobileNavigation
              currentView="meditation"
              onNavigate={handleNavigation}
              onSettings={() => setShowSettings(true)}
            />
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Meditation View
  if (activeChatbot === 'meditation') {
    return (
      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div
            key="meditation"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative min-h-screen overflow-hidden"
          >
            <CompactSidebar 
              onNavigate={handleNavigation}
              onSettings={() => setShowSettings(true)}
            />
            <div className="ml-16 md:ml-20 min-h-screen bg-gradient-to-b from-zenith-softpurple to-white dark:from-gray-900 dark:to-gray-800">
              <div className="p-4 border-b bg-white dark:bg-gray-800">
                <Button
                  onClick={() => setActiveChatbot(null)}
                  variant="ghost"
                  className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Menu
                </Button>
              </div>
              <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
                <div className="max-w-2xl w-full">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-4">Meditation Center</h1>
                    <p className="text-gray-600 dark:text-gray-400">Find peace and clarity through mindfulness practice</p>
                  </div>
                  <MeditationTimer />
                </div>
              </div>
            </div>
            {showSettings && <Settings onClose={() => setShowSettings(false)} />}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Main Menu - Mobile View
  if (useMobileInterface) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zenith-softpurple to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <AnimatePresence mode="wait">
          {showIntro ? (
            <motion.div 
              key="intro-mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-screen text-center px-4"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <img 
                  src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png" 
                  alt="Zenith AI Logo" 
                  className="w-16 h-16 mb-3"
                />
                <h1 className="text-2xl font-bold text-zenith-darkpurple dark:text-zenith-purple mb-2">
                  Zenith AI
                </h1>
                <p className="text-base text-zenith-purple dark:text-zenith-purple">
                  Mental Wellness
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="menu-mobile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-screen pb-20"
            >
              <MobileHeader
                title={`Hey ${profile?.name}!`}
                onSettings={() => setShowSettings(true)}
              />
              
              <div className="p-3 space-y-3">
                {/* Events Menu - Compact */}
                <div className="flex justify-center mb-2">
                  <EventsMenu onNavigateToMindMate={handleNavigateToMindMate} />
                </div>

                {/* Achievements Button - Compact */}
                <Card 
                  className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 shadow-md cursor-pointer"
                  onClick={() => handleNavigation('achievements')}
                >
                  <CardContent className="p-3 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Achievements</h2>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Track your wellness journey</p>
                    </div>
                    <Badge className="bg-yellow-500 text-white text-xs px-2 py-0.5">New!</Badge>
                  </CardContent>
                </Card>

                {/* Main Features - Compact Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Card 
                    className="bg-white dark:bg-gray-800 shadow-md cursor-pointer"
                    onClick={() => handleNavigation('mindmate')}
                  >
                    <CardContent className="p-3 flex flex-col items-center text-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                        style={{ 
                          background: `linear-gradient(135deg, var(--zenith-primary), var(--zenith-secondary))` 
                        }}
                      >
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">MindMate</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">AI therapist</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-white dark:bg-gray-800 shadow-md cursor-pointer"
                    onClick={() => handleNavigation('characters')}
                  >
                    <CardContent className="p-3 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-2">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">Characters</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">AI friends</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-white dark:bg-gray-800 shadow-md cursor-pointer"
                    onClick={() => handleNavigation('journal')}
                  >
                    <CardContent className="p-3 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-2">
                        <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">Journal</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Daily reflection</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-white dark:bg-gray-800 shadow-md cursor-pointer"
                    onClick={() => handleNavigation('meditation')}
                  >
                    <CardContent className="p-3 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-2">
                        <Flower2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">Meditate</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Find peace</p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-white dark:bg-gray-800 shadow-md cursor-pointer"
                    onClick={() => handleNavigation('mood')}
                  >
                    <CardContent className="p-3 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center mb-2">
                        <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">Mood</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Track feelings</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Secondary Features - Compact */}
                <Card 
                  className="bg-white dark:bg-gray-800 shadow-md cursor-pointer"
                  onClick={() => handleNavigation('breathing')}
                >
                  <CardContent className="p-3 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Wind className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Breathing</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Relax & focus</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Music Menu - Compact */}
                <div className="flex justify-center">
                  <SongMenu />
                </div>
              </div>

              <MobileNavigation
                currentView="home"
                onNavigate={handleNavigation}
                onSettings={() => setShowSettings(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {showMoodPrompt && (
          <MoodTracker 
            showPromptOnly={true} 
            onPromptComplete={() => setShowMoodPrompt(false)} 
          />
        )}
        
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
        {showAchievements && <Achievements onClose={() => setShowAchievements(false)} />}
        
        {/* Achievement Notification */}
        <AchievementNotification 
          achievement={newAchievement} 
          onClose={() => setNewAchievement(null)} 
        />
      </div>
    );
  }

  // Main Menu - Desktop View
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zenith-softpurple to-white dark:from-gray-900 dark:to-gray-800 p-2 md:p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center px-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center mb-4"
            >
              <img 
                src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png" 
                alt="Zenith AI Logo" 
                className="w-20 h-20 md:w-24 md:h-24 mb-4"
              />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zenith-darkpurple dark:text-zenith-purple">
                Zenith AI
              </h1>
            </motion.div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg sm:text-xl md:text-2xl text-zenith-purple dark:text-zenith-purple"
            >
              Mental Wellness
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-6xl w-full px-2 md:px-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src="/lovable-uploads/44d18942-19e8-4d7b-9106-8c60ad68d16b.png" 
                  alt="Zenith AI Logo" 
                  className="w-12 h-12 md:w-16 md:h-16"
                />
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-zenith-darkpurple dark:text-zenith-purple text-center sm:text-left">
                  Hey {profile?.name}! Ready for Elite Mental Wellness<span style={{ color: 'var(--zenith-primary)' }}>?</span>
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <EventsMenu onNavigateToMindMate={handleNavigateToMindMate} />
                <Button 
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  size="icon"
                  className="shrink-0 touch-manipulation border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <SettingsIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {user && <AnalyticsDashboard />}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {/* Sleep Tracker Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800 cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => handleNavigation('sleep')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">🌙</div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">Sleep Tracker</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track your sleep patterns and get insights</p>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Achievements - Featured */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation relative overflow-hidden"
                  onClick={() => handleNavigation('achievements')}
                >
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-500 text-white text-xs">New!</Badge>
                  </div>
                  <CardContent className="p-4 md:p-6 flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-3 md:mb-4">
                      <Trophy className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Achievements</h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                      Track your progress
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* MindMate - Main Feature */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="bg-white dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation border-gray-200 dark:border-gray-700"
                  onClick={() => handleNavigation('mindmate')}
                >
                  <CardContent className="p-4 md:p-6 flex flex-col items-center">
                    <div 
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4"
                      style={{ 
                        background: `linear-gradient(135deg, var(--zenith-primary), var(--zenith-secondary))` 
                      }}
                    >
                      <Brain className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">MindMate</h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                      AI therapist
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Characters Chat */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="bg-white dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation border-gray-200 dark:border-gray-700"
                  onClick={() => handleNavigation('characters')}
                >
                  <CardContent className="p-4 md:p-6 flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-3 md:mb-4">
                      <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Characters</h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                      AI companions
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="bg-white dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation border-gray-200 dark:border-gray-700"
                  onClick={() => handleNavigation('journal')}
                >
                  <CardContent className="p-4 md:p-6 flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-3 md:mb-4">
                      <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Daily Journal</h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                      Track your journey
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="bg-white dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation border-gray-200 dark:border-gray-700"
                  onClick={() => handleNavigation('meditation')}
                >
                  <CardContent className="p-4 md:p-6 flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-3 md:mb-4">
                      <Flower2 className="h-6 w-6 md:h-8 md:w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Meditation</h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                      Mindfulness timer
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card 
                  className="bg-white dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation border-gray-200 dark:border-gray-700"
                  onClick={() => handleNavigation('mood')}
                >
                  <CardContent className="p-4 md:p-6 flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center mb-3 md:mb-4">
                      <Heart className="h-6 w-6 md:h-8 md:w-8 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Mood Tracking</h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                      Track emotions
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="mt-8 flex justify-center">
              <SongMenu />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mood Prompt */}
      {showMoodPrompt && (
        <MoodTracker 
          showPromptOnly={true} 
          onPromptComplete={() => setShowMoodPrompt(false)} 
        />
      )}
      
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showAchievements && <Achievements onClose={() => setShowAchievements(false)} />}
      
      {/* Achievement Notification */}
      <AchievementNotification 
        achievement={newAchievement} 
        onClose={() => setNewAchievement(null)} 
      />
    </div>
  );
};

export default ChatInterface;
