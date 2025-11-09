import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useProfileSync = () => {
  const { user } = useAuth();

  useEffect(() => {
    const ensureProfile = async () => {
      if (!user) return;

      try {
        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              age: '18-24',
              gender: 'prefer-not-to-say',
            });

          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        }
      } catch (error) {
        console.error('Error ensuring profile:', error);
      }
    };

    ensureProfile();
  }, [user]);
};
