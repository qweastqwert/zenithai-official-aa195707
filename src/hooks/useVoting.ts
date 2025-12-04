import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VoteData {
  score: number;
  userVote: number | null;
}

export const usePostVoting = (postId: string) => {
  const [voteData, setVoteData] = useState<VoteData>({ score: 0, userVote: null });
  const [loading, setLoading] = useState(false);

  const fetchVotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get all votes for this post
    const { data: votes } = await supabase
      .from('post_votes')
      .select('vote_type, user_id')
      .eq('post_id', postId);

    const score = votes?.reduce((acc, v) => acc + v.vote_type, 0) || 0;
    const userVote = user ? votes?.find(v => v.user_id === user.id)?.vote_type || null : null;

    setVoteData({ score, userVote });
  };

  useEffect(() => {
    fetchVotes();
  }, [postId]);

  const vote = async (voteType: 1 | -1) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    setLoading(true);
    try {
      if (voteData.userVote === voteType) {
        // Remove vote
        await supabase
          .from('post_votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        setVoteData(prev => ({ score: prev.score - voteType, userVote: null }));
      } else if (voteData.userVote !== null) {
        // Change vote
        await supabase
          .from('post_votes')
          .update({ vote_type: voteType })
          .eq('post_id', postId)
          .eq('user_id', user.id);
        setVoteData(prev => ({ score: prev.score - prev.userVote! + voteType, userVote: voteType }));
      } else {
        // New vote
        await supabase
          .from('post_votes')
          .insert({ post_id: postId, user_id: user.id, vote_type: voteType });
        setVoteData(prev => ({ score: prev.score + voteType, userVote: voteType }));
      }
    } catch (error) {
      toast.error('Failed to vote');
      fetchVotes();
    } finally {
      setLoading(false);
    }
  };

  return { ...voteData, vote, loading };
};

export const useCommentVoting = (commentId: string) => {
  const [voteData, setVoteData] = useState<VoteData>({ score: 0, userVote: null });
  const [loading, setLoading] = useState(false);

  const fetchVotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: votes } = await supabase
      .from('comment_votes')
      .select('vote_type, user_id')
      .eq('comment_id', commentId);

    const score = votes?.reduce((acc, v) => acc + v.vote_type, 0) || 0;
    const userVote = user ? votes?.find(v => v.user_id === user.id)?.vote_type || null : null;

    setVoteData({ score, userVote });
  };

  useEffect(() => {
    fetchVotes();
  }, [commentId]);

  const vote = async (voteType: 1 | -1) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    setLoading(true);
    try {
      if (voteData.userVote === voteType) {
        await supabase
          .from('comment_votes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
        setVoteData(prev => ({ score: prev.score - voteType, userVote: null }));
      } else if (voteData.userVote !== null) {
        await supabase
          .from('comment_votes')
          .update({ vote_type: voteType })
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
        setVoteData(prev => ({ score: prev.score - prev.userVote! + voteType, userVote: voteType }));
      } else {
        await supabase
          .from('comment_votes')
          .insert({ comment_id: commentId, user_id: user.id, vote_type: voteType });
        setVoteData(prev => ({ score: prev.score + voteType, userVote: voteType }));
      }
    } catch (error) {
      toast.error('Failed to vote');
      fetchVotes();
    } finally {
      setLoading(false);
    }
  };

  return { ...voteData, vote, loading };
};
