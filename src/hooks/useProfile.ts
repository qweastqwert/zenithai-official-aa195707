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

    return `\n\nPersonalization Context:
- User's name: ${profile.name} (use $name when addressing them)
- Age: ${profile.age} years old (use $age when relevant)
- Gender: ${profile.gender} (use $gender for appropriate pronouns and context)
- Hobbies/Interests: ${profile.hobbies || 'Not specified'} (use $hobbies to relate advice to their interests)
- Areas seeking support: ${profile.problems || 'General wellness'} (use $problems to focus on their specific concerns)

When chatting, personalize your responses using this information. Address them by name, consider their age and interests when giving advice, and focus on their specific areas of concern.`;
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
