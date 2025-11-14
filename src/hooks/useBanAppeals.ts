import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface BanAppeal {
  id: string;
  ban_id: string;
  user_id: string;
  appeal_text: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useBanAppeals = () => {
  const [appeals, setAppeals] = useState<BanAppeal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ban_appeals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppeals((data as BanAppeal[]) || []);
    } catch (error) {
      console.error('Error fetching appeals:', error);
      toast.error('Failed to load appeals');
    } finally {
      setLoading(false);
    }
  };

  const createAppeal = async (banId: string, appealText: string) => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      const { error } = await supabase
        .from('ban_appeals')
        .insert({
          ban_id: banId,
          user_id: user.id,
          appeal_text: appealText
        });

      if (error) throw error;

      toast.success('Appeal submitted successfully');
      await fetchAppeals();
      return true;
    } catch (error) {
      console.error('Error creating appeal:', error);
      toast.error('Failed to submit appeal');
      return false;
    }
  };

  const updateAppealStatus = async (
    appealId: string,
    status: 'approved' | 'rejected'
  ) => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      const { error } = await supabase
        .from('ban_appeals')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', appealId);

      if (error) throw error;

      toast.success(`Appeal ${status}`);
      await fetchAppeals();
      return true;
    } catch (error) {
      console.error('Error updating appeal:', error);
      toast.error('Failed to update appeal');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppeals();
    }
  }, [user]);

  return {
    appeals,
    loading,
    fetchAppeals,
    createAppeal,
    updateAppealStatus
  };
};
