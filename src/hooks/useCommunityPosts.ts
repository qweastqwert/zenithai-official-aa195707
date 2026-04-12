import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CommunityPost {
  id: string;
  title: string;
  description: string;
  user_id: string | null; // null for anonymous posts (security: hidden from non-owners)
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export const useCommunityPosts = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async (searchTerm?: string) => {
    try {
      setLoading(true);
      
      // Use the secure view that masks user_id for anonymous posts server-side
      let query = supabase
        .from('community_posts_safe')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // The secure view already masks user_id for anonymous posts server-side
      // This is a defense-in-depth client-side check as well
      const safePosts = (data || []).map(post => ({
        ...post,
        user_id: post.is_anonymous && post.user_id !== user?.id ? null : post.user_id
      })) as CommunityPost[];
      
      setPosts(safePosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
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
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts,
    createPost,
    deletePost
  };
};