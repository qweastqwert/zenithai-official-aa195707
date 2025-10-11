import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Memory {
  id: string;
  memory_text: string;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export const useMindArchive = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mind_archive')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemories(data || []);
    } catch (error: any) {
      console.error('Error fetching memories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your MindArchive',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addMemory = async (memoryText: string, category?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('mind_archive')
        .insert([{
          user_id: user.id,
          memory_text: memoryText,
          category: category || null,
        }]);

      if (error) throw error;

      toast({
        title: 'Memory saved',
        description: 'Added to your MindArchive',
      });

      await fetchMemories();
    } catch (error: any) {
      console.error('Error adding memory:', error);
      toast({
        title: 'Error',
        description: 'Failed to save memory',
        variant: 'destructive',
      });
    }
  };

  const updateMemory = async (id: string, memoryText: string, category?: string) => {
    try {
      const { error } = await supabase
        .from('mind_archive')
        .update({
          memory_text: memoryText,
          category: category || null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Memory updated',
        description: 'Your MindArchive has been updated',
      });

      await fetchMemories();
    } catch (error: any) {
      console.error('Error updating memory:', error);
      toast({
        title: 'Error',
        description: 'Failed to update memory',
        variant: 'destructive',
      });
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mind_archive')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Memory deleted',
        description: 'Removed from your MindArchive',
      });

      await fetchMemories();
    } catch (error: any) {
      console.error('Error deleting memory:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete memory',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  return {
    memories,
    loading,
    addMemory,
    updateMemory,
    deleteMemory,
    refreshMemories: fetchMemories,
  };
};
