
import { useState, useEffect } from 'react';

export interface ActivityData {
  lastMindMateUse: string | null;
  lastJournalUse: string | null;
  lastMoodTrack: string | null;
  lastMeditationUse: string | null;
  lastBreathingUse: string | null;
  mindMateStreak: number;
  journalStreak: number;
  moodStreak: number;
  meditationStreak: number;
  totalDaysUsed: number;
  featuresUnlocked: string[];
}

export const useActivityTracker = () => {
  const [activities, setActivities] = useState<ActivityData>({
    lastMindMateUse: null,
    lastJournalUse: null,
    lastMoodTrack: null,
    lastMeditationUse: null,
    lastBreathingUse: null,
    mindMateStreak: 0,
    journalStreak: 0,
    moodStreak: 0,
    meditationStreak: 0,
    totalDaysUsed: 0,
    featuresUnlocked: []
  });

  useEffect(() => {
    const savedData = localStorage.getItem('zenith-activity-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setActivities(parsed);
        console.log('📊 Loaded activity data:', parsed);
      } catch (error) {
        console.log('Error parsing activity data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleActivityTracking = (event: CustomEvent) => {
      const { type } = event.detail;
      console.log(`🎯 Activity tracked: ${type}`);
      trackActivity(type);
    };

    window.addEventListener('track-activity', handleActivityTracking as EventListener);

    return () => {
      window.removeEventListener('track-activity', handleActivityTracking as EventListener);
    };
  }, [activities]);

  const saveActivities = (newActivities: ActivityData) => {
    setActivities(newActivities);
    localStorage.setItem('zenith-activity-data', JSON.stringify(newActivities));
    console.log('💾 Saved activity data:', newActivities);
  };

  const isConsecutiveDay = (lastDate: string | null): boolean => {
    if (!lastDate) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return lastDate === yesterday.toDateString();
  };

  const trackActivity = (activityType: 'mindmate' | 'journal' | 'mood' | 'meditation' | 'breathing') => {
    const today = new Date().toDateString();
    const newActivities = { ...activities };

    console.log(`📈 Processing activity: ${activityType} on ${today}`);

    switch (activityType) {
      case 'mindmate':
        if (newActivities.lastMindMateUse !== today) {
          newActivities.mindMateStreak = isConsecutiveDay(newActivities.lastMindMateUse) ? 
            newActivities.mindMateStreak + 1 : 1;
          newActivities.lastMindMateUse = today;
          console.log(`🧠 MindMate streak: ${newActivities.mindMateStreak}`);
        }
        break;
      case 'journal':
        if (newActivities.lastJournalUse !== today) {
          newActivities.journalStreak = isConsecutiveDay(newActivities.lastJournalUse) ? 
            newActivities.journalStreak + 1 : 1;
          newActivities.lastJournalUse = today;
          console.log(`✍️ Journal streak: ${newActivities.journalStreak}`);
        }
        break;
      case 'mood':
        if (newActivities.lastMoodTrack !== today) {
          newActivities.moodStreak = isConsecutiveDay(newActivities.lastMoodTrack) ? 
            newActivities.moodStreak + 1 : 1;
          newActivities.lastMoodTrack = today;
          console.log(`💝 Mood streak: ${newActivities.moodStreak}`);
        }
        break;
      case 'meditation':
        if (newActivities.lastMeditationUse !== today) {
          newActivities.meditationStreak = isConsecutiveDay(newActivities.lastMeditationUse) ? 
            newActivities.meditationStreak + 1 : 1;
          newActivities.lastMeditationUse = today;
          console.log(`🧘 Meditation streak: ${newActivities.meditationStreak}`);
        }
        break;
      case 'breathing':
        if (newActivities.lastBreathingUse !== today) {
          newActivities.lastBreathingUse = today;
          console.log(`🌬️ Breathing exercise completed`);
        }
        break;
    }

    if (!newActivities.featuresUnlocked.includes(activityType)) {
      newActivities.featuresUnlocked.push(activityType);
      console.log(`🔓 New feature unlocked: ${activityType}`);
    }

    const hasUsedToday = [
      newActivities.lastMindMateUse,
      newActivities.lastJournalUse,
      newActivities.lastMoodTrack,
      newActivities.lastMeditationUse,
      newActivities.lastBreathingUse
    ].some(date => date === today);

    if (hasUsedToday) {
      const previousTotal = newActivities.totalDaysUsed;
      newActivities.totalDaysUsed = Math.max(newActivities.totalDaysUsed, 
        new Set([
          newActivities.lastMindMateUse,
          newActivities.lastJournalUse,
          newActivities.lastMoodTrack,
          newActivities.lastMeditationUse,
          newActivities.lastBreathingUse
        ].filter(date => date !== null)).size
      );
      
      if (newActivities.totalDaysUsed > previousTotal) {
        console.log(`📅 Total days used: ${newActivities.totalDaysUsed}`);
      }
    }

    saveActivities(newActivities);
  };

  return {
    activities,
    trackActivity
  };
};
