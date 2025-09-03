import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useMoodData } from './useMoodData';
import { useMoodDataSupabase } from './useMoodDataSupabase';
import { useJournal } from './useJournal';
import { useJournalSupabase } from './useJournalSupabase';
import { supabase } from '@/integrations/supabase/client';

export const useSyncData = () => {
  const { user } = useAuth();
  const moodData = useMoodData();
  const journalData = useJournal();
  const [loading, setLoading] = useState(false);

  const syncData = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      // Get local data
      const localMoodData = moodData.moodEntries;
      const localJournalData = journalData.entries;

      // Check existing data to prevent duplicates
      const { data: existingMoods } = await supabase
        .from('mood_entries')
        .select('timestamp')
        .eq('user_id', user.id);

      const { data: existingJournals } = await supabase
        .from('journal_entries')
        .select('timestamp')
        .eq('user_id', user.id);

      const existingMoodTimestamps = new Set(existingMoods?.map(m => m.timestamp) || []);
      const existingJournalTimestamps = new Set(existingJournals?.map(j => j.timestamp) || []);

      // Sync only new mood data
      const newMoodData = localMoodData.filter(mood => !existingMoodTimestamps.has(mood.timestamp));
      for (const mood of newMoodData) {
        const { error } = await supabase
          .from('mood_entries')
          .insert({
            user_id: user.id,
            mood: mood.mood,
            reason: mood.reason || '',
            date: mood.date,
            time: mood.time,
            timestamp: mood.timestamp,
          });

        if (error) {
          console.error('Error syncing mood data:', error);
        }
      }

      // Sync only new journal data
      const newJournalData = localJournalData.filter(journal => !existingJournalTimestamps.has(journal.timestamp));
      for (const journal of newJournalData) {
        const { error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            content: journal.content,
            mood: journal.mood,
            date: journal.date,
            timestamp: journal.timestamp,
          });

        if (error) {
          console.error('Error syncing journal data:', error);
        }
      }

      console.log(`Data sync completed: ${newMoodData.length} moods, ${newJournalData.length} journals synced`);
    } catch (error) {
      console.error('Error during data sync:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-sync when user is authenticated
  useEffect(() => {
    if (user) {
      const timer = setTimeout(syncData, 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return {
    syncData,
    isSyncing: loading
  };
};