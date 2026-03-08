import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, X, Type, Eye, MousePointer2, 
  Volume2, VolumeX, Moon, Minus, Plus, RotateCcw, Ear,
  Sun, Palette, Brain, Heart, Zap, Shield, Focus, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCookie, setCookie } from '@/utils/cookieUtils';

interface AccessibilityState {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexiaFont: boolean;
  largePointer: boolean;
  textSpacing: boolean;
  saturation: number;
  highlightLinks: boolean;
  readingGuide: boolean;
  screenReader: boolean;
  muteSounds: boolean;
  // New: Color-blind corrections
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  // New: Screen reader enhancements
  focusHighlight: boolean;
  announcePageChanges: boolean;
  skipNavigation: boolean;
  // New: Additional helpers
  lineHeight: number; // 100-200
  cursorSpeed: 'normal' | 'slow';
  tooltipDelay: 'normal' | 'long';
  // Active preset
  activePreset: string | null;
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
  colorBlindMode: 'none',
  focusHighlight: false,
  announcePageChanges: false,
  skipNavigation: false,
  lineHeight: 100,
  cursorSpeed: 'normal',
  tooltipDelay: 'normal',
  activePreset: null,
};

interface Preset {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: 'disability' | 'mental';
  settings: Partial<AccessibilityState>;
}

const PRESETS: Preset[] = [
  {
    id: 'low-vision',
    name: 'Low Vision',
    icon: <Eye className="w-4 h-4" />,
    description: 'Larger text, high contrast, highlighted links',
    category: 'disability',
    settings: { fontSize: 150, highContrast: true, highlightLinks: true, focusHighlight: true, lineHeight: 160 },
  },
  {
    id: 'color-blind-rg',
    name: 'Red-Green Color Blind',
    icon: <Palette className="w-4 h-4" />,
    description: 'Deuteranopia correction filter',
    category: 'disability',
    settings: { colorBlindMode: 'deuteranopia', highlightLinks: true },
  },
  {
    id: 'color-blind-b',
    name: 'Blue-Yellow Color Blind',
    icon: <Palette className="w-4 h-4" />,
    description: 'Tritanopia correction filter',
    category: 'disability',
    settings: { colorBlindMode: 'tritanopia', highlightLinks: true },
  },
  {
    id: 'motor-impairment',
    name: 'Motor Impairment',
    icon: <MousePointer2 className="w-4 h-4" />,
    description: 'Large targets, slow cursor, skip navigation',
    category: 'disability',
    settings: { largePointer: true, focusHighlight: true, skipNavigation: true, cursorSpeed: 'slow', reduceMotion: true },
  },
  {
    id: 'screen-reader',
    name: 'Screen Reader User',
    icon: <Ear className="w-4 h-4" />,
    description: 'Optimized ARIA, skip nav, page announcements',
    category: 'disability',
    settings: { screenReader: true, focusHighlight: true, announcePageChanges: true, skipNavigation: true, reduceMotion: true },
  },
  {
    id: 'dyslexia',
    name: 'Dyslexia',
    icon: <Type className="w-4 h-4" />,
    description: 'OpenDyslexic font, extra spacing, reading guide',
    category: 'disability',
    settings: { dyslexiaFont: true, textSpacing: true, readingGuide: true, lineHeight: 180 },
  },
  {
    id: 'adhd',
    name: 'ADHD',
    icon: <Zap className="w-4 h-4" />,
    description: 'Reduced motion, reading guide, muted colors',
    category: 'mental',
    settings: { reduceMotion: true, readingGuide: true, saturation: 70, muteSounds: true },
  },
  {
    id: 'anxiety',
    name: 'Anxiety',
    icon: <Heart className="w-4 h-4" />,
    description: 'Calm colors, no animations, muted sounds',
    category: 'mental',
    settings: { reduceMotion: true, saturation: 60, muteSounds: true },
  },
  {
    id: 'sensory-overload',
    name: 'Sensory Sensitivity',
    icon: <Shield className="w-4 h-4" />,
    description: 'Minimal stimulation, grayscale, silence',
    category: 'mental',
    settings: { reduceMotion: true, saturation: 0, muteSounds: true, highContrast: false },
  },
  {
    id: 'cognitive',
    name: 'Cognitive Support',
    icon: <Brain className="w-4 h-4" />,
    description: 'Simple layout, extra spacing, focus indicators',
    category: 'mental',
    settings: { fontSize: 120, textSpacing: true, lineHeight: 160, focusHighlight: true, reduceMotion: true, highlightLinks: true },
  },
];

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [state, setState] = useState<AccessibilityState>(DEFAULT_STATE);

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

  // Apply all effects
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size via zoom
    root.style.setProperty('--a11y-font-scale', `${state.fontSize / 100}`);
    document.body.style.zoom = state.fontSize !== 100 ? `${state.fontSize}%` : '';

    // Toggleable classes
    root.classList.toggle('a11y-high-contrast', state.highContrast);
    root.classList.toggle('a11y-reduce-motion', state.reduceMotion);
    root.classList.toggle('a11y-dyslexia-font', state.dyslexiaFont);
    root.classList.toggle('a11y-large-pointer', state.largePointer);
    root.classList.toggle('a11y-text-spacing', state.textSpacing);
    root.classList.toggle('a11y-highlight-links', state.highlightLinks);
    root.classList.toggle('a11y-reading-guide', state.readingGuide);
    root.classList.toggle('a11y-focus-highlight', state.focusHighlight);
    root.classList.toggle('a11y-skip-nav', state.skipNavigation);
    root.classList.toggle('a11y-slow-cursor', state.cursorSpeed === 'slow');

    // Color blind filter + saturation combined
    const filters: string[] = [];
    if (state.saturation !== 100) filters.push(`saturate(${state.saturation}%)`);
    
    // Color blind SVG filters are applied via CSS class
    root.classList.remove('a11y-cb-protanopia', 'a11y-cb-deuteranopia', 'a11y-cb-tritanopia', 'a11y-cb-achromatopsia');
    if (state.colorBlindMode !== 'none') {
      root.classList.add(`a11y-cb-${state.colorBlindMode}`);
    }
    
    root.style.filter = filters.length ? filters.join(' ') : '';
    
    // Line height
    if (state.lineHeight !== 100) {
      root.style.setProperty('--a11y-line-height', `${state.lineHeight / 100}`);
      root.classList.add('a11y-custom-line-height');
    } else {
      root.classList.remove('a11y-custom-line-height');
    }

    // Screen reader
    root.setAttribute('data-screen-reader-optimized', state.screenReader ? 'true' : 'false');
    
    // Page change announcements
    if (state.announcePageChanges) {
      let announcer = document.getElementById('a11y-announcer');
      if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'a11y-announcer';
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
      }
    }

    return () => {
      document.body.style.zoom = '';
      root.style.filter = '';
    };
  }, [state]);

  const update = (updates: Partial<AccessibilityState>) => {
    const newState = { ...state, ...updates, activePreset: null };
    setState(newState);
    save(newState);
  };

  const applyPreset = (preset: Preset) => {
    if (state.activePreset === preset.id) {
      // Deactivate - reset to defaults
      setState(DEFAULT_STATE);
      save(DEFAULT_STATE);
    } else {
      const newState = { ...DEFAULT_STATE, ...preset.settings, activePreset: preset.id };
      setState(newState);
      save(newState);
    }
  };

  const resetAll = () => {
    setState(DEFAULT_STATE);
    save(DEFAULT_STATE);
  };

  if (!isVisible) return null;

  return (
    <>
      {state.readingGuide && <ReadingGuide />}
      
      {/* SVG color-blind filters (hidden) */}
      <ColorBlindFilters />
      
      {/* Skip navigation link */}
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
            className="fixed bottom-24 right-18 z-[61] w-[340px] max-h-[75vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
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

            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="w-full grid grid-cols-2 rounded-none border-b border-border bg-muted/30 h-9">
                <TabsTrigger value="settings" className="text-xs data-[state=active]:bg-background rounded-none">
                  <Sparkles className="w-3 h-3 mr-1" /> Settings
                </TabsTrigger>
                <TabsTrigger value="presets" className="text-xs data-[state=active]:bg-background rounded-none">
                  <Brain className="w-3 h-3 mr-1" /> Presets
                </TabsTrigger>
              </TabsList>

              {/* SETTINGS TAB */}
              <TabsContent value="settings" className="mt-0">
                <ScrollArea className="max-h-[calc(75vh-100px)]">
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
                        <Slider value={[state.fontSize]} min={80} max={200} step={10} onValueChange={([v]) => update({ fontSize: v })} className="flex-1" />
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => update({ fontSize: Math.min(200, state.fontSize + 10) })}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Line Height */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Type className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Line Height</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{state.lineHeight}%</span>
                      </div>
                      <Slider value={[state.lineHeight]} min={100} max={200} step={10} onValueChange={([v]) => update({ lineHeight: v })} />
                    </div>

                    <Separator />

                    {/* Vision & Color */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vision & Color</p>
                      
                      <ToggleRow icon={<Eye className="w-4 h-4" />} label="High Contrast" description="Increase color contrast" checked={state.highContrast} onChange={(v) => update({ highContrast: v })} />

                      {/* Color Blind Mode */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Color Blind Correction</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => update({ colorBlindMode: mode })}
                              className={`text-[11px] px-2 py-1.5 rounded-md border transition-colors ${
                                state.colorBlindMode === mode
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-muted/50 text-foreground border-border hover:bg-muted'
                              }`}
                            >
                              {mode === 'none' ? 'None' : 
                               mode === 'protanopia' ? 'Protanopia' :
                               mode === 'deuteranopia' ? 'Deuteranopia' :
                               mode === 'tritanopia' ? 'Tritanopia' : 'Achromatopsia'}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {state.colorBlindMode === 'protanopia' && 'Red-blind correction'}
                          {state.colorBlindMode === 'deuteranopia' && 'Green-blind correction'}
                          {state.colorBlindMode === 'tritanopia' && 'Blue-yellow correction'}
                          {state.colorBlindMode === 'achromatopsia' && 'Complete color blindness'}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Saturation</span>
                          <span className="text-xs text-muted-foreground ml-auto">{state.saturation}%</span>
                        </div>
                        <Slider value={[state.saturation]} min={0} max={200} step={10} onValueChange={([v]) => update({ saturation: v })} />
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Grayscale</span><span>Vivid</span>
                        </div>
                      </div>

                      <ToggleRow icon={<MousePointer2 className="w-4 h-4" />} label="Highlight Links" description="Underline & color all links" checked={state.highlightLinks} onChange={(v) => update({ highlightLinks: v })} />
                    </div>

                    <Separator />

                    {/* Reading */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reading</p>
                      <ToggleRow icon={<Type className="w-4 h-4" />} label="Dyslexia-Friendly Font" description="Use OpenDyslexic typeface" checked={state.dyslexiaFont} onChange={(v) => update({ dyslexiaFont: v })} />
                      <ToggleRow icon={<Type className="w-4 h-4" />} label="Text Spacing" description="More space between letters & lines" checked={state.textSpacing} onChange={(v) => update({ textSpacing: v })} />
                      <ToggleRow icon={<Minus className="w-4 h-4" />} label="Reading Guide" description="Horizontal line follows cursor" checked={state.readingGuide} onChange={(v) => update({ readingGuide: v })} />
                    </div>

                    <Separator />

                    {/* Motor & Navigation */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Motor & Navigation</p>
                      <ToggleRow icon={<MousePointer2 className="w-4 h-4" />} label="Large Cursor & Targets" description="Bigger click targets & cursor" checked={state.largePointer} onChange={(v) => update({ largePointer: v })} />
                      <ToggleRow icon={<Moon className="w-4 h-4" />} label="Reduce Animations" description="Minimize motion & transitions" checked={state.reduceMotion} onChange={(v) => update({ reduceMotion: v })} />
                      <ToggleRow icon={<Focus className="w-4 h-4" />} label="Focus Indicators" description="Strong visible focus outlines" checked={state.focusHighlight} onChange={(v) => update({ focusHighlight: v })} />
                      <ToggleRow icon={<Zap className="w-4 h-4" />} label="Skip Navigation" description="Keyboard shortcut to skip to content" checked={state.skipNavigation} onChange={(v) => update({ skipNavigation: v })} />
                    </div>

                    <Separator />

                    {/* Screen Reader & Audio */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Screen Reader & Audio</p>
                      <ToggleRow icon={<Ear className="w-4 h-4" />} label="Screen Reader Optimized" description="Enhanced ARIA labels & structure" checked={state.screenReader} onChange={(v) => update({ screenReader: v })} />
                      <ToggleRow icon={<Ear className="w-4 h-4" />} label="Announce Page Changes" description="Read route changes aloud" checked={state.announcePageChanges} onChange={(v) => update({ announcePageChanges: v })} />
                      <ToggleRow icon={state.muteSounds ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />} label="Mute All Sounds" description="Silence background audio" checked={state.muteSounds} onChange={(v) => update({ muteSounds: v })} />
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* PRESETS TAB */}
              <TabsContent value="presets" className="mt-0">
                <ScrollArea className="max-h-[calc(75vh-100px)]">
                  <div className="p-4 space-y-4">
                    
                    {/* Disability Presets */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disability Support</p>
                      <div className="space-y-2">
                        {PRESETS.filter(p => p.category === 'disability').map((preset) => (
                          <PresetCard
                            key={preset.id}
                            preset={preset}
                            isActive={state.activePreset === preset.id}
                            onToggle={() => applyPreset(preset)}
                          />
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Mental Health Presets */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mental Health Support</p>
                      <div className="space-y-2">
                        {PRESETS.filter(p => p.category === 'mental').map((preset) => (
                          <PresetCard
                            key={preset.id}
                            preset={preset}
                            isActive={state.activePreset === preset.id}
                            onToggle={() => applyPreset(preset)}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground text-center pt-2">
                      Tap a preset to activate. Tap again to deactivate.
                      You can further customize in the Settings tab.
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Preset card component
const PresetCard = ({ preset, isActive, onToggle }: { preset: Preset; isActive: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`w-full text-left p-3 rounded-xl border transition-all ${
      isActive
        ? 'bg-primary/10 border-primary shadow-sm'
        : 'bg-muted/30 border-border hover:bg-muted/60'
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 p-1.5 rounded-lg ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {preset.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{preset.name}</p>
          {isActive && (
            <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-medium">Active</span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{preset.description}</p>
      </div>
    </div>
  </button>
);

// Toggle row sub-component
const ToggleRow = ({ icon, label, description, checked, onChange }: {
  icon: React.ReactNode; label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
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
      {/* Protanopia (red-blind) */}
      <filter id="cb-protanopia">
        <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
      </filter>
      {/* Deuteranopia (green-blind) */}
      <filter id="cb-deuteranopia">
        <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
      </filter>
      {/* Tritanopia (blue-yellow blind) */}
      <filter id="cb-tritanopia">
        <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
      </filter>
      {/* Achromatopsia (complete color blindness) */}
      <filter id="cb-achromatopsia">
        <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0.299, 0.587, 0.114, 0, 0  0, 0, 0, 1, 0" />
      </filter>
    </defs>
  </svg>
);

export default AccessibilityWidget;
