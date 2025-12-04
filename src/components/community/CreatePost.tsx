import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { validateContentWithToast } from '@/utils/validateContent';
import { motion } from 'framer-motion';
import TurnstileWidget from '@/components/TurnstileWidget';
import BanNotice from './BanNotice';
import { Shield, Send } from 'lucide-react';
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
  const [isAnonymous, setIsAnonymous] = useState(true);
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

    if (isBanned) {
      toast.error('You are banned from posting in the community');
      return;
    }

    const rateLimitKey = `post_create_${user?.id || 'anonymous'}`;
    const rateLimitCheck = rateLimiter.checkLimit(rateLimitKey, RATE_LIMITS.POST_CREATE);
    
    if (!rateLimitCheck.isAllowed) {
      toast.error(rateLimitCheck.message);
      return;
    }

    const validatedTitle = validateContentWithToast(title.trim(), {
      maxLength: 200,
      fieldName: 'Title',
    });
    if (!validatedTitle) return;

    const validatedDescription = validateContentWithToast(description.trim(), {
      maxLength: 2000,
      fieldName: 'Description',
    });
    if (!validatedDescription) return;

    setIsSubmitting(true);
    const success = await createPost(validatedTitle, validatedDescription, isAnonymous);
    setIsSubmitting(false);

    if (success) {
      setTitle('');
      setDescription('');
      setIsAnonymous(true);
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
    return <BanNotice />;
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-[#7950f2]/30 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-[#7950f2] to-[#b197fc]" />
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Send className="h-5 w-5 text-[#7950f2]" />
          Create New Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="bg-background/50 border-[#7950f2]/20 focus:border-[#7950f2]/50"
            />
          </div>
          <div>
            <Textarea
              placeholder="Share your thoughts, ask for advice, or start a discussion..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="bg-background/50 border-[#7950f2]/20 focus:border-[#7950f2]/50 resize-none"
            />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-[#7950f2]/5 rounded-lg border border-[#7950f2]/20">
            <Label htmlFor="anonymous-toggle" className="cursor-pointer">
              Post anonymously
            </Label>
            <Switch
              id="anonymous-toggle"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-[#7950f2]" />
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
              className="border-[#7950f2]/30 hover:border-[#7950f2] hover:bg-[#7950f2]/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !description.trim() || !turnstileToken || isSubmitting}
              className="bg-gradient-to-r from-[#7950f2] to-[#b197fc] hover:from-[#6741d9] hover:to-[#9775fa] text-white shadow-lg shadow-[#7950f2]/30"
            >
              {isSubmitting ? 'Posting...' : (isAnonymous ? 'Post Anonymously' : 'Post as ' + (user?.email?.split('@')[0] || 'User'))}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
