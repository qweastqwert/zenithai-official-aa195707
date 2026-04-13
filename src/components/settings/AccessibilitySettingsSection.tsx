import React, { useEffect, useState } from 'react';
import { Accessibility, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccessibilityPanelContent from '@/components/accessibility/AccessibilityPanelContent';
import {
  DEFAULT_ACCESSIBILITY_STATE,
  applyAccessibilityState,
  loadAccessibilityState,
  loadAccessibilityVisibility,
  saveAccessibilityState,
  saveAccessibilityVisibility,
  type AccessibilityState,
  type Preset,
} from '@/components/accessibility/accessibilityPreferences';

const AccessibilitySettingsSection = () => {
  const [showButton, setShowButton] = useState(true);
  const [state, setState] = useState<AccessibilityState>(DEFAULT_ACCESSIBILITY_STATE);

  useEffect(() => {
    setShowButton(loadAccessibilityVisibility());
    setState(loadAccessibilityState());
  }, []);

  const saveState = (newState: AccessibilityState) => {
    setState(newState);
    saveAccessibilityState(newState);
    applyAccessibilityState(newState);
    window.dispatchEvent(new Event('zenith-a11y-settings-changed'));
  };

  const update = (updates: Partial<AccessibilityState>) => {
    const newState = { ...state, ...updates, activePreset: null };
    saveState(newState);
  };

  const applyPreset = (preset: Preset) => {
    if (state.activePreset === preset.id) {
      saveState(DEFAULT_ACCESSIBILITY_STATE);
      return;
    }

    saveState({
      ...DEFAULT_ACCESSIBILITY_STATE,
      ...preset.settings,
      activePreset: preset.id,
    });
  };

  const toggleButton = (checked: boolean) => {
    setShowButton(checked);
    saveAccessibilityVisibility(checked);
    window.dispatchEvent(new Event('zenith-a11y-visibility-changed'));
  };

  const resetAll = () => {
    saveState(DEFAULT_ACCESSIBILITY_STATE);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Accessibility className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Accessibility</h3>
            <p className="text-xs text-muted-foreground">Use the same latest controls from the floating accessibility button.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={resetAll} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset All
        </Button>
      </div>

      <AccessibilityPanelContent
        state={state}
        onUpdate={update}
        onApplyPreset={applyPreset}
        showVisibilityToggle
        isFloatingButtonVisible={showButton}
        onVisibilityChange={toggleButton}
      />
    </div>
  );
};

export default AccessibilitySettingsSection;
