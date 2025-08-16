
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Star, Crown, Gem } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { motion } from 'framer-motion';

interface AchievementsProps {
  onClose: () => void;
}

const Achievements: React.FC<AchievementsProps> = ({ onClose }) => {
  const { achievements, stats } = useAchievements();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="h-3 w-3" />;
      case 'rare': return <Crown className="h-3 w-3" />;
      case 'epic': return <Trophy className="h-3 w-3" />;
      case 'legendary': return <Gem className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return '🔥';
      case 'milestone': return '🎯';
      case 'exploration': return '🗺️';
      case 'wellness': return '🌿';
      default: return '⭐';
    }
  };

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, typeof achievements>);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Your Achievements
            </h1>
            <div className="w-10" />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.unlockedCount}</div>
              <div className="text-sm opacity-90">Unlocked</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <div className="text-sm opacity-90">Complete</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.rarityCount.legendary || 0}</div>
              <div className="text-sm opacity-90">Legendary</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.rarityCount.epic || 0}</div>
              <div className="text-sm opacity-90">Epic</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Motivational Message */}
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              🌟 Keep Growing with Zenith AI!
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              Every achievement unlocks new features and brings you closer to mastering your mental wellness journey. 
              Stay consistent and watch yourself transform! 💫
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.unlockedCount}/{stats.totalCount}
              </span>
            </div>
            <Progress value={stats.completionRate} className="h-3" />
          </div>

          {/* Achievement Categories */}
          <div className="space-y-6">
            {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                  <h2 className="text-xl font-bold capitalize">{category} Achievements</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryAchievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.02 }}
                      className={`relative ${achievement.isUnlocked ? '' : 'opacity-75'}`}
                    >
                      <Card className={`${achievement.isUnlocked ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : 'border-gray-200'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className={`text-2xl ${achievement.isUnlocked ? '' : 'grayscale'}`}>
                                {achievement.icon}
                              </span>
                              <div>
                                <h3 className="font-semibold text-sm">{achievement.title}</h3>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs mt-1 ${getRarityColor(achievement.rarity)}`}
                                >
                                  {getRarityIcon(achievement.rarity)}
                                  <span className="ml-1 capitalize">{achievement.rarity}</span>
                                </Badge>
                              </div>
                            </div>
                            {achievement.isUnlocked && (
                              <div className="text-green-500">
                                <Trophy className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                            {achievement.description}
                          </p>
                          
                          {achievement.progress < achievement.maxProgress && (
                            <div className="mb-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500">Progress</span>
                                <span className="text-xs text-gray-500">
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.maxProgress) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}
                          
                          {achievement.reward && achievement.isUnlocked && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              🎁 {achievement.reward}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Achievements;
