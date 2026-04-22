import { useMemo } from 'react';
import { useMoodDataSupabase } from './useMoodDataSupabase';
import { useJournalSupabase } from './useJournalSupabase';
import { useActivityTracker } from './useActivityTracker';
import { useAchievements } from './useAchievements';

export type QuestPeriod = 'daily' | 'weekly';

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  period: QuestPeriod;
  exp: number;
  progress: number;
  goal: number;
  isComplete: boolean;
  hint?: string;
}

const startOfDay = (d = new Date()) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

const startOfWeek = (d = new Date()) => {
  const x = new Date(d);
  const day = x.getDay(); // 0=Sun
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
};

/**
 * Counts mood entries with anti-abuse spacing: each counted entry must be at
 * least `minGapMs` milliseconds after the previously counted entry.
 */
const countSpacedMoods = (timestamps: number[], minGapMs: number) => {
  const sorted = [...timestamps].sort((a, b) => a - b);
  let count = 0;
  let last = -Infinity;
  for (const t of sorted) {
    if (t - last >= minGapMs) {
      count++;
      last = t;
    }
  }
  return count;
};

export const useQuests = () => {
  const { entries: moodEntries } = useMoodDataSupabase();
  const { entries: journalEntries } = useJournalSupabase();
  const { activities } = useActivityTracker();
  const { stats: achievementStats } = useAchievements();

  const dayStart = startOfDay();
  const weekStart = startOfWeek();

  const quests = useMemo<Quest[]>(() => {
    const todaysMoods = moodEntries.filter(e => e.timestamp >= dayStart);
    const weeksMoods = moodEntries.filter(e => e.timestamp >= weekStart);
    const todaysJournals = journalEntries.filter(j => j.timestamp >= dayStart);
    const weeksJournals = journalEntries.filter(j => j.timestamp >= weekStart);

    // Anti-abuse: at least 2h between each counted mood log
    const spacedMoodsToday = countSpacedMoods(
      todaysMoods.map(m => m.timestamp),
      2 * 60 * 60 * 1000
    );

    const list: Quest[] = [
      {
        id: 'mood-3-spaced',
        title: 'Check In Three Times',
        description: 'Log your mood 3 times today, with at least 2 hours between each entry.',
        icon: '💗',
        period: 'daily',
        exp: 50,
        progress: Math.min(spacedMoodsToday, 3),
        goal: 3,
        isComplete: spacedMoodsToday >= 3,
        hint: 'Logs less than 2h apart only count once.',
      },
      {
        id: 'journal-1-day',
        title: 'One Reflection',
        description: 'Write at least one journal entry today.',
        icon: '✍️',
        period: 'daily',
        exp: 30,
        progress: Math.min(todaysJournals.length, 1),
        goal: 1,
        isComplete: todaysJournals.length >= 1,
      },
      {
        id: 'mindmate-today',
        title: 'Talk it Out',
        description: 'Have a conversation with MindMate today.',
        icon: '🧠',
        period: 'daily',
        exp: 25,
        progress: activities.lastMindMateUse === new Date().toDateString() ? 1 : 0,
        goal: 1,
        isComplete: activities.lastMindMateUse === new Date().toDateString(),
      },
      {
        id: 'breathing-today',
        title: 'Breathe Deep',
        description: 'Complete a breathing exercise today.',
        icon: '🫁',
        period: 'daily',
        exp: 20,
        progress: activities.lastBreathingUse === new Date().toDateString() ? 1 : 0,
        goal: 1,
        isComplete: activities.lastBreathingUse === new Date().toDateString(),
      },
      {
        id: 'meditation-today',
        title: 'Find Stillness',
        description: 'Meditate for at least one session today.',
        icon: '🧘',
        period: 'daily',
        exp: 25,
        progress: activities.lastMeditationUse === new Date().toDateString() ? 1 : 0,
        goal: 1,
        isComplete: activities.lastMeditationUse === new Date().toDateString(),
      },
      // Weekly
      {
        id: 'mood-week-streak',
        title: 'Weekly Awareness',
        description: 'Log your mood on at least 5 different days this week.',
        icon: '📅',
        period: 'weekly',
        exp: 120,
        progress: Math.min(new Set(weeksMoods.map(m => m.date)).size, 5),
        goal: 5,
        isComplete: new Set(weeksMoods.map(m => m.date)).size >= 5,
      },
      {
        id: 'journal-week-3',
        title: 'Reflect Often',
        description: 'Write 3 journal entries this week.',
        icon: '📖',
        period: 'weekly',
        exp: 100,
        progress: Math.min(weeksJournals.length, 3),
        goal: 3,
        isComplete: weeksJournals.length >= 3,
      },
      {
        id: 'all-features-week',
        title: 'Full Spectrum',
        description: 'Use 4 different wellness features this week.',
        icon: '🌈',
        period: 'weekly',
        exp: 150,
        progress: Math.min(activities.featuresUnlocked.length, 4),
        goal: 4,
        isComplete: activities.featuresUnlocked.length >= 4,
      },
    ];

    return list;
  }, [moodEntries, journalEntries, activities, dayStart, weekStart]);

  // EXP earned: completed quests + achievements bonus
  const totalExp = useMemo(() => {
    const questExp = quests.filter(q => q.isComplete).reduce((sum, q) => sum + q.exp, 0);
    const achievementExp = achievementStats.unlockedCount * 75;
    return questExp + achievementExp;
  }, [quests, achievementStats]);

  const completedToday = quests.filter(q => q.period === 'daily' && q.isComplete).length;
  const dailyTotal = quests.filter(q => q.period === 'daily').length;

  // EXP level: 500 EXP per level
  const level = Math.floor(totalExp / 500) + 1;
  const expIntoLevel = totalExp % 500;
  const expToNext = 500 - expIntoLevel;

  return {
    quests,
    totalExp,
    level,
    expIntoLevel,
    expToNext,
    completedToday,
    dailyTotal,
  };
};