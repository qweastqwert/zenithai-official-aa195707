import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Brain, Activity, Flame, BookOpen, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useJournalSupabase } from '@/hooks/useJournalSupabase';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { supabase } from '@/integrations/supabase/client';
import { extractTip } from '@/utils/sanitizeAI';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className }) => {
  const { user } = useAuth();
  const { entries: moodEntries } = useMoodDataSupabase();
  const { entries: journalEntries } = useJournalSupabase();
  const activityTracker = useActivityTracker();
  const isMobile = useIsMobile();
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
      totalSessions: stats.mindMateUsage + stats.journalUsage + stats.moodUsage,
      totalDaysUsed: stats.totalDaysUsed || 0,
    };
  };

  // Build a richer breakdown of mood data for the period
  const getMoodBreakdown = () => {
    const { start, end } = getDateRange();
    const periodEntries = moodEntries.filter(e => e.date >= start && e.date <= end);
    const periodJournals = journalEntries.filter(j => j.date >= start && j.date <= end);

    // Mood positivity score (1-5 mapping)
    const moodScores: Record<string, number> = {
      'very-happy': 5, happy: 4, excited: 5, grateful: 5, peaceful: 5, confident: 5,
      calm: 4, content: 4, energetic: 4, hopeful: 4,
      neutral: 3,
      sad: 2, anxious: 2, tired: 2, lonely: 2, worried: 2,
      'very-sad': 1, stressed: 1, overwhelmed: 1, frustrated: 1,
    };
    const scored = periodEntries
      .map(e => moodScores[e.mood] ?? 3);
    const avgScore = scored.length ? scored.reduce((a, b) => a + b, 0) / scored.length : 0;
    const positivePct = scored.length
      ? Math.round((scored.filter(s => s >= 4).length / scored.length) * 100)
      : 0;
    const lowPct = scored.length
      ? Math.round((scored.filter(s => s <= 2).length / scored.length) * 100)
      : 0;

    // Unique active days (mood OR journal entry)
    const uniqueDays = new Set([
      ...periodEntries.map(e => e.date),
      ...periodJournals.map(j => j.date),
    ]).size;

    return {
      avgScore,
      positivePct,
      lowPct,
      journalCount: periodJournals.length,
      uniqueDays,
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
      
      const tipGenerationPrompt = `User wellness data (${timeframe}): Mood: ${moodSummary || 'None'}. Journal: ${journalSummary || 'None'}. AI Usage: ${getUsageAnalytics().mindMateUsage}. Activity: ${getUsageAnalytics().totalSessions}.

Reply with ONLY the tip text. No reasoning, no bullet points, no headings, no formatting, no thinking. Just one sentence, max 20 words, with at most 1 emoji.`;

      const response = await supabase.functions.invoke('mindmate-chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: 'Output ONLY a single wellness tip sentence. No explanations, no formatting, no reasoning, no lists. Just the tip itself in one line.'
            },
            {
              role: 'user',
              content: tipGenerationPrompt
            }
          ],
          maxTokens: 100,
          temperature: 0.7,
        }
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const data = response.data;
      const raw = data.reply || 'Keep maintaining your mental wellness journey! 🌟';
      setAiTip(extractTip(raw));
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

  const tipGeneratedRef = React.useRef<string>('');

  useEffect(() => {
    const key = `${timeframe}-${moodEntries.length}`;
    if (user && moodEntries.length > 0 && tipGeneratedRef.current !== key) {
      tipGeneratedRef.current = key;
      generateAITip();
    }
  }, [user, timeframe, moodEntries.length]);

  if (!user) return null;

  const moodAnalytics = getMoodAnalytics();
  const usageAnalytics = getUsageAnalytics();
  const breakdown = getMoodBreakdown();
  const periodLabel = timeframe === 'weekly' ? 'this week' : 'this month';
  const periodDays = timeframe === 'weekly' ? 7 : 30;

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-3 ${className}`}
      >
        <div className="px-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Analytics</h3>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setTimeframe('weekly')}
                className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                  timeframe === 'weekly' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                  timeframe === 'monthly' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Compact horizontal stats */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-card rounded-lg px-3 py-2 border border-border">
              <div className="flex items-center gap-1.5">
                <Heart className="h-3 w-3 text-pink-500" />
                <span className="text-[10px] text-muted-foreground">Avg mood</span>
              </div>
              <p className="text-xs font-semibold mt-0.5">
                {breakdown.avgScore ? `${breakdown.avgScore.toFixed(1)}/5` : '—'}
                <span className="text-[10px] text-muted-foreground ml-1">{breakdown.positivePct}% positive</span>
              </p>
            </div>
            <div className="bg-card rounded-lg px-3 py-2 border border-border">
              <div className="flex items-center gap-1.5">
                <Flame className="h-3 w-3 text-orange-500" />
                <span className="text-[10px] text-muted-foreground">Active days</span>
              </div>
              <p className="text-xs font-semibold mt-0.5">
                {breakdown.uniqueDays}/{periodDays}
              </p>
            </div>
            <div className="bg-card rounded-lg px-3 py-2 border border-border">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-blue-500" />
                <span className="text-[10px] text-muted-foreground">Mood logs</span>
              </div>
              <p className="text-xs font-semibold mt-0.5">{moodAnalytics.totalEntries}</p>
            </div>
            <div className="bg-card rounded-lg px-3 py-2 border border-border">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 text-indigo-500" />
                <span className="text-[10px] text-muted-foreground">Journals</span>
              </div>
              <p className="text-xs font-semibold mt-0.5">{breakdown.journalCount}</p>
            </div>
          </div>

          {moodAnalytics.mostCommon && (
            <div className="text-[11px] text-muted-foreground mb-2 px-1">
              Most common mood: <span className="font-medium text-foreground capitalize">{moodAnalytics.mostCommon.mood}</span> ({moodAnalytics.mostCommon.percentage}%)
            </div>
          )}

          {/* Compact AI tip */}
          {aiTip && (
            <div className="bg-accent/50 rounded-lg px-3 py-2 border border-border">
              <div className="flex items-start gap-1.5">
                <Brain className="h-3 w-3 text-yellow-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">{aiTip}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-pink-500" />
                <span className="text-xs font-medium text-muted-foreground">Avg Mood</span>
              </div>
              <p className="text-xl font-bold">
                {breakdown.avgScore ? breakdown.avgScore.toFixed(1) : '—'}<span className="text-xs text-muted-foreground">/5</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {breakdown.positivePct}% positive · {breakdown.lowPct}% low
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium text-muted-foreground">Active days</span>
              </div>
              <p className="text-xl font-bold">{breakdown.uniqueDays}<span className="text-xs text-muted-foreground"> / {periodDays}</span></p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Total streak: {usageAnalytics.totalDaysUsed}d
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium text-muted-foreground">Mood logs</span>
              </div>
              <p className="text-xl font-bold">{moodAnalytics.totalEntries}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">
                Top: {moodAnalytics.mostCommon ? `${moodAnalytics.mostCommon.mood} (${moodAnalytics.mostCommon.percentage}%)` : '—'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-medium text-muted-foreground">Journals & AI</span>
              </div>
              <p className="text-xl font-bold">{breakdown.journalCount}<span className="text-xs text-muted-foreground"> entries</span></p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {usageAnalytics.mindMateUsage} AI chats
              </p>
            </div>
          </div>

          {/* Mood distribution bar */}
          {moodAnalytics.totalEntries > 0 && (
            <div className="mb-4 p-3 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Mood Breakdown {periodLabel}</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                {Object.entries(moodAnalytics.moodCounts)
                  .sort(([,a], [,b]) => b - a)
                  .map(([mood, count], i) => {
                    const pct = (count / moodAnalytics.totalEntries) * 100;
                    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-cyan-500'];
                    return (
                      <div
                        key={mood}
                        className={colors[i % colors.length]}
                        style={{ width: `${pct}%` }}
                        title={`${mood}: ${count} (${Math.round(pct)}%)`}
                      />
                    );
                  })}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-muted-foreground">
                {Object.entries(moodAnalytics.moodCounts)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([mood, count], i) => {
                    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500'];
                    return (
                      <span key={mood} className="flex items-center gap-1 capitalize">
                        <span className={`inline-block w-2 h-2 rounded-full ${colors[i]}`} />
                        {mood} {count}
                      </span>
                    );
                  })}
              </div>
            </div>
          )}

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
