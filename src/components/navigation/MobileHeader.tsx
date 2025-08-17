
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
    <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 safe-area-inset-top">
      <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {showBack && onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {rightAction}
          {onSettings && (
            <Button variant="ghost" size="sm" onClick={onSettings} className="p-2">
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
