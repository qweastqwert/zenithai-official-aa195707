import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccessibilityPanelContent from '@/components/accessibility/AccessibilityPanelContent';
import {
  ACCESSIBILITY_PRESETS,
  DEFAULT_ACCESSIBILITY_STATE,
  applyAccessibilityState,
  loadAccessibilityState,
  loadAccessibilityVisibility,
  saveAccessibilityState,
  saveAccessibilityVisibility,
  type AccessibilityState,
  type Preset,
} from '@/components/accessibility/accessibilityPreferences';

export { DEFAULT_ACCESSIBILITY_STATE as DEFAULT_STATE, ACCESSIBILITY_PRESETS as PRESETS };
export type { AccessibilityState, Preset };

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [state, setState] = useState<AccessibilityState>(DEFAULT_ACCESSIBILITY_STATE);

  useEffect(() => {
    setState(loadAccessibilityState());
    setIsVisible(loadAccessibilityVisibility());
  }, []);

  useEffect(() => {
    const syncState = () => {
      setState(loadAccessibilityState());
    };

    const syncVisibility = () => {
      const visible = loadAccessibilityVisibility();
      setIsVisible(visible);
      if (!visible) {
        setIsOpen(false);
      }
    };

    window.addEventListener('zenith-a11y-settings-changed', syncState);
    window.addEventListener('zenith-a11y-visibility-changed', syncVisibility);

    return () => {
      window.removeEventListener('zenith-a11y-settings-changed', syncState);
      window.removeEventListener('zenith-a11y-visibility-changed', syncVisibility);
    };
  }, []);

  useEffect(() => {
    applyAccessibilityState(state);
  }, [state]);

  const persistState = (newState: AccessibilityState) => {
    setState(newState);
    saveAccessibilityState(newState);
    window.dispatchEvent(new Event('zenith-a11y-settings-changed'));
  };

  const update = (updates: Partial<AccessibilityState>) => {
    const newState = { ...state, ...updates, activePreset: null };
    persistState(newState);
  };

  const applyPreset = (preset: Preset) => {
    if (state.activePreset === preset.id) {
      persistState(DEFAULT_ACCESSIBILITY_STATE);
    } else {
      persistState({ ...DEFAULT_ACCESSIBILITY_STATE, ...preset.settings, activePreset: preset.id });
    }
  };

  const resetAll = () => {
    persistState(DEFAULT_ACCESSIBILITY_STATE);
  };

  const handleVisibilityChange = (visible: boolean) => {
    setIsVisible(visible);
    saveAccessibilityVisibility(visible);
    if (!visible) {
      setIsOpen(false);
    }
    window.dispatchEvent(new Event('zenith-a11y-visibility-changed'));
  };

  if (!isVisible) return (
    <>
      {state.readingGuide && <ReadingGuide />}
      <ColorBlindFilters />
    </>
  );

  return (
    <>
      {state.readingGuide && <ReadingGuide />}
      <ColorBlindFilters />
      
      {state.skipNavigation && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg"
        >
          Skip to main content
        </a>
      )}

      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-[60] w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Accessibility options"
        title="Accessibility options"
      >
        <Accessibility className="w-5 h-5" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-2 right-2 z-[61] flex max-h-[80vh] w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:bottom-24 sm:right-[4.5rem] sm:w-[340px] sm:max-h-[75vh]"
          >
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Accessibility</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={resetAll} className="h-7 text-xs px-2" title="Reset all">
                  <RotateCcw className="w-3 h-3 mr-1" /> Reset
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-7 w-7 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <AccessibilityPanelContent
                state={state}
                onUpdate={update}
                onApplyPreset={applyPreset}
                showVisibilityToggle
                isFloatingButtonVisible={isVisible}
                onVisibilityChange={handleVisibilityChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Reading guide
const ReadingGuide = () => {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = (e: MouseEvent) => setY(e.clientY);
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return <div className="fixed left-0 right-0 h-[3px] bg-primary/40 pointer-events-none z-[100]" style={{ top: y }} />;
};

// SVG filters for color-blind correction
const ColorBlindFilters = () => (
  <svg className="absolute w-0 h-0" aria-hidden="true">
    <defs>
      <filter id="cb-protanopia">
        <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
      </filter>
      <filter id="cb-deuteranopia">
        <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
      </filter>
      <filter id="cb-tritanopia">
        <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
      </filter>
      <filter id="cb-achromatopsia">
        <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0, 0, 0, 1, 0" />
      </filter>
    </defs>
  </svg>
);

export default AccessibilityWidget;
