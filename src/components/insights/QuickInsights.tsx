
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Calendar, Clock, Target } from 'lucide-react';
import { MoodEntry } from '@/hooks/useMoodData';
import { JournalEntry } from '@/hooks/useJournal';

interface QuickInsightsProps {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
}

const QuickInsights: React.FC<QuickInsightsProps> = ({ moodEntries, journalEntries }) => {
  const getConsistencyStreak = () => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasMood = moodEntries.some(entry => entry.date === dateStr);
      const hasJournal = journalEntries.some(entry => entry.date === dateStr);
      
      if (hasMood || hasJournal) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getWeeklyActivity = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyMoods = moodEntries.filter(entry => new Date(entry.date) >= weekAgo);
    const weeklyJournals = journalEntries.filter(entry => new Date(entry.date) >= weekAgo);
    
    return weeklyMoods.length + weeklyJournals.length;
  };

  const getBestTimeOfDay = () => {
    const timeStats = moodEntries.reduce((acc, entry) => {
      if (!entry.time) return acc;
      
      const hour = parseInt(entry.time.split(':')[0]);
      const period = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      
      const moodValue = {
        'distressed': 1, 'troubled': 2, 'melancholy': 3, 'neutral': 4,
        'content': 5, 'joyful': 6, 'ecstatic': 7
      }[entry.mood] || 4;
      
      if (!acc[period]) acc[period] = { total: 0, count: 0 };
      acc[period].total += moodValue;
      acc[period].count += 1;
      
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const bestPeriod = Object.keys(timeStats).reduce((best, period) => {
      const avg = timeStats[period].total / timeStats[period].count;
      const bestAvg = timeStats[best] ? timeStats[best].total / timeStats[best].count : 0;
      return avg > bestAvg ? period : best;
    }, Object.keys(timeStats)[0]);

    return bestPeriod || 'Not enough data';
  };

  const streak = getConsistencyStreak();
  const weeklyActivity = getWeeklyActivity();
  const bestTime = getBestTimeOfDay();

  const insights = [
    {
      icon: Calendar,
      label: 'Current Streak',
      value: `${streak} day${streak !== 1 ? 's' : ''}`,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: TrendingUp,
      label: 'Week Activity',
      value: `${weeklyActivity} entries`,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: Clock,
      label: 'Best Time',
      value: bestTime,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {insights.map((insight, index) => (
        <motion.div
          key={insight.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className={`${insight.bg} border-0`}>
            <CardContent className="p-4 text-center">
              <insight.icon className={`h-5 w-5 ${insight.color} mx-auto mb-2`} />
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {insight.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {insight.label}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickInsights;
