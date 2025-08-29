
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Heart, BarChart3 } from 'lucide-react';
import { MoodEntry } from '@/hooks/useMoodData';

interface MoodInsightsProps {
  entries: MoodEntry[];
}

const MoodInsights: React.FC<MoodInsightsProps> = ({ entries }) => {
  const getMoodTrend = () => {
    if (entries.length < 2) return { trend: 'neutral', message: 'Track more moods to see trends' };
    
    const moodValues = {
      'distressed': 1,
      'troubled': 2,
      'melancholy': 3,
      'neutral': 4,
      'content': 5,
      'joyful': 6,
      'ecstatic': 7
    };

    const recent = entries.slice(0, 3).map(e => moodValues[e.mood as keyof typeof moodValues] || 4);
    const older = entries.slice(3, 6).map(e => moodValues[e.mood as keyof typeof moodValues] || 4);
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, val) => sum + val, 0) / older.length : recentAvg;
    
    if (recentAvg > olderAvg + 0.5) return { trend: 'improving', message: 'Your mood has been improving! 📈' };
    if (recentAvg < olderAvg - 0.5) return { trend: 'declining', message: 'Consider some self-care activities 💝' };
    return { trend: 'stable', message: 'Your mood has been stable 😌' };
  };

  const getWeeklyPattern = () => {
    const dayStats = {};
    entries.forEach(entry => {
      const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' });
      if (!dayStats[day]) dayStats[day] = { total: 0, count: 0 };
      const moodValue = {
        'distressed': 1, 'troubled': 2, 'melancholy': 3, 'neutral': 4,
        'content': 5, 'joyful': 6, 'ecstatic': 7
      }[entry.mood] || 4;
      dayStats[day].total += moodValue;
      dayStats[day].count += 1;
    });

    const bestDay = Object.keys(dayStats).reduce((best, day) => {
      const avg = dayStats[day].total / dayStats[day].count;
      const bestAvg = dayStats[best] ? dayStats[best].total / dayStats[best].count : 0;
      return avg > bestAvg ? day : best;
    }, Object.keys(dayStats)[0]);

    return bestDay || 'No pattern yet';
  };

  const getPersonalizedTip = () => {
    if (entries.length === 0) return "Start tracking your mood to get personalized insights!";
    
    const recentMoods = entries.slice(0, 5);
    const lowMoods = recentMoods.filter(e => ['distressed', 'troubled', 'melancholy'].includes(e.mood));
    
    if (lowMoods.length >= 3) {
      return "Consider trying a breathing exercise or meditation session when you're feeling low.";
    }
    
    const hasReasons = recentMoods.filter(e => e.reason && e.reason.trim()).length;
    if (hasReasons < 2) {
      return "Adding reasons to your mood entries can help you identify patterns and triggers.";
    }

    return "You're doing great with consistent mood tracking! Keep it up! 🌟";
  };

  const trend = getMoodTrend();
  const bestDay = getWeeklyPattern();
  const tip = getPersonalizedTip();

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300">{trend.message}</p>
          </CardContent>
        </Card>
      </motion.div>

      {entries.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5 text-green-600" />
                Weekly Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Your best day tends to be: <strong>{bestDay}</strong>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-5 w-5 text-purple-600" />
              Personal Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MoodInsights;
