
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IntroAnimation from '@/components/IntroAnimation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, Heart, Music, Sparkles, Wind, Activity as MeditationIcon, Trophy, Calendar, Target } from 'lucide-react';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useAchievements } from '@/hooks/useAchievements';
import AchievementNotification from '@/components/achievements/AchievementNotification';

const Index = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(false);
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const { trackActivity } = useActivityTracker();
  const { achievements } = useAchievements();

  // Check for newly unlocked achievements
  useEffect(() => {
    const unlockedAchievements = achievements.filter(a => a.isUnlocked);
    setNewAchievements(unlockedAchievements.slice(0, 1)); // Show only the latest
  }, [achievements]);

  const features = [
    {
      id: 'mindmate',
      title: 'MindMate',
      description: 'Chat with your AI companion for emotional support and guidance',
      icon: Brain,
      gradient: 'from-zenith-purple to-zenith-darkpurple',
      path: '/mind-mate',
      color: 'text-zenith-purple'
    },
    {
      id: 'journal',
      title: 'Journal',
      description: 'Reflect on your thoughts and track your personal growth',
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-700',
      path: '/journal',
      color: 'text-blue-600'
    },
    {
      id: 'mood',
      title: 'Mood Tracking',
      description: 'Monitor your emotional wellness with elegant mood tracking',
      icon: Heart,
      gradient: 'from-pink-500 to-rose-600',
      path: '/mood-tracking',
      color: 'text-pink-600'
    },
    {
      id: 'meditation',
      title: 'Meditation',
      description: 'Find inner peace with guided meditation sessions',
      icon: MeditationIcon,
      gradient: 'from-green-500 to-emerald-600',
      path: '/meditation',
      color: 'text-green-600'
    },
    {
      id: 'breathing',
      title: 'Breathing Exercises',
      description: 'Transform your state with elegant breathing techniques',
      icon: Wind,
      gradient: 'from-cyan-500 to-blue-600',
      path: '/breathing-exercises',
      color: 'text-cyan-600'
    },
    {
      id: 'music',
      title: 'Soothing Music',
      description: 'Relax with curated ambient sounds and peaceful melodies',
      icon: Music,
      gradient: 'from-purple-500 to-indigo-600',
      path: '/music',
      color: 'text-purple-600'
    }
  ];

  const handleFeatureClick = (feature: any) => {
    trackActivity(feature.id as any);
    navigate(feature.path);
  };

  const clearNewAchievements = () => {
    setNewAchievements([]);
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-12 w-12 text-zenith-purple" />
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-zenith-purple via-zenith-darkpurple to-zenith-purple bg-clip-text text-transparent">
                Zenith AI
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Your personal wellness companion powered by artificial intelligence. 
              Discover inner peace, track your growth, and unlock your potential.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-zenith-purple/50 dark:hover:border-zenith-purple/50">
                  <CardContent className="p-8 h-full flex flex-col">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className={`text-2xl font-bold mb-3 ${feature.color} group-hover:text-zenith-purple transition-colors`}>
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                      {feature.description}
                    </p>
                    
                    <Button
                      onClick={() => handleFeatureClick(feature)}
                      className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 text-white font-medium py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg`}
                    >
                      Explore {feature.title}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-zenith-softpurple to-white dark:from-zenith-darkpurple/20 dark:to-gray-800">
              <CardContent className="p-6 text-center">
                <Trophy className="h-8 w-8 text-zenith-purple mx-auto mb-3" />
                <div className="text-2xl font-bold text-zenith-darkpurple dark:text-zenith-purple mb-1">
                  {achievements.filter(a => a.isUnlocked).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Achievements Unlocked</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-100 to-white dark:from-blue-900/20 dark:to-gray-800">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-1">
                  Today
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Start Your Journey</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-100 to-white dark:from-green-900/20 dark:to-gray-800">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-700 dark:text-green-400 mb-1">
                  Grow
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Personal Development</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      
      {/* Achievement Notifications */}
      {newAchievements.map((achievement, index) => (
        <AchievementNotification
          key={`${achievement.id}-${index}`}
          achievement={achievement}
          onClose={clearNewAchievements}
        />
      ))}
    </>
  );
};

export default Index;
