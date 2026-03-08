import { useState, useEffect, useCallback } from 'react';
import { getCookie, setCookie } from '@/utils/cookieUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

const defaultActivities: ActivityData = {
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
};

export const useActivityTracker = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityData>(defaultActivities);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load activity data from Supabase or cookies
  useEffect(() => {
    const loadActivityData = async () => {
      if (user) {
        // Try to load from Supabase first
        const { data, error } = await supabase
          .from('user_activity_data')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data && !error) {
          const loadedData: ActivityData = {
            lastMindMateUse: data.last_mindmate_use,
            lastJournalUse: data.last_journal_use,
            lastMoodTrack: data.last_mood_track,
            lastMeditationUse: data.last_meditation_use,
            lastBreathingUse: data.last_breathing_use,
            lastSleepUse: data.last_sleep_use,
            mindMateStreak: data.mindmate_streak,
            journalStreak: data.journal_streak,
            moodStreak: data.mood_streak,
            meditationStreak: data.meditation_streak,
            sleepStreak: data.sleep_streak,
            totalDaysUsed: data.total_days_used,
            featuresUnlocked: data.features_unlocked || []
          };
          setActivities(loadedData);
          console.log('📊 Loaded activity data from cloud:', loadedData);
        } else {
          // Fallback to cookie data and sync to cloud
          const savedData = getCookie('zenith-activity-data');
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              setActivities(parsed);
              // Sync cookie data to cloud
              await syncToCloud(parsed, user.id);
              console.log('📊 Migrated activity data from cookies to cloud');
            } catch (error) {
              console.log('Error parsing activity data:', error);
            }
          }
        }
      } else {
        // Not logged in - use cookies
        const savedData = getCookie('zenith-activity-data');
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            setActivities(parsed);
            console.log('📊 Loaded activity data from cookies:', parsed);
          } catch (error) {
            console.log('Error parsing activity data:', error);
          }
        }
      }
      setIsLoaded(true);
    };

    loadActivityData();
  }, [user]);

  // Sync to Supabase
  const syncToCloud = async (data: ActivityData, userId: string) => {
    const { error } = await supabase
      .from('user_activity_data')
      .upsert({
        user_id: userId,
        last_mindmate_use: data.lastMindMateUse,
        last_journal_use: data.lastJournalUse,
        last_mood_track: data.lastMoodTrack,
        last_meditation_use: data.lastMeditationUse,
        last_breathing_use: data.lastBreathingUse,
        last_sleep_use: data.lastSleepUse,
        mindmate_streak: data.mindMateStreak,
        journal_streak: data.journalStreak,
        mood_streak: data.moodStreak,
        meditation_streak: data.meditationStreak,
        sleep_streak: data.sleepStreak,
        total_days_used: data.totalDaysUsed,
        features_unlocked: data.featuresUnlocked
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Error syncing activity data to cloud:', error);
    } else {
      console.log('☁️ Activity data synced to cloud');
    }
  };

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
  }, [activities, user]);

  const saveActivities = useCallback(async (newActivities: ActivityData) => {
    setActivities(newActivities);
    
    // Always save to cookies as backup
    setCookie('zenith-activity-data', JSON.stringify(newActivities), 365);
    
    // If user is logged in, sync to cloud
    if (user) {
      await syncToCloud(newActivities, user.id);
    }
    
    console.log('💾 Saved activity data:', newActivities);
  }, [user]);

  const isConsecutiveDay = (lastDate: string | null): boolean => {
    if (!lastDate) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return lastDate === yesterday.toDateString();
  };

  const trackActivity = useCallback((activityType: 'mindmate' | 'journal' | 'mood' | 'meditation' | 'breathing' | 'sleep' | 'community') => {
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
      case 'community':
        console.log(`💬 Community Support accessed`);
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
  }, [activities, saveActivities]);

  const getStats = useCallback(() => {
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
  }, [activities]);

  // Manual sync function for pull-to-refresh
  const syncData = useCallback(async () => {
    if (user) {
      await syncToCloud(activities, user.id);
    }
  }, [user, activities]);

  return {
    activities,
    trackActivity,
    getStats,
    syncData,
    isLoaded
  };
};
