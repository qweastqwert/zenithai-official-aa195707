import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SleepLog {
  id: string;
  user_id: string;
  date: string;
  sleep_confirmed_at: string | null;
  sleep_quality: string | null;
  wake_response_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useSleepLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLogs();
    } else {
      setLogs([]);
      setLoading(false);
    }
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching sleep logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmSleep = async (date: string = new Date().toISOString().split('T')[0]) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sleep_logs')
        .upsert({
          user_id: user.id,
          date,
          sleep_confirmed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date'
        })
        .select()
        .single();

      if (error) throw error;

      setLogs(prev => {
        const updated = prev.filter(log => log.date !== date);
        return [data, ...updated].sort((a, b) => b.date.localeCompare(a.date));
      });

      return { success: true };
    } catch (error) {
      console.error('Error confirming sleep:', error);
      return { success: false, error };
    }
  };

  const logSleepQuality = async (quality: string, date: string = new Date().toISOString().split('T')[0]) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sleep_logs')
        .upsert({
          user_id: user.id,
          date,
          sleep_quality: quality,
          wake_response_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,date'
        })
        .select()
        .single();

      if (error) throw error;

      setLogs(prev => {
        const updated = prev.filter(log => log.date !== date);
        return [data, ...updated].sort((a, b) => b.date.localeCompare(a.date));
      });

      return { success: true };
    } catch (error) {
      console.error('Error logging sleep quality:', error);
      return { success: false, error };
    }
  };

  const getTodaysLog = () => {
    const today = new Date().toISOString().split('T')[0];
    return logs.find(log => log.date === today);
  };

  return {
    logs,
    loading,
    confirmSleep,
    logSleepQuality,
    getTodaysLog,
    refetch: fetchLogs
  };
};