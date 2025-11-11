import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { validateContentWithToast } from '@/utils/validateContent';
import { motion } from 'framer-motion';
import TurnstileWidget from '@/components/TurnstileWidget';
import { Shield } from 'lucide-react';
import { rateLimiter, RATE_LIMITS } from '@/utils/rateLimiter';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useCommunityBans } from '@/hooks/useCommunityBans';

interface CreatePostProps {
  onCancel: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const { createPost } = useCommunityPosts();
  const { user } = useAuth();
  const { isBanned, checkingBan } = useCommunityBans();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!turnstileToken) {
      toast.error('Please complete the verification');
      return;
    }
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if user is banned
    if (isBanned) {
      toast.error('You are banned from posting in the community');
      return;
    }

    // Rate limiting check
    const rateLimitKey = `post_create_${user?.id || 'anonymous'}`;
    const rateLimitCheck = rateLimiter.checkLimit(rateLimitKey, RATE_LIMITS.POST_CREATE);
    
    if (!rateLimitCheck.isAllowed) {
      toast.error(rateLimitCheck.message);
      return;
    }

    // Validate title
    const validatedTitle = validateContentWithToast(title.trim(), {
      maxLength: 200,
      fieldName: 'Title',
    });
    if (!validatedTitle) return;

    // Validate description
    const validatedDescription = validateContentWithToast(description.trim(), {
      maxLength: 2000,
      fieldName: 'Description',
    });
    if (!validatedDescription) return;

    setIsSubmitting(true);
    const success = await createPost(validatedTitle, validatedDescription);
    setIsSubmitting(false);

    if (success) {
      setTitle('');
      setDescription('');
      onCancel();
    }
  };

  if (!user) {
    return null;
  }

  if (checkingBan) {
    return <div className="text-center text-muted-foreground">Checking permissions...</div>;
  }

  if (isBanned) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-destructive font-semibold">You are banned from the community</p>
            <p className="text-sm text-muted-foreground">
              You cannot create posts or comments at this time
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="bg-background/50 border-border/50"
            />
          </div>
          <div>
            <Textarea
              placeholder="Share your thoughts, ask for advice, or start a discussion..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="bg-background/50 border-border/50 resize-none"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Verify you're human to post</span>
            </div>
            <TurnstileWidget
              onVerify={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !description.trim() || !turnstileToken || isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Anonymously'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;