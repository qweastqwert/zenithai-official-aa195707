import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Trash2, Calendar } from 'lucide-react';
import { CommunityPost } from '@/hooks/useCommunityPosts';
import { useCommunityComments } from '@/hooks/useCommunityComments';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { useAuth } from '@/hooks/useAuth';
import CommentSection from './CommentSection';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: CommunityPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const { comments } = useCommunityComments(post.id);
  const { deletePost } = useCommunityPosts();
  const { user } = useAuth();

  const canDelete = user?.id === post.user_id;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(post.id);
    }
  };

  return (
    <Card className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
              <span className="text-xs bg-muted px-2 py-1 rounded-full">Anonymous</span>
            </div>
          </div>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-foreground/90 mb-4 whitespace-pre-wrap">{post.description}</p>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </Button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <CommentSection postId={post.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;