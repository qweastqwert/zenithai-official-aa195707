
import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '@/utils/cookieUtils';

export interface ActivityData {
  lastMindMateUse: string | null;
  lastJournalUse: string | null;
  lastMoodTrack: string | null;
  lastMeditationUse: string | null;
  lastBreathingUse: string | null;
  lastSleepUse: string | null;
  mindMateStreak: number;
  journalStreak: number;
  moodStreak: number;
  meditationStreak: number;
  sleepStreak: number;
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
    lastSleepUse: null,
    mindMateStreak: 0,
    journalStreak: 0,
    moodStreak: 0,
    meditationStreak: 0,
    sleepStreak: 0,
    totalDaysUsed: 0,
    featuresUnlocked: []
  });

  useEffect(() => {
    // Load activity data from cookies
    const savedData = getCookie('zenith-activity-data');
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

  // Listen for activity tracking events
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
    setCookie('zenith-activity-data', JSON.stringify(newActivities), 365);
    console.log('💾 Saved activity data:', newActivities);
  };

  const isConsecutiveDay = (lastDate: string | null): boolean => {
    if (!lastDate) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return lastDate === yesterday.toDateString();
  };

  const trackActivity = (activityType: 'mindmate' | 'journal' | 'mood' | 'meditation' | 'breathing' | 'sleep') => {
    const today = new Date().toDateString();
    const newActivities = { ...activities };

    console.log(`📈 Processing activity: ${activityType} on ${today}`);

    // Update last use date and streaks
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
      case 'sleep':
        if (newActivities.lastSleepUse !== today) {
          newActivities.sleepStreak = isConsecutiveDay(newActivities.lastSleepUse) ? 
            newActivities.sleepStreak + 1 : 1;
          newActivities.lastSleepUse = today;
          console.log(`😴 Sleep streak: ${newActivities.sleepStreak}`);
        }
        break;
    }

    // Track unique features used
    if (!newActivities.featuresUnlocked.includes(activityType)) {
      newActivities.featuresUnlocked.push(activityType);
      console.log(`🔓 New feature unlocked: ${activityType}`);
    }

    // Update total days used
    const hasUsedToday = [
      newActivities.lastMindMateUse,
      newActivities.lastJournalUse,
      newActivities.lastMoodTrack,
      newActivities.lastMeditationUse,
      newActivities.lastBreathingUse,
      newActivities.lastSleepUse
    ].some(date => date === today);

    if (hasUsedToday) {
      const previousTotal = newActivities.totalDaysUsed;
      newActivities.totalDaysUsed = Math.max(newActivities.totalDaysUsed, 
        new Set([
          newActivities.lastMindMateUse,
          newActivities.lastJournalUse,
          newActivities.lastMoodTrack,
          newActivities.lastMeditationUse,
          newActivities.lastBreathingUse,
          newActivities.lastSleepUse
        ].filter(date => date !== null)).size
      );
      
      if (newActivities.totalDaysUsed > previousTotal) {
        console.log(`📅 Total days used: ${newActivities.totalDaysUsed}`);
      }
    }

    saveActivities(newActivities);
  };

  const getStats = () => {
    return {
      mindMateUsage: activities.mindMateStreak,
      journalUsage: activities.journalStreak,
      moodUsage: activities.moodStreak,
      meditationUsage: activities.meditationStreak,
      totalDaysUsed: activities.totalDaysUsed,
      featuresUnlocked: activities.featuresUnlocked.length,
      currentStreaks: {
        mindmate: activities.mindMateStreak,
        journal: activities.journalStreak,
        mood: activities.moodStreak,
        meditation: activities.meditationStreak,
        sleep: activities.sleepStreak
      }
    };
  };

  return {
    activities,
    trackActivity,
    getStats
  };
};
