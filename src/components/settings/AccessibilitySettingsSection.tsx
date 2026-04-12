import React, { useState, useEffect } from 'react';
import { Accessibility, Eye, EyeOff, Type, Palette, MousePointer, Volume2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getCookie, setCookie } from '@/utils/cookieUtils';

interface AccessibilityState {
  fontSize: number;
  highContrast: boolean;
  colorBlindMode: string;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
  dyslexicFont: boolean;
  readingGuide: boolean;
  lineHeight: number;
  cursorSize: string;
}

const DEFAULT_STATE: AccessibilityState = {
  fontSize: 100,
  highContrast: false,
  colorBlindMode: 'none',
  reduceMotion: false,
  screenReaderOptimized: false,
  dyslexicFont: false,
  readingGuide: false,
  lineHeight: 1.5,
  cursorSize: 'default',
};

const AccessibilitySettingsSection = () => {
  const [showButton, setShowButton] = useState(true);
  const [state, setState] = useState<AccessibilityState>(DEFAULT_STATE);

  useEffect(() => {
    const visible = getCookie('zenith-accessibility-visible');
    if (visible === 'false') setShowButton(false);

    // Load saved accessibility state
    const saved = getCookie('zenith-accessibility');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, []);

  const saveState = (newState: AccessibilityState) => {
    setState(newState);
    setCookie('zenith-accessibility', JSON.stringify(newState), 365);
    // Dispatch event so the floating widget picks up changes
    window.dispatchEvent(new Event('zenith-a11y-settings-changed'));
    applyEffects(newState);
  };

  const update = (updates: Partial<AccessibilityState>) => {
    const newState = { ...state, ...updates };
    saveState(newState);
  };

  const applyEffects = (s: AccessibilityState) => {
    const root = document.documentElement;
    root.style.zoom = `${s.fontSize}%`;
    root.style.lineHeight = `${s.lineHeight}`;
    
    if (s.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (s.dyslexicFont) {
      root.classList.add('dyslexic-font');
    } else {
      root.classList.remove('dyslexic-font');
    }
    
    if (s.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (s.screenReaderOptimized) {
      document.body.setAttribute('data-screen-reader-optimized', 'true');
    } else {
      document.body.removeAttribute('data-screen-reader-optimized');
    }
  };

  const toggleButton = (checked: boolean) => {
    setShowButton(checked);
    setCookie('zenith-accessibility-visible', String(checked), 365);
    window.dispatchEvent(new Event('zenith-a11y-visibility-changed'));
  };

  const resetAll = () => {
    saveState(DEFAULT_STATE);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Accessibility className="h-5 w-5" style={{ color: 'var(--zenith-primary)' }} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Accessibility</h3>
        </div>
        <Button variant="outline" size="sm" onClick={resetAll}>Reset All</Button>
      </div>

      <div className="space-y-4">
        {/* Show/Hide floating button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Floating Button</span>
            <span className="text-xs text-muted-foreground">
              {showButton ? 'Visible on screen' : 'Hidden — controls here only'}
            </span>
          </div>
          <Switch checked={showButton} onCheckedChange={toggleButton} />
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm">Text Size: {state.fontSize}%</Label>
          </div>
          <Slider
            value={[state.fontSize]}
            onValueChange={([v]) => update({ fontSize: v })}
            min={80}
            max={200}
            step={10}
            className="w-full"
          />
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <Label className="text-sm">Line Spacing: {state.lineHeight}x</Label>
          <Slider
            value={[state.lineHeight * 10]}
            onValueChange={([v]) => update({ lineHeight: v / 10 })}
            min={10}
            max={30}
            step={1}
            className="w-full"
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">High Contrast</span>
          </div>
          <Switch checked={state.highContrast} onCheckedChange={(v) => update({ highContrast: v })} />
        </div>

        {/* Color Blind Mode */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm">Color Blind Filter</Label>
          </div>
          <Select value={state.colorBlindMode} onValueChange={(v) => update({ colorBlindMode: v })}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="protanopia">Protanopia (Red)</SelectItem>
              <SelectItem value="deuteranopia">Deuteranopia (Green)</SelectItem>
              <SelectItem value="tritanopia">Tritanopia (Blue)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dyslexic Font */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Dyslexia-friendly Font</span>
          <Switch checked={state.dyslexicFont} onCheckedChange={(v) => update({ dyslexicFont: v })} />
        </div>

        {/* Reduce Motion */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Reduce Motion</span>
          <Switch checked={state.reduceMotion} onCheckedChange={(v) => update({ reduceMotion: v })} />
        </div>

        {/* Screen Reader */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Screen Reader Optimized</span>
          </div>
          <Switch checked={state.screenReaderOptimized} onCheckedChange={(v) => update({ screenReaderOptimized: v })} />
        </div>

        {/* Reading Guide */}
        <div className="flex items-center justify-between">
          <span className="text-sm">Reading Guide Line</span>
          <Switch checked={state.readingGuide} onCheckedChange={(v) => update({ readingGuide: v })} />
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettingsSection;
