import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Brain, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useJournalSupabase } from '@/hooks/useJournalSupabase';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className }) => {
  const { user } = useAuth();
  const { entries: moodEntries } = useMoodDataSupabase();
  const { entries: journalEntries } = useJournalSupabase();
  const activityTracker = useActivityTracker();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [aiTip, setAiTip] = useState<string>('');
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

  const getMoodAnalytics = () => {
    const { start, end } = getDateRange();
    const periodEntries = moodEntries.filter(entry => 
      entry.date >= start && entry.date <= end
    );

    const moodCounts = periodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalEntries = periodEntries.length;
    const mostCommon = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return {
      totalEntries,
      moodCounts,
      mostCommon: mostCommon ? {
        mood: mostCommon[0],
        count: mostCommon[1],
        percentage: Math.round((mostCommon[1] / totalEntries) * 100)
      } : null,
      periodEntries
    };
  };

  const getUsageAnalytics = () => {
    const stats = activityTracker.getStats();
    return {
      mindMateUsage: stats.mindMateUsage,
      journalUsage: stats.journalUsage,
      moodUsage: stats.moodUsage,
      totalSessions: stats.mindMateUsage + stats.journalUsage + stats.moodUsage
    };
  };

  const generateAITip = async () => {
    if (!user || loading) return;
    
    setLoading(true);
    try {
      const { start, end } = getDateRange();
      const periodMoods = moodEntries.filter(entry => 
        entry.date >= start && entry.date <= end
      );
      const periodJournals = journalEntries.filter(entry => 
        entry.date >= start && entry.date <= end
      );

      const moodSummary = periodMoods.map(m => `${m.mood}: ${m.reason}`).join('; ');
      const journalSummary = periodJournals.map(j => j.content.substring(0, 100)).join('; ');
      
      const tipGenerationPrompt = `Based on the following user wellness data from the ${timeframe} period, provide a single, concise, and actionable wellness tip (max 20 words):

Mood Data: ${moodSummary || 'No mood entries'}
Journal Insights: ${journalSummary || 'No journal entries'}
AI Usage: ${getUsageAnalytics().mindMateUsage} sessions
Activity Level: ${getUsageAnalytics().totalSessions} total wellness interactions

Guidelines:
- Keep it positive and encouraging
- Make it actionable
- Focus on mental wellness
- Be supportive, not prescriptive
- Use encouraging emojis sparingly (max 1)`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a supportive mental wellness coach. Provide brief, actionable, and encouraging tips based on user data.'
            },
            {
              role: 'user',
              content: tipGenerationPrompt
            }
          ],
          maxTokens: 50,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tip = data.reply || 'Keep maintaining your mental wellness journey! 🌟';
      setAiTip(tip);
    } catch (error) {
      console.error('Error generating AI tip:', error);
      // Fallback tips based on timeframe
      const fallbackTips = {
        weekly: 'Focus on small daily wins - they build momentum for bigger changes! 💪',
        monthly: 'Reflect on your progress and celebrate how far you\'ve come this month! 🌟'
      };
      const fallbackTip = fallbackTips[timeframe] || 'Remember: every step forward is progress, no matter how small! ✨';
      setAiTip(fallbackTip);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && moodEntries.length > 0) {
      generateAITip();
    }
  }, [user, timeframe, moodEntries.length]);

  if (!user) return null;

  const moodAnalytics = getMoodAnalytics();
  const usageAnalytics = getUsageAnalytics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 ${className}`}
    >
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Wellness Analytics
              </h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant={timeframe === 'weekly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('weekly')}
                className="text-xs"
              >
                Weekly
              </Button>
              <Button
                variant={timeframe === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe('monthly')}
                className="text-xs"
              >
                Monthly
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Mood Trends */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Mood Trends</span>
              </div>
              {moodAnalytics.mostCommon ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You were <span className="font-semibold text-green-600">{moodAnalytics.mostCommon.percentage}% {moodAnalytics.mostCommon.mood}</span> this {timeframe.replace('ly', '')}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No mood data for this period</p>
              )}
            </div>

            {/* Usage Stats */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">AI Usage</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-purple-600">{usageAnalytics.mindMateUsage}</span> AI sessions used
              </p>
            </div>

            {/* Activity Summary */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Activity</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-blue-600">{moodAnalytics.totalEntries}</span> mood entries logged
              </p>
            </div>
          </div>

          {/* AI Tip */}
          {aiTip && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">AI Wellness Tip:</span>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{aiTip}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnalyticsDashboard;