
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface MoodEntry {
  id: string;
  date: string;
  time: string;
  mood: string;
  reason: string;
  timestamp: number;
  user_id?: string;
}

export const useMoodDataSupabase = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
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
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (mood: string, reason: string = '') => {
    if (!user) return;

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);
    const timestamp = Date.now();

    try {
      const newEntry = {
        user_id: user.id,
        date,
        time,
        mood,
        reason,
        timestamp
      };

      const { data, error } = await (supabase as any)
        .from('mood_entries')
        .insert(newEntry)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding mood entry:', error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('mood_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting mood entry:', error);
    }
  };

  const getEntriesForDate = (date: string) => {
    return entries.filter(entry => entry.date === date);
  };

  const getEntriesForDateRange = (startDate: string, endDate: string) => {
    return entries.filter(entry => entry.date >= startDate && entry.date <= endDate);
  };

  return {
    entries,
    addEntry,
    deleteEntry,
    getEntriesForDate,
    getEntriesForDateRange,
    loading,
    refetch: fetchEntries
  };
};
