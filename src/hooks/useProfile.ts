import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProfile {
  id?: string;
  user_id?: string;
  name: string;
  age: string;
  gender: string;
  hobbies: string;
  problems: string;
  username?: string;
  birth_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user || !profile) throw new Error('User not authenticated or profile not found');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const deleteProfile = async () => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(null);
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  };

  const getPersonalizedSystemInstruction = () => {
    if (!profile) return '';

    return `\n\nABOUT THE USER (private context — never mention these labels or that you have a "profile"):
- Name: ${profile.name}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Interests: ${profile.hobbies || 'Not specified'}
- Focus areas: ${profile.problems || 'General wellness'}

Speak to them naturally by their actual name (${profile.name}). NEVER output placeholders like "$name", "$age", "$hobbies", or "$problems" — always substitute the real values above. Tailor tone and examples to their age and interests when natural; do not list this info back to them.`;
  };

  return {
    profile,
    loading,
    createProfile,
    updateProfile,
    deleteProfile,
    refetchProfile: fetchProfile,
    hasProfile: !!profile,
    getPersonalizedSystemInstruction
  };
};
