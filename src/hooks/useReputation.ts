import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useReputation = (userId: string | null) => {
  const [reputation, setReputation] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchReputation = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('reputation')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setReputation(data?.reputation || 0);
    } catch (error) {
      console.error('Error fetching reputation:', error);
      setReputation(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReputation();
  }, [userId]);

  return {
    reputation,
    loading,
    refetch: fetchReputation
  };
};
