import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useMoodData } from './useMoodData';
import { useMoodDataSupabase } from './useMoodDataSupabase';
import { useJournal } from './useJournal';
import { useJournalSupabase } from './useJournalSupabase';

export const useSyncData = () => {
  const { user } = useAuth();
  const { moodEntries: localMoodEntries, saveMoodEntry } = useMoodData();
  const { addEntry: addMoodToSupabase } = useMoodDataSupabase();
  const { entries: localJournalEntries, saveEntry } = useJournal();
  const { saveEntry: saveJournalToSupabase } = useJournalSupabase();

  // Sync mood data to Supabase when user is authenticated
  useEffect(() => {
    if (user && localMoodEntries.length > 0) {
      const syncMoodData = async () => {
        console.log('🔄 Syncing mood data to Supabase...');
        
        // Sync all local mood entries to Supabase
        for (const entry of localMoodEntries) {
          try {
            await addMoodToSupabase(entry.mood, entry.reason);
          } catch (error) {
            console.error('Error syncing mood entry:', error);
          }
        }
        
        console.log('✅ Mood data sync completed');
      };

      // Delay sync to avoid overwhelming the API
      const timer = setTimeout(syncMoodData, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, localMoodEntries.length]);

  // Sync journal data to Supabase when user is authenticated
  useEffect(() => {
    if (user && localJournalEntries.length > 0) {
      const syncJournalData = async () => {
        console.log('🔄 Syncing journal data to Supabase...');
        
        // Sync all local journal entries to Supabase
        for (const entry of localJournalEntries) {
          try {
            await saveJournalToSupabase(entry.content, entry.mood);
          } catch (error) {
            console.error('Error syncing journal entry:', error);
          }
        }
        
        console.log('✅ Journal data sync completed');
      };

      // Delay sync to avoid overwhelming the API
      const timer = setTimeout(syncJournalData, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, localJournalEntries.length]);

  return {
    isSyncing: false // Could add sync status tracking here
  };
};