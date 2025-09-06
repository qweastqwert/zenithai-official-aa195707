import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SleepProfile {
  id: string;
  user_id: string;
  sleep_time: string;
  wake_time: string;
  created_at: string;
  updated_at: string;
}

export const useSleepProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SleepProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sleep_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data || null);
    } catch (error) {
      console.error('Error fetching sleep profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (sleepTime: string, wakeTime: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sleep_profiles')
        .insert({
          user_id: user.id,
          sleep_time: sleepTime,
          wake_time: wakeTime
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { success: true };
    } catch (error) {
      console.error('Error creating sleep profile:', error);
      return { success: false, error };
    }
  };

  const updateProfile = async (sleepTime: string, wakeTime: string) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('sleep_profiles')
        .update({
          sleep_time: sleepTime,
          wake_time: wakeTime
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { success: true };
    } catch (error) {
      console.error('Error updating sleep profile:', error);
      return { success: false, error };
    }
  };

  return {
    profile,
    loading,
    createProfile,
    updateProfile,
    refetch: fetchProfile
  };
};