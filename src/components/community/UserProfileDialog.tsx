import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useReputation } from '@/hooks/useReputation';
import { supabase } from '@/integrations/supabase/client';
import { Award, TrendingUp, MessageSquare, FileText } from 'lucide-react';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ open, onOpenChange, userId }) => {
  const { reputation, loading } = useReputation(userId);
  const [userName, setUserName] = useState<string>('User');
  const [postCount, setPostCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch user name
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', userId)
        .single();
      
      if (profile?.name) setUserName(profile.name);

      // Fetch post count
      const { count: posts } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      setPostCount(posts || 0);

      // Fetch comment count
      const { count: comments } = await supabase
        .from('community_comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      setCommentCount(comments || 0);
    };

    if (open && userId) {
      fetchUserData();
    }
  }, [open, userId]);

  const getReputationLevel = (rep: number) => {
    if (rep >= 1000) return { label: 'Legend', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' };
    if (rep >= 500) return { label: 'Expert', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
    if (rep >= 100) return { label: 'Contributor', color: 'bg-green-500/10 text-green-500 border-green-500/20' };
    if (rep >= 50) return { label: 'Active', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
    return { label: 'Newcomer', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
  };

  const level = getReputationLevel(reputation);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{userName}</span>
            <Badge className={level.color}>{level.label}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-muted/50">
            <Award className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Reputation</p>
              <p className="text-2xl font-bold">{loading ? '...' : reputation}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Posts</p>
                <p className="text-lg font-semibold">{postCount}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Comments</p>
                <p className="text-lg font-semibold">{commentCount}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Reputation Points:</p>
                <p>• Post: +5 points</p>
                <p>• Comment: +2 points</p>
                <p>• Ban: -50 points</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
