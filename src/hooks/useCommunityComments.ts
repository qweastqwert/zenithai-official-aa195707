import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CommunityComment {
  id: string;
  post_id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export const useCommunityComments = (postId: string) => {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string, isAnonymous: boolean = true) => {
    if (!user) {
      toast.error('You must be logged in to comment');
      return false;
    }

    try {
      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          content,
          user_id: user.id,
          is_anonymous: isAnonymous
        });

      if (error) throw error;

      toast.success('Comment added successfully!');
      await fetchComments();
      return true;
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to create comment');
      return false;
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete a comment');
      return false;
    }

    try {
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Comment deleted successfully!');
      await fetchComments();
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
      return false;
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return {
    comments,
    loading,
    fetchComments,
    createComment,
    deleteComment
  };
};