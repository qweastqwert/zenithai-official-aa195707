import type { ReactNode } from 'react';
import { Brain, Ear, Eye, Heart, MousePointer2, Palette, Shield, Type, Zap } from 'lucide-react';
import { getCookie, setCookie } from '@/utils/cookieUtils';

export const ACCESSIBILITY_COOKIE_KEY = 'zenith-accessibility';
export const ACCESSIBILITY_VISIBILITY_COOKIE_KEY = 'zenith-accessibility-visible';

export interface AccessibilityState {
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
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  focusHighlight: boolean;
  announcePageChanges: boolean;
  skipNavigation: boolean;
  lineHeight: number;
  cursorSpeed: 'normal' | 'slow';
  tooltipDelay: 'normal' | 'long';
  activePreset: string | null;
}

export interface Preset {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  category: 'disability' | 'mental';
  settings: Partial<AccessibilityState>;
}

export const DEFAULT_ACCESSIBILITY_STATE: AccessibilityState = {
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

export const ACCESSIBILITY_PRESETS: Preset[] = [
  {
    id: 'low-vision',
    name: 'Low Vision',
    icon: <Eye className="h-4 w-4" />,
    description: 'Larger text, higher contrast, and highlighted links.',
    category: 'disability',
    settings: { fontSize: 150, highContrast: true, highlightLinks: true, focusHighlight: true, lineHeight: 160 },
  },
  {
    id: 'color-blind-rg',
    name: 'Red-Green Color Blind',
    icon: <Palette className="h-4 w-4" />,
    description: 'Deuteranopia correction filter with clearer links.',
    category: 'disability',
    settings: { colorBlindMode: 'deuteranopia', highlightLinks: true },
  },
  {
    id: 'color-blind-b',
    name: 'Blue-Yellow Color Blind',
    icon: <Palette className="h-4 w-4" />,
    description: 'Tritanopia correction filter with clearer links.',
    category: 'disability',
    settings: { colorBlindMode: 'tritanopia', highlightLinks: true },
  },
  {
    id: 'motor-impairment',
    name: 'Motor Impairment',
    icon: <MousePointer2 className="h-4 w-4" />,
    description: 'Larger targets, stronger focus cues, and slower cursor behavior.',
    category: 'disability',
    settings: { largePointer: true, focusHighlight: true, skipNavigation: true, cursorSpeed: 'slow', reduceMotion: true },
  },
  {
    id: 'screen-reader',
    name: 'Screen Reader User',
    icon: <Ear className="h-4 w-4" />,
    description: 'Optimized semantics, announcements, and skip navigation.',
    category: 'disability',
    settings: { screenReader: true, focusHighlight: true, announcePageChanges: true, skipNavigation: true, reduceMotion: true },
  },
  {
    id: 'dyslexia',
    name: 'Dyslexia',
    icon: <Type className="h-4 w-4" />,
    description: 'OpenDyslexic font, extra spacing, and a reading guide.',
    category: 'disability',
    settings: { dyslexiaFont: true, textSpacing: true, readingGuide: true, lineHeight: 180 },
  },
  {
    id: 'adhd',
    name: 'ADHD',
    icon: <Zap className="h-4 w-4" />,
    description: 'Lower motion, calmer visuals, and a reading guide.',
    category: 'mental',
    settings: { reduceMotion: true, readingGuide: true, saturation: 70, muteSounds: true },
  },
  {
    id: 'anxiety',
    name: 'Anxiety',
    icon: <Heart className="h-4 w-4" />,
    description: 'Reduced motion, softer visuals, and quieter interactions.',
    category: 'mental',
    settings: { reduceMotion: true, saturation: 60, muteSounds: true },
  },
  {
    id: 'sensory-overload',
    name: 'Sensory Sensitivity',
    icon: <Shield className="h-4 w-4" />,
    description: 'Minimal stimulation with grayscale-like saturation and silence.',
    category: 'mental',
    settings: { reduceMotion: true, saturation: 0, muteSounds: true, highContrast: false },
  },
  {
    id: 'cognitive',
    name: 'Cognitive Support',
    icon: <Brain className="h-4 w-4" />,
    description: 'Larger text, extra spacing, and stronger focus indicators.',
    category: 'mental',
    settings: { fontSize: 120, textSpacing: true, lineHeight: 160, focusHighlight: true, reduceMotion: true, highlightLinks: true },
  },
];

const COLOR_BLIND_CLASSES = [
  'a11y-cb-protanopia',
  'a11y-cb-deuteranopia',
  'a11y-cb-tritanopia',
  'a11y-cb-achromatopsia',
];

const ensureLiveAnnouncer = (enabled: boolean) => {
  if (typeof document === 'undefined') return;

  const existing = document.getElementById('a11y-announcer');

  if (enabled) {
    if (existing) return;

    const announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    return;
  }

  existing?.remove();
};

export const loadAccessibilityState = (): AccessibilityState => {
  try {
    // Try localStorage first, fall back to cookie
    const saved = localStorage.getItem(ACCESSIBILITY_COOKIE_KEY) || getCookie(ACCESSIBILITY_COOKIE_KEY);
    if (!saved) return DEFAULT_ACCESSIBILITY_STATE;

    return {
      ...DEFAULT_ACCESSIBILITY_STATE,
      ...JSON.parse(saved),
    };
  } catch {
    return DEFAULT_ACCESSIBILITY_STATE;
  }
};

export const saveAccessibilityState = (state: AccessibilityState) => {
  const json = JSON.stringify(state);
  localStorage.setItem(ACCESSIBILITY_COOKIE_KEY, json);
  setCookie(ACCESSIBILITY_COOKIE_KEY, json, 8760);
};

export const loadAccessibilityVisibility = (): boolean => {
  const stored = localStorage.getItem(ACCESSIBILITY_VISIBILITY_COOKIE_KEY);
  if (stored !== null) return stored !== 'false';
  // Fall back to cookie
  return getCookie(ACCESSIBILITY_VISIBILITY_COOKIE_KEY) !== 'false';
};

export const saveAccessibilityVisibility = (visible: boolean) => {
  localStorage.setItem(ACCESSIBILITY_VISIBILITY_COOKIE_KEY, String(visible));
  setCookie(ACCESSIBILITY_VISIBILITY_COOKIE_KEY, String(visible), 8760);
};

export const applyAccessibilityState = (state: AccessibilityState) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const body = document.body;

  root.style.setProperty('--a11y-font-scale', `${state.fontSize / 100}`);
  body.style.zoom = state.fontSize !== 100 ? `${state.fontSize}%` : '';

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

  root.classList.remove(...COLOR_BLIND_CLASSES);
  if (state.colorBlindMode !== 'none') {
    root.classList.add(`a11y-cb-${state.colorBlindMode}`);
  }

  root.style.filter = state.saturation !== 100 ? `saturate(${state.saturation}%)` : '';

  root.classList.toggle('a11y-custom-line-height', state.lineHeight !== 100);
  root.style.setProperty('--a11y-line-height', `${state.lineHeight / 100}`);

  if (state.screenReader) {
    root.setAttribute('data-screen-reader-optimized', 'true');
    body.setAttribute('data-screen-reader-optimized', 'true');
  } else {
    root.removeAttribute('data-screen-reader-optimized');
    body.removeAttribute('data-screen-reader-optimized');
  }

  ensureLiveAnnouncer(state.announcePageChanges);
};