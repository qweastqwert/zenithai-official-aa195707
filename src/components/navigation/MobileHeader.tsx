
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
  rightAction?: React.ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onSettings,
  rightAction
}) => {
  return (
    <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center space-x-2">
          {showBack && onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-1.5">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-1">
          {rightAction}
          {onSettings && (
            <Button variant="ghost" size="sm" onClick={onSettings} className="p-1.5">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
