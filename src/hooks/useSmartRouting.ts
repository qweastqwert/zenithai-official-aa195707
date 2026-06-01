import { useMemo } from 'react';
import { useMoodDataSupabase } from './useMoodDataSupabase';
import { useSleepLogs } from './useSleepLogs';

export type SmartSuggestion =
  | { id: 'low-mood-checkin'; label: string; cta: 'mindmate' | 'breathing'; reason: string }
  | { id: 'poor-sleep-focus'; label: string; cta: 'breathing' | 'music'; reason: string };

const LOW_MOODS = new Set([
  'sad', 'very-sad', 'melancholy', 'troubled', 'distressed',
  'stressed', 'overwhelmed', 'anxious', 'frustrated', 'tired', 'lonely', 'worried',
]);

/**
 * Reads the most recent mood + sleep log and emits at most one or two
 * proactive suggestions for the dashboard. Pure read — never persists.
 */
export const useSmartRouting = (): SmartSuggestion[] => {
  const { entries } = useMoodDataSupabase();
  const { logs } = useSleepLogs() as any;

  return useMemo(() => {
    const out: SmartSuggestion[] = [];
    const latestMood = entries[0];
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

    if (latestMood && LOW_MOODS.has(latestMood.mood) && latestMood.timestamp > twoHoursAgo) {
      out.push({
        id: 'low-mood-checkin',
        label: 'Things feel a bit heavy. Want to vent or breathe together?',
        cta: 'mindmate',
        reason: `You logged "${latestMood.mood}" recently`,
      });
    }

    const today = new Date().toISOString().split('T')[0];
    const recentLog = Array.isArray(logs)
      ? logs.find((l: any) => l.date === today || l.date === new Date(Date.now() - 86400000).toISOString().split('T')[0])
      : null;
    if (recentLog && (recentLog.sleep_quality === 'poor' || recentLog.sleep_quality === 'bad')) {
      out.push({
        id: 'poor-sleep-focus',
        label: 'Rough night? A 4-7-8 breath cycle can lift the fog.',
        cta: 'breathing',
        reason: 'Last sleep was rated poor',
      });
    }

    return out.slice(0, 2);
  }, [entries, logs]);
};