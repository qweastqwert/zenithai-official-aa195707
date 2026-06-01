import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface LeaderboardRow {
  user_id: string;
  display_name: string;
  total_days_used: number;
  longest_streak: number;
  achievements_count: number;
  isMe?: boolean;
}

export const useLeaderboard = (limit = 25) => {
  const { user } = useAuth();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_leaderboard', { _limit: limit });
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setRows([]);
      } else {
        const decorated: LeaderboardRow[] = (data || []).map((r: any) => ({
          ...r,
          isMe: user?.id === r.user_id,
        }));
        setRows(decorated);
        setError(null);
      }
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [limit, user?.id]);

  return { rows, loading, error };
};