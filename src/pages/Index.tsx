
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IntroAnimation from '@/components/IntroAnimation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Trophy, Calendar, Target } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import AchievementNotification from '@/components/achievements/AchievementNotification';

const Index = () => {
  const navigate = useNavigate();
  const [newAchievements, setNewAchievements] = useState<any[]>([]);
  const { achievements } = useAchievements();

  // Check for newly unlocked achievements
  useEffect(() => {
    const unlockedAchievements = achievements.filter(a => a.isUnlocked);
    setNewAchievements(unlockedAchievements.slice(0, 1)); // Show only the latest
  }, [achievements]);

  const clearNewAchievements = () => {
    setNewAchievements([]);
  };

  return (
    <>
      {/* Simple Landing Page */}
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
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
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Your personal wellness companion powered by artificial intelligence. 
              Start your journey and access your dashboard.
            </p>

            <Button
              onClick={() => navigate('/chat')}
              className="bg-gradient-to-r from-zenith-purple to-zenith-darkpurple text-white px-8 py-6 text-lg rounded-xl hover:opacity-90 transition-all"
            >
              Open Dashboard
            </Button>
          </motion.div>

          {/* Quick Stats (optional) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
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
