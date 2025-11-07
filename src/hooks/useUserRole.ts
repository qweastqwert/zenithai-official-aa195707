import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'user' | 'therapist' | 'admin';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole('user');
        setLoading(false);
        return;
      }

      try {
        // Use the security definer function to get role
        const { data, error } = await supabase.rpc('get_user_role', {
          user_uuid: user.id
        });

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user');
        } else {
          setRole(data || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { 
    role, 
    loading, 
    isAdmin: role === 'admin', 
    isTherapist: role === 'therapist',
    isUser: role === 'user'
  };
};