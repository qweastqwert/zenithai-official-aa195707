import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, X, ZoomIn, ZoomOut, Type, Eye, MousePointer2, 
  Volume2, VolumeX, Moon, Sun, Minus, Plus, RotateCcw, Ear
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getCookie, setCookie } from '@/utils/cookieUtils';

interface AccessibilityState {
  fontSize: number; // percentage 80-200
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexiaFont: boolean;
  largePointer: boolean;
  textSpacing: boolean;
  saturation: number; // 0-200
  highlightLinks: boolean;
  readingGuide: boolean;
  screenReader: boolean;
  muteSounds: boolean;
}

const DEFAULT_STATE: AccessibilityState = {
  fontSize: 100,
  highContrast: false,
  reduceMotion: false,
  dyslexiaFont: false,
  largePointer: false,
  textSpacing: false,
  saturation: 100,
  highlightLinks: false,
  readingGuide: false,
  screenReader: false,
  muteSounds: false,
};

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [state, setState] = useState<AccessibilityState>(DEFAULT_STATE);

  // Load saved state
  useEffect(() => {
    try {
      const saved = getCookie('zenith-accessibility');
      if (saved) setState({ ...DEFAULT_STATE, ...JSON.parse(saved) });
      const visible = getCookie('zenith-accessibility-visible');
      if (visible === 'false') setIsVisible(false);
    } catch {}
  }, []);

  const save = useCallback((newState: AccessibilityState) => {
    setCookie('zenith-accessibility', JSON.stringify(newState), 365);
  }, []);

  // Apply effects
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size - use CSS zoom for reliable scaling of all text including px-based
    root.style.setProperty('--a11y-font-scale', `${state.fontSize / 100}`);
    if (state.fontSize !== 100) {
      document.body.style.zoom = `${state.fontSize}%`;
    } else {
      document.body.style.zoom = '';
    }

    // High contrast
    root.classList.toggle('a11y-high-contrast', state.highContrast);
    
    // Reduce motion
    root.classList.toggle('a11y-reduce-motion', state.reduceMotion);
    
    // Dyslexia font
    root.classList.toggle('a11y-dyslexia-font', state.dyslexiaFont);
    
    // Large pointer
    root.classList.toggle('a11y-large-pointer', state.largePointer);
    
    // Text spacing
    root.classList.toggle('a11y-text-spacing', state.textSpacing);
    
    // Saturation
    root.style.setProperty('--a11y-saturation', `${state.saturation}%`);
    if (state.saturation !== 100) {
      root.style.filter = `saturate(${state.saturation}%)`;
    } else {
      root.style.filter = '';
    }
    
    // Highlight links
    root.classList.toggle('a11y-highlight-links', state.highlightLinks);
    
    // Reading guide
    root.classList.toggle('a11y-reading-guide', state.readingGuide);
    
    // Screen reader optimized
    root.setAttribute('data-screen-reader-optimized', state.screenReader ? 'true' : 'false');

    return () => {
      document.body.style.zoom = '';
      root.style.filter = '';
    };
  }, [state]);

  const update = (updates: Partial<AccessibilityState>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    save(newState);
  };

  const resetAll = () => {
    setState(DEFAULT_STATE);
    save(DEFAULT_STATE);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Reading guide line */}
      {state.readingGuide && <ReadingGuide />}
      
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
            className="fixed bottom-24 right-18 z-[61] w-80 max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
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

            <ScrollArea className="max-h-[calc(70vh-60px)]">
              <div className="p-4 space-y-4">
                
                {/* Text Size */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Text Size</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{state.fontSize}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => update({ fontSize: Math.max(80, state.fontSize - 10) })}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Slider
                      value={[state.fontSize]}
                      min={80}
                      max={200}
                      step={10}
                      onValueChange={([v]) => update({ fontSize: v })}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => update({ fontSize: Math.min(200, state.fontSize + 10) })}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Vision */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vision</p>
                  
                  <ToggleRow
                    icon={<Eye className="w-4 h-4" />}
                    label="High Contrast"
                    description="Increase color contrast"
                    checked={state.highContrast}
                    onChange={(v) => update({ highContrast: v })}
                  />

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Color Saturation</span>
                      <span className="text-xs text-muted-foreground ml-auto">{state.saturation}%</span>
                    </div>
                    <Slider
                      value={[state.saturation]}
                      min={0}
                      max={200}
                      step={10}
                      onValueChange={([v]) => update({ saturation: v })}
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Grayscale</span>
                      <span>Vivid</span>
                    </div>
                  </div>

                  <ToggleRow
                    icon={<MousePointer2 className="w-4 h-4" />}
                    label="Highlight Links"
                    description="Underline & color all links"
                    checked={state.highlightLinks}
                    onChange={(v) => update({ highlightLinks: v })}
                  />
                </div>

                <Separator />

                {/* Reading */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reading</p>
                  
                  <ToggleRow
                    icon={<Type className="w-4 h-4" />}
                    label="Dyslexia-Friendly Font"
                    description="Use OpenDyslexic typeface"
                    checked={state.dyslexiaFont}
                    onChange={(v) => update({ dyslexiaFont: v })}
                  />

                  <ToggleRow
                    icon={<Type className="w-4 h-4" />}
                    label="Increase Text Spacing"
                    description="More space between letters & lines"
                    checked={state.textSpacing}
                    onChange={(v) => update({ textSpacing: v })}
                  />

                  <ToggleRow
                    icon={<Minus className="w-4 h-4" />}
                    label="Reading Guide"
                    description="Horizontal line follows your cursor"
                    checked={state.readingGuide}
                    onChange={(v) => update({ readingGuide: v })}
                  />
                </div>

                <Separator />

                {/* Motor & Cognitive */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Motor & Cognitive</p>

                  <ToggleRow
                    icon={<MousePointer2 className="w-4 h-4" />}
                    label="Large Cursor"
                    description="Bigger click targets & cursor"
                    checked={state.largePointer}
                    onChange={(v) => update({ largePointer: v })}
                  />

                  <ToggleRow
                    icon={<Moon className="w-4 h-4" />}
                    label="Reduce Animations"
                    description="Minimize motion & transitions"
                    checked={state.reduceMotion}
                    onChange={(v) => update({ reduceMotion: v })}
                  />
                </div>

                <Separator />

                {/* Audio */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Audio</p>

                  <ToggleRow
                    icon={<Ear className="w-4 h-4" />}
                    label="Screen Reader Optimized"
                    description="Enhance ARIA labels & structure"
                    checked={state.screenReader}
                    onChange={(v) => update({ screenReader: v })}
                  />

                  <ToggleRow
                    icon={state.muteSounds ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    label="Mute All Sounds"
                    description="Silence background audio"
                    checked={state.muteSounds}
                    onChange={(v) => update({ muteSounds: v })}
                  />
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Toggle row sub-component
const ToggleRow = ({ icon, label, description, checked, onChange }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-start gap-2 min-w-0">
      <div className="mt-0.5 text-muted-foreground flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight">{label}</p>
        <p className="text-[11px] text-muted-foreground leading-tight">{description}</p>
      </div>
    </div>
    <Switch checked={checked} onCheckedChange={onChange} className="flex-shrink-0" />
  </div>
);

// Reading guide that follows mouse
const ReadingGuide = () => {
  const [y, setY] = useState(0);
  
  useEffect(() => {
    const handler = (e: MouseEvent) => setY(e.clientY);
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div
      className="fixed left-0 right-0 h-[3px] bg-primary/40 pointer-events-none z-[100]"
      style={{ top: y }}
    />
  );
};

export default AccessibilityWidget;
