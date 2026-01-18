import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type TrendingPeriod = '24h' | 'week' | 'month' | 'all';

export interface TrendingPost {
  id: string;
  title: string;
  description: string;
  user_id: string | null;
  created_at: string;
  is_anonymous: boolean;
  vote_score: number;
}

export const useTrendingPosts = (period: TrendingPeriod = 'week') => {
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);

  const getTimeFilter = (period: TrendingPeriod): Date | null => {
    const now = new Date();
    switch (period) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'all':
        return null;
    }
  };

  const fetchTrendingPosts = async () => {
    try {
      setLoading(true);
      
      // Use the secure view that masks user_id for anonymous posts
      let postsQuery = supabase
        .from('community_posts_safe')
        .select('*');
      
      const timeFilter = getTimeFilter(period);
      if (timeFilter) {
        postsQuery = postsQuery.gte('created_at', timeFilter.toISOString());
      }
      
      const { data: postsData, error: postsError } = await postsQuery;
      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      // Get all votes for these posts
      const postIds = postsData.map(p => p.id);
      const { data: votesData, error: votesError } = await supabase
        .from('post_votes')
        .select('post_id, vote_type')
        .in('post_id', postIds);

      if (votesError) throw votesError;

      // Calculate vote scores
      const voteScores: Record<string, number> = {};
      (votesData || []).forEach(vote => {
        voteScores[vote.post_id] = (voteScores[vote.post_id] || 0) + vote.vote_type;
      });

      // Map posts with scores and sort by score
      const trendingPosts: TrendingPost[] = postsData
        .map(post => ({
          id: post.id,
          title: post.title,
          description: post.description,
          user_id: post.user_id,
          created_at: post.created_at,
          is_anonymous: post.is_anonymous,
          vote_score: voteScores[post.id] || 0
        }))
        .filter(post => post.vote_score > 0)
        .sort((a, b) => b.vote_score - a.vote_score)
        .slice(0, 5);

      setPosts(trendingPosts);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingPosts();
  }, [period]);

  return { posts, loading, refetch: fetchTrendingPosts };
};
