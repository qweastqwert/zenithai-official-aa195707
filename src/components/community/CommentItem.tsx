import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import ReportDialog from './ReportDialog';
import UserProfileDialog from './UserProfileDialog';
import { CommunityComment } from '@/hooks/useCommunityComments';

interface CommentItemProps {
  comment: CommunityComment;
  canDelete: boolean;
  onDelete: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, canDelete, onDelete }) => {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchUserName = async () => {
      if (!comment.is_anonymous && comment.user_id) {
        const { data } = await supabase
          .from('profiles')
          .select('name')
          .eq('user_id', comment.user_id)
          .single();
        
        if (data?.name) setUserName(data.name);
      }
    };

    fetchUserName();
  }, [comment.is_anonymous, comment.user_id]);

  return (
    <>
      <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
            {comment.is_anonymous ? (
              <Badge variant="outline" className="text-xs">Anonymous</Badge>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:underline text-xs flex items-center gap-1"
                onClick={() => setProfileDialogOpen(true)}
              >
                <User className="h-3 w-3" />
                {userName || 'User'}
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

      <UserProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        userId={comment.user_id}
      />
    </>
  );
};

export default CommentItem;
