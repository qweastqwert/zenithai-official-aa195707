import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CommunityBan {
  id: string;
  user_id: string;
  banned_by: string;
  reason: string;
  ban_days: number;
  banned_until: string;
  is_permanent: boolean;
  created_at: string;
  updated_at: string;
}

export const useCommunityBans = () => {
  const [bans, setBans] = useState<CommunityBan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  const [checkingBan, setCheckingBan] = useState(true);
  const { user } = useAuth();

  const fetchBans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_bans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBans(data || []);
    } catch (error) {
      console.error('Error fetching bans:', error);
      toast.error('Failed to load bans');
    } finally {
      setLoading(false);
    }
  };

  const checkUserBan = async () => {
    if (!user) {
      setIsBanned(false);
      setCheckingBan(false);
      return;
    }

    try {
      setCheckingBan(true);
      const { data, error } = await supabase
        .from('community_bans')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const bannedUntil = new Date(data.banned_until);
        const now = new Date();
        setIsBanned(data.is_permanent || bannedUntil > now);
      } else {
        setIsBanned(false);
      }
    } catch (error) {
      console.error('Error checking ban status:', error);
      setIsBanned(false);
    } finally {
      setCheckingBan(false);
    }
  };

  const createBan = async (
    userId: string,
    reason: string,
    banDays: number,
    isPermanent: boolean = false
  ) => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      const bannedUntil = new Date();
      bannedUntil.setDate(bannedUntil.getDate() + banDays);

      const { error } = await supabase
        .from('community_bans')
        .insert({
          user_id: userId,
          banned_by: user.id,
          reason,
          ban_days: banDays,
          banned_until: bannedUntil.toISOString(),
          is_permanent: isPermanent
        });

      if (error) throw error;

      toast.success('User banned successfully');
      await fetchBans();
      return true;
    } catch (error) {
      console.error('Error creating ban:', error);
      toast.error('Failed to ban user');
      return false;
    }
  };

  const removeBan = async (banId: string) => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      const { error } = await supabase
        .from('community_bans')
        .delete()
        .eq('id', banId);

      if (error) throw error;

      toast.success('Ban removed successfully');
      await fetchBans();
      return true;
    } catch (error) {
      console.error('Error removing ban:', error);
      toast.error('Failed to remove ban');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchBans();
      checkUserBan();
    }
  }, [user]);

  return {
    bans,
    loading,
    isBanned,
    checkingBan,
    currentBan: bans.find(b => b.user_id === user?.id),
    fetchBans,
    checkUserBan,
    createBan,
    removeBan
  };
};
