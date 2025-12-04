import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  score: number;
  userVote: number | null;
  onVote: (voteType: 1 | -1) => void;
  loading?: boolean;
  vertical?: boolean;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ 
  score, 
  userVote, 
  onVote, 
  loading = false,
  vertical = true 
}) => {
  const containerClass = vertical 
    ? 'flex flex-col items-center gap-0.5' 
    : 'flex items-center gap-1';

  return (
    <div className={containerClass}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-7 w-7 rounded-md transition-colors',
          userVote === 1 
            ? 'text-primary bg-primary/10 hover:bg-primary/20' 
            : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
        )}
        onClick={() => onVote(1)}
        disabled={loading}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
      
      <span className={cn(
        'text-sm font-semibold min-w-[2ch] text-center',
        score > 0 && 'text-primary',
        score < 0 && 'text-destructive',
        score === 0 && 'text-muted-foreground'
      )}>
        {score}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-7 w-7 rounded-md transition-colors',
          userVote === -1 
            ? 'text-destructive bg-destructive/10 hover:bg-destructive/20' 
            : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
        )}
        onClick={() => onVote(-1)}
        disabled={loading}
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default VoteButtons;
