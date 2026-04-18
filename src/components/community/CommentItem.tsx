import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import ReportDialog from './ReportDialog';
import UserProfileDialog from './UserProfileDialog';
import VoteButtons from './VoteButtons';
import ReputationBadge from './ReputationBadge';
import AdminBadge from './AdminBadge';
import { CommunityComment } from '@/hooks/useCommunityComments';
import { useCommentVoting } from '@/hooks/useVoting';

interface CommentItemProps {
  comment: CommunityComment;
  canDelete: boolean;
  onDelete: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, canDelete, onDelete }) => {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userReputation, setUserReputation] = useState<number>(0);
  const [authorIsAdmin, setAuthorIsAdmin] = useState(false);
  const { score, userVote, vote, loading: voteLoading } = useCommentVoting(comment.id);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!comment.is_anonymous && comment.user_id) {
        const [{ data }, { data: roleRow }] = await Promise.all([
          supabase
            .from('profiles')
            .select('name, reputation')
            .eq('user_id', comment.user_id)
            .maybeSingle(),
          supabase.rpc('get_user_role', { user_uuid: comment.user_id }),
        ]);

        if (data?.name) setUserName(data.name);
        if (data?.reputation !== undefined) setUserReputation(data.reputation);
        setAuthorIsAdmin(roleRow === 'admin');
      }
    };

    fetchUserData();
  }, [comment.is_anonymous, comment.user_id]);

  return (
    <>
      <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 hover:border-primary/20 transition-colors">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <VoteButtons
              score={score}
              userVote={userVote}
              onVote={vote}
              loading={voteLoading}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <Calendar className="h-3 w-3 text-primary/60" />
                <span>
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
                {comment.is_anonymous ? (
                  <Badge variant="outline" className="text-xs border-primary/30">Anonymous</Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:underline text-xs flex items-center gap-1.5 text-primary hover:text-primary/80"
                    onClick={() => setProfileDialogOpen(true)}
                  >
                    <User className="h-3 w-3" />
                    {userName || 'User'}
                    <ReputationBadge reputation={userReputation} showLabel={false} size="sm" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-1">
                <ReportDialog
                  type="comment"
                  contentId={comment.id}
                  reportedUserId={comment.user_id}
                />
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(comment.id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
          </div>
        </div>
      </div>

      <UserProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        userId={comment.user_id}
      />
    </>
  );
};

export default CommentItem;
