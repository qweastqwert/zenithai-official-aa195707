import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Calendar } from 'lucide-react';
import ReportDialog from './ReportDialog';
import { useCommunityComments } from '@/hooks/useCommunityComments';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { validateContentWithToast } from '@/utils/validateContent';
import { rateLimiter, RATE_LIMITS } from '@/utils/rateLimiter';
import { toast } from 'sonner';
import { useCommunityBans } from '@/hooks/useCommunityBans';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { comments, createComment, deleteComment, loading } = useCommunityComments(postId);
  const { user } = useAuth();
  const { isBanned, checkingBan } = useCommunityBans();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Check if user is banned
    if (isBanned) {
      toast.error('You are banned from commenting in the community');
      return;
    }

    // Rate limiting check
    const rateLimitKey = `comment_create_${user?.id || 'anonymous'}`;
    const rateLimitCheck = rateLimiter.checkLimit(rateLimitKey, RATE_LIMITS.COMMENT_CREATE);
    
    if (!rateLimitCheck.isAllowed) {
      toast.error(rateLimitCheck.message);
      return;
    }

    // Validate and filter comment
    const validatedComment = validateContentWithToast(newComment.trim(), {
      maxLength: 2000,
      fieldName: 'Comment',
    });
    if (!validatedComment) return;

    setIsSubmitting(true);
    const success = await createComment(validatedComment);
    if (success) {
      setNewComment('');
    }
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(commentId);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading comments...</div>;
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
            className="bg-background/50 border-border/50 resize-none"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Comment'}
            </Button>
          </div>
        </form>
      )}

      {!user && (
        <div className="text-center text-muted-foreground py-4">
          Please log in to comment
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
            <div
              key={comment.id}
              className="bg-muted/30 rounded-lg p-3 border border-border/30"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                  <span className="bg-muted px-2 py-0.5 rounded-full text-xs">Anonymous</span>
                </div>
                <div className="flex items-center gap-1">
                  <ReportDialog
                    type="comment"
                    contentId={comment.id}
                    reportedUserId={comment.user_id}
                  />
                  {user?.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-foreground/90 text-sm whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;