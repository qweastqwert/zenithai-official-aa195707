import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TherapistBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

const TherapistBadge: React.FC<TherapistBadgeProps> = ({ className = '', size = 'sm' }) => {
  const iconSize = size === 'sm' ? 12 : 16;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className={`bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 transition-colors duration-200 ${className}`}
          >
            <Shield className={`w-${iconSize === 12 ? '3' : '4'} h-${iconSize === 12 ? '3' : '4'} mr-1`} />
            <CheckCircle className={`w-${iconSize === 12 ? '3' : '4'} h-${iconSize === 12 ? '3' : '4'} mr-1`} />
            Verified Therapist
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>This user is a verified licensed therapist</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TherapistBadge;