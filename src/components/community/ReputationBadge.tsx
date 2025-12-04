import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Star, Award, Crown, Gem, Sparkles } from 'lucide-react';

interface ReputationBadgeProps {
  reputation: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const getReputationLevel = (rep: number) => {
  if (rep >= 1000) return { 
    label: 'Legend', 
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0',
    icon: Crown,
    description: 'Community Legend - 1000+ reputation'
  };
  if (rep >= 500) return { 
    label: 'Expert', 
    color: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0',
    icon: Gem,
    description: 'Expert Contributor - 500+ reputation'
  };
  if (rep >= 100) return { 
    label: 'Contributor', 
    color: 'bg-gradient-to-r from-green-500 to-teal-500 text-white border-0',
    icon: Award,
    description: 'Active Contributor - 100+ reputation'
  };
  if (rep >= 50) return { 
    label: 'Active', 
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0',
    icon: Sparkles,
    description: 'Active Member - 50+ reputation'
  };
  return { 
    label: 'Newcomer', 
    color: 'bg-muted text-muted-foreground border-border',
    icon: Star,
    description: 'Community Newcomer'
  };
};

const ReputationBadge: React.FC<ReputationBadgeProps> = ({ reputation, showLabel = true, size = 'md' }) => {
  const level = getReputationLevel(reputation);
  const Icon = level.icon;
  
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';
  const badgeSize = size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${level.color} ${badgeSize} font-medium gap-1 cursor-default`}>
            <Icon className={iconSize} />
            {showLabel && level.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{level.description}</p>
          <p className="text-muted-foreground text-xs">{reputation} reputation points</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ReputationBadge;
