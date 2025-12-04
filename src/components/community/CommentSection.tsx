import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MessageCircle } from 'lucide-react';
import CommentItem from './CommentItem';
import { useCommunityComments } from '@/hooks/useCommunityComments';
import { useAuth } from '@/hooks/useAuth';
import { validateContentWithToast } from '@/utils/validateContent';
import { rateLimiter, RATE_LIMITS } from '@/utils/rateLimiter';
import { toast } from 'sonner';
import { useCommunityBans } from '@/hooks/useCommunityBans';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { comments, createComment, deleteComment, loading } = useCommunityComments(postId);
  const { user } = useAuth();
  const { isBanned } = useCommunityBans();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (isBanned) {
      toast.error('You are banned from commenting in the community');
      return;
    }

    const rateLimitKey = `comment_create_${user?.id || 'anonymous'}`;
    const rateLimitCheck = rateLimiter.checkLimit(rateLimitKey, RATE_LIMITS.COMMENT_CREATE);
    
    if (!rateLimitCheck.isAllowed) {
      toast.error(rateLimitCheck.message);
      return;
    }

    const validatedComment = validateContentWithToast(newComment.trim(), {
      maxLength: 2000,
      fieldName: 'Comment',
    });
    if (!validatedComment) return;

    setIsSubmitting(true);
    const success = await createComment(validatedComment, isAnonymous);
    if (success) {
      setNewComment('');
      setIsAnonymous(true);
    }
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      {/* New Comment Form */}
      {user && !isBanned && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <Textarea
            placeholder="Share your thoughts or advice..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="bg-background/50 border-[#7950f2]/20 focus:border-[#7950f2]/50 resize-none"
          />
          
          <div className="flex items-center justify-between p-2 bg-[#7950f2]/5 rounded-lg border border-[#7950f2]/20">
            <Label htmlFor="comment-anonymous" className="cursor-pointer text-sm">
              Comment anonymously
            </Label>
            <Switch
              id="comment-anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || isSubmitting}
              className="bg-gradient-to-r from-[#7950f2] to-[#b197fc] hover:from-[#6741d9] hover:to-[#9775fa] text-white shadow-lg shadow-[#7950f2]/20"
            >
              {isSubmitting ? 'Posting...' : 'Comment'}
            </Button>
          </div>
        </form>
      )}

      {!user && (
        <div className="text-center text-muted-foreground py-4 flex items-center justify-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Please log in to comment and vote
        </div>
      )}

      {user && isBanned && (
        <div className="text-center text-destructive py-4">
          You are banned from commenting in the community
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              canDelete={user?.id === comment.user_id}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
