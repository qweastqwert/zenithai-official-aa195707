
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  timestamp: number;
  user_id?: string;
}

export const useJournalSupabase = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEntries();
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      // Using any to bypass type checking since the table exists but isn't in types
      const { data, error } = await (supabase as any)
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async (content: string, mood: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();

    // Check if entry exists for today
    const existingEntry = entries.find(entry => entry.date === today);

    try {
      if (existingEntry) {
        // Update existing entry
        const { data, error } = await (supabase as any)
          .from('journal_entries')
          .update({ content, mood, timestamp })
          .eq('id', existingEntry.id)
          .select()
          .single();

        if (error) throw error;

        setEntries(prev => prev.map(entry => 
          entry.id === existingEntry.id ? data : entry
        ));
      } else {
        // Create new entry
        const newEntry = {
          user_id: user.id,
          date: today,
          content,
          mood,
          timestamp
        };

        const { data, error } = await (supabase as any)
          .from('journal_entries')
          .insert(newEntry)
          .select()
          .single();

        if (error) throw error;

        setEntries(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const getTodaysEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.date === today);
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  return { 
    entries, 
    saveEntry, 
    getTodaysEntry, 
    deleteEntry,
    loading,
    refetch: fetchEntries
  };
};
