import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useMoodDataSupabase } from './useMoodDataSupabase';
import { useJournalSupabase } from './useJournalSupabase';
import { useActivityTracker } from './useActivityTracker';

export interface AnalyticsData {
  moodTrends: {
    totalEntries: number;
    mostCommonMood: string | null;
    moodDistribution: Record<string, number>;
    averageMoodScore: number;
  };
  usageStats: {
    mindMateUsage: number;
    journalUsage: number;
    moodUsage: number;
    totalSessions: number;
    streakDays: number;
  };
  insights: {
    improvementAreas: string[];
    positivePatterns: string[];
    recommendations: string[];
  };
}

export const useAnalytics = (timeframe: 'weekly' | 'monthly' = 'weekly') => {
  const { user } = useAuth();
  const { entries: moodEntries } = useMoodDataSupabase();
  const { entries: journalEntries } = useJournalSupabase();
  const activityTracker = useActivityTracker();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const getDateRange = () => {
    const now = new Date();
    const start = new Date();
    
    if (timeframe === 'weekly') {
      start.setDate(now.getDate() - 7);
    } else {
      start.setMonth(now.getMonth() - 1);
    }
    
    return {
      start: start.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    };
  };

  const calculateMoodScore = (mood: string): number => {
    const moodScores: Record<string, number> = {
      'very-happy': 5,
      'happy': 4,
      'neutral': 3,
      'sad': 2,
      'very-sad': 1,
      'excited': 5,
      'calm': 4,
      'anxious': 2,
      'stressed': 1,
      'grateful': 5,
      'content': 4,
      'overwhelmed': 1,
      'peaceful': 5,
      'energetic': 4,
      'tired': 2,
      'frustrated': 1,
      'hopeful': 4,
      'lonely': 2,
      'confident': 5,
      'worried': 2
    };
    return moodScores[mood] || 3;
  };

  const generateAnalytics = () => {
    if (!user || moodEntries.length === 0) return null;

    const { start, end } = getDateRange();
    const periodMoods = moodEntries.filter(entry => 
      entry.date >= start && entry.date <= end
    );
    const periodJournals = journalEntries.filter(entry => 
      entry.date >= start && entry.date <= end
    );

    // Mood Trends
    const moodCounts = periodMoods.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;

    const averageMoodScore = periodMoods.length > 0 
      ? periodMoods.reduce((sum, entry) => sum + calculateMoodScore(entry.mood), 0) / periodMoods.length
      : 0;

    // Usage Stats
    const stats = activityTracker.getStats();
    const totalSessions = stats.mindMateUsage + stats.journalUsage + stats.moodUsage;

    // Calculate streak days
    const uniqueDates = new Set([...periodMoods.map(m => m.date), ...periodJournals.map(j => j.date)]);
    const streakDays = uniqueDates.size;

    // Generate insights
    const insights = generateInsights(periodMoods, periodJournals, averageMoodScore, streakDays);

    return {
      moodTrends: {
        totalEntries: periodMoods.length,
        mostCommonMood,
        moodDistribution: moodCounts,
        averageMoodScore
      },
      usageStats: {
        mindMateUsage: stats.mindMateUsage,
        journalUsage: stats.journalUsage,
        moodUsage: stats.moodUsage,
        totalSessions,
        streakDays
      },
      insights
    };
  };

  const generateInsights = (moods: any[], journals: any[], avgMoodScore: number, streakDays: number) => {
    const insights = {
      improvementAreas: [] as string[],
      positivePatterns: [] as string[],
      recommendations: [] as string[]
    };

    // Analyze mood patterns
    if (avgMoodScore < 3) {
      insights.improvementAreas.push('Mood levels have been lower than usual');
      insights.recommendations.push('Consider reaching out to friends or practicing mindfulness');
    } else if (avgMoodScore > 4) {
      insights.positivePatterns.push('Maintaining excellent mood levels');
    }

    // Analyze consistency
    if (streakDays >= 5) {
      insights.positivePatterns.push('Great consistency in tracking your wellness');
    } else {
      insights.improvementAreas.push('Could benefit from more consistent tracking');
      insights.recommendations.push('Try setting daily reminders to check in with yourself');
    }

    // Analyze journaling
    if (journals.length === 0) {
      insights.improvementAreas.push('No journaling activity detected');
      insights.recommendations.push('Journaling can help process thoughts and emotions');
    } else if (journals.length > 3) {
      insights.positivePatterns.push('Active journaling practice shows self-reflection');
    }

    return insights;
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      const data = generateAnalytics();
      setAnalyticsData(data);
      setLoading(false);
    }
  }, [user, moodEntries, journalEntries, timeframe]);

  return {
    analyticsData,
    loading,
    refreshAnalytics: () => {
      if (user) {
        const data = generateAnalytics();
        setAnalyticsData(data);
      }
    }
  };
};