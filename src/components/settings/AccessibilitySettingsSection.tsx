import React, { useState, useEffect } from 'react';
import { Accessibility, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { getCookie, setCookie } from '@/utils/cookieUtils';

const AccessibilitySettingsSection = () => {
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const visible = getCookie('zenith-accessibility-visible');
    if (visible === 'false') setShowButton(false);
  }, []);

  const toggleButton = (checked: boolean) => {
    setShowButton(checked);
    setCookie('zenith-accessibility-visible', String(checked), 365);
    window.dispatchEvent(new Event('zenith-a11y-visibility-changed'));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Accessibility className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Accessibility</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-gray-100">Show Accessibility Button</span>
            <span className="text-sm text-muted-foreground">
              {showButton ? 'Floating button visible on screen' : 'Button hidden — access via Settings only'}
            </span>
          </div>
          <Switch checked={showButton} onCheckedChange={toggleButton} />
        </div>
        <p className="text-xs text-muted-foreground">
          You can always access accessibility options from this Settings page, even when the floating button is hidden.
        </p>
      </div>
    </div>
  );
};

export default AccessibilitySettingsSection;
