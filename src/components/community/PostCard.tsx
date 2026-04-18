import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Trash2, Calendar, User } from 'lucide-react';
import ReportDialog from './ReportDialog';
import UserProfileDialog from './UserProfileDialog';
import VoteButtons from './VoteButtons';
import ReputationBadge from './ReputationBadge';
import { CommunityPost, useCommunityPosts } from '@/hooks/useCommunityPosts';
import { useCommunityComments } from '@/hooks/useCommunityComments';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { usePostVoting } from '@/hooks/useVoting';
import { supabase } from '@/integrations/supabase/client';
import CommentSection from './CommentSection';
import AdminBadge from './AdminBadge';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: CommunityPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userReputation, setUserReputation] = useState<number>(0);
  const [authorIsAdmin, setAuthorIsAdmin] = useState(false);
  const { comments } = useCommunityComments(post.id);
  const { deletePost } = useCommunityPosts();
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { score, userVote, vote, loading: voteLoading } = usePostVoting(post.id);

  const canDelete = user?.id === post.user_id || isAdmin;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!post.is_anonymous && post.user_id) {
        const [{ data: profile }, { data: roleRow }] = await Promise.all([
          supabase
            .from('profiles')
            .select('name, username, reputation')
            .eq('user_id', post.user_id)
            .maybeSingle(),
          supabase.rpc('get_user_role', { user_uuid: post.user_id }),
        ]);

        if (profile) {
          setUserName(profile.username || profile.name || 'User');
          if (profile.reputation !== undefined) setUserReputation(profile.reputation);
        }
        setAuthorIsAdmin(roleRow === 'admin');
      }
    };

    fetchUserData();
  }, [post.is_anonymous, post.user_id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(post.id);
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/40 hover:border-border/60 transition-all duration-300 hover:shadow-lg">
      <div className="flex">
        <div className="flex flex-col items-center py-4 px-2 bg-muted/30 border-r border-border/20">
          <VoteButtons
            score={score}
            userVote={userVote}
            onVote={vote}
            loading={voteLoading}
          />
        </div>
        
        <div className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  <Calendar className="h-4 w-4 text-muted-foreground/60" />
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                  {post.is_anonymous ? (
                    <Badge variant="outline" className="text-xs border-border/50">Anonymous</Badge>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:underline text-xs flex items-center gap-1.5"
                        style={{ color: 'var(--zenith-primary)' }}
                        onClick={() => setProfileDialogOpen(true)}
                      >
                        <User className="h-3 w-3" />
                        {userName || 'User'}
                        <ReputationBadge reputation={userReputation} showLabel={false} size="sm" />
                      </Button>
                      {authorIsAdmin && <AdminBadge />}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <ReportDialog
                  type="post"
                  contentId={post.id}
                  reportedUserId={post.user_id}
                />
                {canDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    title={isAdmin && user?.id !== post.user_id ? 'Delete (admin moderation)' : 'Delete post'}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-foreground/90 mb-4 whitespace-pre-wrap">{post.description}</p>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="text-muted-foreground hover:bg-muted/50"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </Button>
            </div>

            {showComments && (
              <div className="mt-4 pt-4 border-t border-border/20">
                <CommentSection postId={post.id} />
              </div>
            )}
          </CardContent>
        </div>
      </div>
      
      <UserProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        userId={post.user_id}
      />
    </Card>
  );
};

export default PostCard;
