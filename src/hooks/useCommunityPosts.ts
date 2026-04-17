import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CommunityPost {
  id: string;
  title: string;
  description: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

// Shared state so all hook instances see the same posts
let sharedPosts: CommunityPost[] = [];
let sharedListeners: Set<() => void> = new Set();

const notifyListeners = () => {
  sharedListeners.forEach(fn => fn());
};

export const useCommunityPosts = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(sharedPosts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  // Subscribe to shared state
  useEffect(() => {
    const listener = () => setPosts([...sharedPosts]);
    sharedListeners.add(listener);
    return () => { sharedListeners.delete(listener); };
  }, []);

  const fetchPosts = useCallback(async (searchTerm?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        console.error('Supabase fetch posts error:', queryError);
        throw queryError;
      }
      
      const safePosts = (data || []).map(post => ({
        ...post,
        user_id: post.is_anonymous && post.user_id !== user?.id ? null : post.user_id
      })) as CommunityPost[];
      
      sharedPosts = safePosts;
      notifyListeners();
    } catch (err: any) {
      const message = err?.message || 'Failed to load posts';
      console.error('Error fetching posts:', err);
      setError(message);
      toast.error(`Failed to load posts: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createPost = async (title: string, description: string, isAnonymous: boolean = true) => {
    if (!user) {
      toast.error('You must be logged in to create a post');
      return false;
    }

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          title,
          description,
          user_id: user.id,
          is_anonymous: isAnonymous
        });

      if (error) throw error;

      toast.success('Post created successfully!');
      await fetchPosts();
      return true;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(`Failed to create post: ${error?.message || 'Unknown error'}`);
      return false;
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete a post');
      return false;
    }

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Post deleted successfully!');
      await fetchPosts();
      return true;
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(`Failed to delete post: ${error?.message || 'Unknown error'}`);
      return false;
    }
  };

  // Wait for auth to resolve before fetching to avoid race conditions
  useEffect(() => {
    if (authLoading) return;
    fetchPosts();
  }, [fetchPosts, authLoading]);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    deletePost
  };
};
