import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useReputation } from '@/hooks/useReputation';
import { supabase } from '@/integrations/supabase/client';
import { Award, TrendingUp, MessageSquare, FileText, Star, Crown, Gem, Sparkles, ThumbsUp } from 'lucide-react';
import ReputationBadge, { getReputationLevel } from './ReputationBadge';
import { Progress } from '@/components/ui/progress';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const milestones = [
  { points: 50, label: 'Active', icon: Sparkles },
  { points: 100, label: 'Contributor', icon: Award },
  { points: 500, label: 'Expert', icon: Gem },
  { points: 1000, label: 'Legend', icon: Crown },
];

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ open, onOpenChange, userId }) => {
  const { reputation, loading } = useReputation(userId);
  const [userName, setUserName] = useState<string>('User');
  const [postCount, setPostCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('user_id', userId)
        .single();
      
      if (profile?.name) setUserName(profile.name);

      const { count: posts } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      setPostCount(posts || 0);

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

  const level = getReputationLevel(reputation);
  const nextMilestone = milestones.find(m => m.points > reputation);
  const prevMilestone = [...milestones].reverse().find(m => m.points <= reputation);
  const progress = nextMilestone 
    ? ((reputation - (prevMilestone?.points || 0)) / (nextMilestone.points - (prevMilestone?.points || 0))) * 100
    : 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-xl">{userName}</span>
            <ReputationBadge reputation={reputation} />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* Reputation Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="p-3 rounded-full bg-primary/20">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Reputation</p>
              <p className="text-3xl font-bold text-primary">{loading ? '...' : reputation}</p>
            </div>
          </div>

          {/* Progress to Next Level */}
          {nextMilestone && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to {nextMilestone.label}</span>
                <span className="text-primary font-medium">{reputation} / {nextMilestone.points}</span>
              </div>
              <Progress value={progress} className="h-2 bg-primary/10" />
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <FileText className="h-5 w-5 text-primary/70" />
              <div>
                <p className="text-xs text-muted-foreground">Posts</p>
                <p className="text-lg font-semibold">{postCount}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <MessageSquare className="h-5 w-5 text-primary/70" />
              <div>
                <p className="text-xs text-muted-foreground">Comments</p>
                <p className="text-lg font-semibold">{commentCount}</p>
              </div>
            </div>
          </div>

          {/* Achievements/Milestones */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Achievements</h4>
            <div className="grid grid-cols-4 gap-2">
              {milestones.map((milestone) => {
                const Icon = milestone.icon;
                const isUnlocked = reputation >= milestone.points;
                return (
                  <div
                    key={milestone.points}
                    className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                      isUnlocked 
                        ? 'bg-primary/10 border-primary/30 text-primary' 
                        : 'bg-muted/30 border-border/50 text-muted-foreground opacity-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium">{milestone.label}</span>
                    <span className="text-[9px]">{milestone.points}+</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How to Earn */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1.5 text-foreground">Earn Reputation:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> Upvote: +1</span>
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> Post: +5</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Comment: +2</span>
                  <span className="text-destructive">Ban: -50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
