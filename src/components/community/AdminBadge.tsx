import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AdminBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

const AdminBadge: React.FC<AdminBadgeProps> = ({ className = '', size = 'sm' }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className={`bg-gradient-to-r from-amber-500 to-rose-500 text-white border-0 hover:opacity-90 transition-opacity ${size === 'sm' ? 'text-[10px] px-1.5 py-0' : 'text-xs'} ${className}`}
          >
            <ShieldCheck className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} mr-1`} />
            Admin
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Zenith AI Administrator</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AdminBadge;
