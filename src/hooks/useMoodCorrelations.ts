import { useMemo } from 'react';
import { useMoodDataSupabase } from './useMoodDataSupabase';
import { useSleepLogs } from './useSleepLogs';

const MOOD_SCORE: Record<string, number> = {
  'ecstatic': 5, 'very-happy': 5, 'excited': 5, 'grateful': 5, 'peaceful': 5, 'confident': 5,
  'joyful': 4, 'happy': 4, 'calm': 4, 'content': 4, 'energetic': 4, 'hopeful': 4,
  'neutral': 3,
  'melancholy': 2, 'sad': 2, 'anxious': 2, 'tired': 2, 'lonely': 2, 'worried': 2,
  'troubled': 1, 'very-sad': 1, 'stressed': 1, 'overwhelmed': 1, 'frustrated': 1, 'distressed': 1,
};

export interface TagCorrelation {
  tag: string;
  avgScore: number;
  delta: number; // vs overall average
  count: number;
}

export interface Correlations {
  overallAvg: number;
  topPositive: TagCorrelation[];
  topNegative: TagCorrelation[];
  sleepImpact: { hasSignal: boolean; pctDrop: number } | null;
  totalEntries: number;
}

export const useMoodCorrelations = (days = 30): Correlations => {
  const { entries } = useMoodDataSupabase();
  const { logs } = useSleepLogs() as any;

  return useMemo(() => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const recent = entries.filter(e => e.timestamp >= cutoff);
    const scores = recent.map(e => MOOD_SCORE[e.mood] ?? 3);
    const overallAvg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    // Per-tag aggregation
    const tagMap = new Map<string, number[]>();
    for (const e of recent) {
      const tags = (e as any).context_tags as string[] | undefined;
      if (!tags || !Array.isArray(tags)) continue;
      const score = MOOD_SCORE[e.mood] ?? 3;
      for (const t of tags) {
        if (!tagMap.has(t)) tagMap.set(t, []);
        tagMap.get(t)!.push(score);
      }
    }
    const correlations: TagCorrelation[] = Array.from(tagMap.entries())
      .filter(([, arr]) => arr.length >= 2)
      .map(([tag, arr]) => {
        const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
        return { tag, avgScore: avg, delta: avg - overallAvg, count: arr.length };
      });

    const topPositive = [...correlations]
      .filter(c => c.delta > 0.3)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 3);
    const topNegative = [...correlations]
      .filter(c => c.delta < -0.3)
      .sort((a, b) => a.delta - b.delta)
      .slice(0, 3);

    // Sleep impact: compare mood on days following poor sleep vs good sleep
    let sleepImpact: Correlations['sleepImpact'] = null;
    if (Array.isArray(logs) && logs.length >= 4 && recent.length >= 4) {
      const poorDates = new Set<string>(
        logs.filter((l: any) => l.sleep_quality === 'poor' || l.sleep_quality === 'bad').map((l: any) => l.date)
      );
      const goodDates = new Set<string>(
        logs.filter((l: any) => l.sleep_quality === 'good' || l.sleep_quality === 'great').map((l: any) => l.date)
      );
      const poor = recent.filter(e => poorDates.has(e.date)).map(e => MOOD_SCORE[e.mood] ?? 3);
      const good = recent.filter(e => goodDates.has(e.date)).map(e => MOOD_SCORE[e.mood] ?? 3);
      if (poor.length >= 2 && good.length >= 2) {
        const poorAvg = poor.reduce((a, b) => a + b, 0) / poor.length;
        const goodAvg = good.reduce((a, b) => a + b, 0) / good.length;
        const pctDrop = goodAvg > 0 ? Math.round(((goodAvg - poorAvg) / goodAvg) * 100) : 0;
        sleepImpact = { hasSignal: pctDrop >= 10, pctDrop };
      }
    }

    return {
      overallAvg,
      topPositive,
      topNegative,
      sleepImpact,
      totalEntries: recent.length,
    };
  }, [entries, logs, days]);
};