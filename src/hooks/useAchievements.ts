
import { useMemo } from 'react';
import { useActivityTracker } from './useActivityTracker';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'milestone' | 'exploration' | 'wellness' | 'special' | 'easter-egg';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  reward?: string;
  isEasterEgg?: boolean;
  hidden?: boolean;
}

export const useAchievements = () => {
  const { activities } = useActivityTracker();

  // Check for easter egg conditions
  const checkTimeBasedEasterEgg = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // Night Owl: Using app between 2-4 AM
    return (hours >= 2 && hours < 4) && activities.totalDaysUsed > 0;
  };

  const checkSequentialEasterEgg = () => {
    // Perfect Balance: Use MindMate, Journal, Mood, and Meditation all in the same day
    const today = new Date().toDateString();
    return activities.lastMindMateUse === today && 
           activities.lastJournalUse === today && 
           activities.lastMoodTrack === today && 
           activities.lastMeditationUse === today;
  };

  const checkClickCountEasterEgg = () => {
    // Secret feature: Multiple quick uses (simulated by high activity)
    return activities.mindMateStreak >= 2 && activities.journalStreak >= 2;
  };

  const achievements = useMemo<Achievement[]>(() => [
    // Streak Achievements
    {
      id: 'mindmate-3day',
      title: 'Mindful Companion',
      description: 'Use MindMate for 3 consecutive days',
      icon: '🧠',
      category: 'streak',
      rarity: 'common',
      isUnlocked: activities.mindMateStreak >= 3,
      progress: Math.min(activities.mindMateStreak, 3),
      maxProgress: 3,
      reward: 'Unlock premium conversation topics'
    },
    {
      id: 'mindmate-7day',
      title: 'Mind Master',
      description: 'Maintain a 7-day MindMate streak',
      icon: '🌟',
      category: 'streak',
      rarity: 'rare',
      isUnlocked: activities.mindMateStreak >= 7,
      progress: Math.min(activities.mindMateStreak, 7),
      maxProgress: 7,
      reward: 'Advanced AI insights enabled'
    },
    {
      id: 'mindmate-30day',
      title: 'Mental Wellness Legend',
      description: 'Use MindMate for 30 consecutive days',
      icon: '👑',
      category: 'streak',
      rarity: 'legendary',
      isUnlocked: activities.mindMateStreak >= 30,
      progress: Math.min(activities.mindMateStreak, 30),
      maxProgress: 30,
      reward: 'Legendary status & exclusive features'
    },
    {
      id: 'journal-5day',
      title: 'Reflection Warrior',
      description: 'Journal for 5 days in a row',
      icon: '✍️',
      category: 'streak',
      rarity: 'common',
      isUnlocked: activities.journalStreak >= 5,
      progress: Math.min(activities.journalStreak, 5),
      maxProgress: 5,
      reward: 'Journal prompts unlocked'
    },
    {
      id: 'journal-14day',
      title: 'Wisdom Keeper',
      description: 'Maintain a 14-day journaling streak',
      icon: '📖',
      category: 'streak',
      rarity: 'epic',
      isUnlocked: activities.journalStreak >= 14,
      progress: Math.min(activities.journalStreak, 14),
      maxProgress: 14,
      reward: 'Advanced journaling templates'
    },
    {
      id: 'mood-7day',
      title: 'Emotional Intelligence',
      description: 'Track your mood for 7 consecutive days',
      icon: '💝',
      category: 'streak',
      rarity: 'rare',
      isUnlocked: activities.moodStreak >= 7,
      progress: Math.min(activities.moodStreak, 7),
      maxProgress: 7,
      reward: 'Detailed mood analytics'
    },
    {
      id: 'mood-21day',
      title: 'Emotion Master',
      description: 'Track your mood for 21 consecutive days',
      icon: '🎭',
      category: 'streak',
      rarity: 'epic',
      isUnlocked: activities.moodStreak >= 21,
      progress: Math.min(activities.moodStreak, 21),
      maxProgress: 21,
      reward: 'Emotion pattern insights'
    },
    {
      id: 'meditation-3day',
      title: 'Inner Peace Seeker',
      description: 'Meditate for 3 days straight',
      icon: '🧘',
      category: 'wellness',
      rarity: 'common',
      isUnlocked: activities.meditationStreak >= 3,
      progress: Math.min(activities.meditationStreak, 3),
      maxProgress: 3,
      reward: 'Extended meditation sessions'
    },
    {
      id: 'meditation-10day',
      title: 'Zen Master',
      description: 'Meditate for 10 consecutive days',
      icon: '☯️',
      category: 'wellness',
      rarity: 'rare',
      isUnlocked: activities.meditationStreak >= 10,
      progress: Math.min(activities.meditationStreak, 10),
      maxProgress: 10,
      reward: 'Advanced meditation techniques'
    },
    
    // Milestone Achievements
    {
      id: 'first-week',
      title: 'Welcome to Zenith',
      description: 'Complete your first week with Zenith AI',
      icon: '🎉',
      category: 'milestone',
      rarity: 'common',
      isUnlocked: activities.totalDaysUsed >= 7,
      progress: Math.min(activities.totalDaysUsed, 7),
      maxProgress: 7,
      reward: 'Special welcome badge'
    },
    {
      id: 'month-warrior',
      title: 'Zenith Champion',
      description: 'Use Zenith AI for 30 days',
      icon: '🏆',
      category: 'milestone',
      rarity: 'epic',
      isUnlocked: activities.totalDaysUsed >= 30,
      progress: Math.min(activities.totalDaysUsed, 30),
      maxProgress: 30,
      reward: 'Champion status & exclusive features'
    },
    {
      id: 'hundred-days',
      title: 'Centurion',
      description: 'Reach 100 days of wellness journey',
      icon: '💯',
      category: 'milestone',
      rarity: 'legendary',
      isUnlocked: activities.totalDaysUsed >= 100,
      progress: Math.min(activities.totalDaysUsed, 100),
      maxProgress: 100,
      reward: 'Legendary centurion badge'
    },
    
    // Exploration Achievements
    {
      id: 'feature-explorer',
      title: 'Feature Explorer',
      description: 'Try 3 different Zenith features',
      icon: '🗺️',
      category: 'exploration',
      rarity: 'common',
      isUnlocked: activities.featuresUnlocked.length >= 3,
      progress: Math.min(activities.featuresUnlocked.length, 3),
      maxProgress: 3,
      reward: 'Explorer badge'
    },
    {
      id: 'wellness-master',
      title: 'Wellness Master',
      description: 'Master all Zenith AI features',
      icon: '🌟',
      category: 'exploration',
      rarity: 'legendary',
      isUnlocked: activities.featuresUnlocked.length >= 5,
      progress: Math.min(activities.featuresUnlocked.length, 5),
      maxProgress: 5,
      reward: 'Master status & all premium features'
    },
    
    // Wellness Achievements
    {
      id: 'self-care-advocate',
      title: 'Self-Care Advocate',
      description: 'Use both MindMate and Journal in the same day',
      icon: '💚',
      category: 'wellness',
      rarity: 'rare',
      isUnlocked: activities.lastMindMateUse === activities.lastJournalUse && activities.lastMindMateUse !== null,
      progress: (activities.lastMindMateUse === activities.lastJournalUse && activities.lastMindMateUse !== null) ? 1 : 0,
      maxProgress: 1,
      reward: 'Wellness combo bonus'
    },
    {
      id: 'mindfulness-guru',
      title: 'Mindfulness Guru',
      description: 'Complete meditation and mood tracking on the same day',
      icon: '🌸',
      category: 'wellness',
      rarity: 'epic',
      isUnlocked: activities.lastMeditationUse === activities.lastMoodTrack && activities.lastMeditationUse !== null,
      progress: (activities.lastMeditationUse === activities.lastMoodTrack && activities.lastMeditationUse !== null) ? 1 : 0,
      maxProgress: 1,
      reward: 'Guru status & advanced techniques'
    },
    {
      id: 'wellness-perfectionist',
      title: 'Wellness Perfectionist',
      description: 'Use all features in a single day',
      icon: '✨',
      category: 'wellness',
      rarity: 'legendary',
      isUnlocked: checkSequentialEasterEgg(),
      progress: checkSequentialEasterEgg() ? 1 : 0,
      maxProgress: 1,
      reward: 'Perfect day achievement & bonus features'
    },

    // Special Achievements
    {
      id: 'consistent-climber',
      title: 'Consistent Climber',
      description: 'Maintain any 2-week streak',
      icon: '⛰️',
      category: 'special',
      rarity: 'rare',
      isUnlocked: Math.max(activities.mindMateStreak, activities.journalStreak, activities.moodStreak, activities.meditationStreak) >= 14,
      progress: Math.min(Math.max(activities.mindMateStreak, activities.journalStreak, activities.moodStreak, activities.meditationStreak), 14),
      maxProgress: 14,
      reward: 'Consistency master badge'
    },
    {
      id: 'renaissance-soul',
      title: 'Renaissance Soul',
      description: 'Achieve 5+ day streaks in at least 3 different features',
      icon: '🎨',
      category: 'special',
      rarity: 'epic',
      isUnlocked: [activities.mindMateStreak, activities.journalStreak, activities.moodStreak, activities.meditationStreak].filter(streak => streak >= 5).length >= 3,
      progress: [activities.mindMateStreak, activities.journalStreak, activities.moodStreak, activities.meditationStreak].filter(streak => streak >= 5).length,
      maxProgress: 3,
      reward: 'Renaissance achievement & creative bonuses'
    },

    // Easter Egg Achievements (Hidden)
    {
      id: 'night-owl',
      title: 'Night Owl',
      description: 'Use Zenith AI between 2-4 AM',
      icon: '🦉',
      category: 'easter-egg',
      rarity: 'rare',
      isUnlocked: checkTimeBasedEasterEgg(),
      progress: checkTimeBasedEasterEgg() ? 1 : 0,
      maxProgress: 1,
      reward: 'Night mode themes unlocked',
      isEasterEgg: true,
      hidden: !checkTimeBasedEasterEgg()
    },
    {
      id: 'secret-keeper',
      title: 'Secret Keeper',
      description: 'Discovered a hidden achievement!',
      icon: '🤫',
      category: 'easter-egg',
      rarity: 'epic',
      isUnlocked: checkClickCountEasterEgg(),
      progress: checkClickCountEasterEgg() ? 1 : 0,
      maxProgress: 1,
      reward: 'Secret features unlocked',
      isEasterEgg: true,
      hidden: !checkClickCountEasterEgg()
    },
    {
      id: 'time-traveler',
      title: 'Time Traveler',
      description: 'Use Zenith AI on your birthday (simulated)',
      icon: '🎂',
      category: 'easter-egg',
      rarity: 'legendary',
      isUnlocked: new Date().getDate() === 1 && activities.totalDaysUsed > 0, // Simulated - triggers on 1st of any month
      progress: (new Date().getDate() === 1 && activities.totalDaysUsed > 0) ? 1 : 0,
      maxProgress: 1,
      reward: 'Birthday surprise features',
      isEasterEgg: true,
      hidden: !(new Date().getDate() === 1 && activities.totalDaysUsed > 0)
    }
  ], [activities]);

  const stats = useMemo(() => {
    const visibleAchievements = achievements.filter(a => !a.hidden);
    const unlockedCount = visibleAchievements.filter(a => a.isUnlocked).length;
    const totalCount = visibleAchievements.length;
    const completionRate = Math.round((unlockedCount / totalCount) * 100);
    
    const rarityCount = achievements.reduce((acc, achievement) => {
      if (achievement.isUnlocked) {
        acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const easterEggCount = achievements.filter(a => a.isEasterEgg && a.isUnlocked).length;

    return {
      unlockedCount,
      totalCount,
      completionRate,
      rarityCount,
      easterEggCount
    };
  }, [achievements]);

  // Get newly unlocked achievements
  const getNewlyUnlocked = () => {
    return achievements.filter(a => a.isUnlocked && !a.hidden);
  };

  return {
    achievements: achievements.filter(a => !a.hidden),
    allAchievements: achievements,
    stats,
    getNewlyUnlocked
  };
};
