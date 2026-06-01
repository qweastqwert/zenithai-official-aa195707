import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMoodDataSupabase } from '@/hooks/useMoodDataSupabase';
import { useJournalSupabase } from '@/hooks/useJournalSupabase';
import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useMoodCorrelations } from '@/hooks/useMoodCorrelations';
import { TrendingUp, TrendingDown, Moon } from 'lucide-react';

const InsightsPanel: React.FC = () => {
  const { entries: moods } = useMoodDataSupabase();
  const { entries: journals } = useJournalSupabase();
  const { activities } = useActivityTracker();
  const correlations = useMoodCorrelations(30);

  const insights = useMemo(() => {
    const last7 = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentMoods = moods.filter((m: any) => m.timestamp >= last7);
    const counts: Record<string, number> = {};
    recentMoods.forEach((m: any) => { counts[m.mood] = (counts[m.mood] || 0) + 1; });
    const topMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    const journalHours = journals
      .filter((j: any) => Date.now() - j.timestamp < 30 * 24 * 60 * 60 * 1000)
      .map((j: any) => new Date(j.timestamp).getHours());
    const morning = journalHours.filter(h => h >= 5 && h < 12).length;
    const evening = journalHours.filter(h => h >= 18 || h < 5).length;
    const writingTime = morning > evening ? 'mornings' : evening > morning ? 'evenings' : 'all day';

    const longest = Math.max(
      activities.mindMateStreak, activities.journalStreak,
      activities.moodStreak, activities.meditationStreak, activities.sleepStreak,
    );

    return { topMood, writingTime, longest, moodCount: recentMoods.length, journalCount: journals.length };
  }, [moods, journals, activities]);

  const card = (emoji: string, label: string, value: string | number) => (
    <Card><CardContent className="p-3 text-center">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </CardContent></Card>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {card('🌈', 'Top mood (7d)', insights.topMood)}
        {card('✍️', 'You write in…', insights.writingTime)}
        {card('🔥', 'Longest streak', insights.longest)}
        {card('📓', 'Journal entries', insights.journalCount)}
      </div>

      {(correlations.topPositive.length > 0 || correlations.topNegative.length > 0 || correlations.sleepImpact?.hasSignal) && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="text-sm font-semibold text-foreground">Patterns in your last 30 days</div>
            {correlations.topPositive.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" /> Tends to lift your mood
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {correlations.topPositive.map(c => (
                    <span key={c.tag} className="rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] px-2 py-0.5">
                      {c.tag} · +{c.delta.toFixed(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {correlations.topNegative.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <TrendingDown className="h-3.5 w-3.5" /> Tends to weigh you down
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {correlations.topNegative.map(c => (
                    <span key={c.tag} className="rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[11px] px-2 py-0.5">
                      {c.tag} · {c.delta.toFixed(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {correlations.sleepImpact?.hasSignal && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Moon className="h-3.5 w-3.5 text-indigo-500" />
                Your mood drops about <strong className="text-foreground mx-1">{correlations.sleepImpact.pctDrop}%</strong> after poor sleep.
              </div>
            )}
            <p className="text-[10px] text-muted-foreground italic">
              Based on {correlations.totalEntries} mood log{correlations.totalEntries === 1 ? '' : 's'}. Patterns are clues, not verdicts.
            </p>
          </CardContent>
        </Card>
      )}

      <Card><CardContent className="p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">A gentle reflection:</strong>{' '}
        Over the last week you logged {insights.moodCount} mood{insights.moodCount === 1 ? '' : 's'}, and you tend
        to journal in the {insights.writingTime}. Patterns like these are clues — not verdicts.
      </CardContent></Card>
    </div>
  );
};

export default InsightsPanel;