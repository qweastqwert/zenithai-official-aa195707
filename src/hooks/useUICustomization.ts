
import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '@/utils/cookieUtils';

export interface UICustomization {
  // Layout
  sidebarPosition: 'left' | 'right';
  headerStyle: 'floating' | 'fixed' | 'hidden';
  compactMode: boolean;
  uiScale: 'compact' | 'default' | 'comfortable' | 'large';
  
  // Typography
  fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  fontFamily: 'inter' | 'roboto' | 'open-sans' | 'poppins' | 'playfair' | 'serif' | 'mono' | 'dancing-script' | 'oswald' | 'merriweather';
  lineHeight: 'tight' | 'normal' | 'relaxed' | 'loose';
  fontWeight: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  letterSpacing: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider';
  
  // Spacing & Layout
  contentPadding: 'tight' | 'normal' | 'spacious';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  // Visual Effects
  shadows: boolean;
  animations: boolean;
  backgroundPattern: 'none' | 'dots' | 'grid' | 'waves' | 'gradient' | 'royal-velvet' | 'royal-marble' | 'royal-silk' | 'royal-gold' | 'royal-diamond';
  glassEffect: boolean;
  luxuryMode: boolean;
  
  // Colors (beyond theme)
  cardBackground: string;
  textColor: string;
  borderColor: string;
  
  // Accessibility
  highContrast: boolean;
  reduceMotion: boolean;
  focusIndicators: boolean;
  dyslexiaFont: boolean;
  screenReaderOptimized: boolean;
}

export const useUICustomization = () => {
  const [customization, setCustomization] = useState<UICustomization>({
    sidebarPosition: 'left',
    headerStyle: 'fixed',
    compactMode: false,
    uiScale: 'default',
    fontSize: 'base',
    fontFamily: 'inter',
    lineHeight: 'normal',
    fontWeight: 'normal',
    letterSpacing: 'normal',
    contentPadding: 'normal',
    borderRadius: 'md',
    shadows: true,
    animations: true,
    backgroundPattern: 'royal-velvet',
    glassEffect: false,
    luxuryMode: true,
    cardBackground: '',
    textColor: '',
    borderColor: '',
    highContrast: false,
    reduceMotion: false,
    focusIndicators: true,
    dyslexiaFont: false,
    screenReaderOptimized: false
  });

  useEffect(() => {
    const saved = getCookie('zenith-ui-customization');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomization(parsed);
        applyCustomization(parsed);
        console.log('UI customization loaded from cookies:', parsed);
      } catch (error) {
        console.error('Error parsing UI customization:', error);
      }
    } else {
      // Apply default luxury mode with royal velvet background
      applyCustomization(customization);
    }
  }, []);

  const applyCustomization = (settings: UICustomization) => {
    const root = document.documentElement;
    
    // Remove existing classes first
    root.classList.remove(
      'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
      'font-inter', 'font-roboto', 'font-open-sans', 'font-poppins', 'font-playfair', 
      'font-serif', 'font-mono', 'font-dancing-script', 'font-oswald', 'font-merriweather',
      'leading-tight', 'leading-normal', 'leading-relaxed', 'leading-loose',
      'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold',
      'tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider',
      'compact-mode', 'sidebar-right', 'header-floating', 'header-hidden',
      'padding-tight', 'padding-normal', 'padding-spacious',
      'no-shadows', 'no-animations', 'glass-effect', 'luxury-mode',
      'bg-dots', 'bg-grid', 'bg-waves', 'bg-gradient',
      'bg-royal-velvet', 'bg-royal-marble', 'bg-royal-silk', 'bg-royal-gold', 'bg-royal-diamond',
      'high-contrast', 'reduce-motion', 'focus-indicators',
      'ui-scale-compact', 'ui-scale-default', 'ui-scale-comfortable', 'ui-scale-large'
    );
    
    // UI Scale
    root.classList.add(`ui-scale-${settings.uiScale}`);
    const scaleMap: Record<string, string> = {
      compact: '0.88',
      default: '1',
      comfortable: '1.08',
      large: '1.16'
    };
    root.style.setProperty('--ui-scale', scaleMap[settings.uiScale] || '1');
    
    // Typography
    root.classList.add(`text-${settings.fontSize}`);
    root.classList.add(`font-${settings.fontFamily}`);
    root.classList.add(`leading-${settings.lineHeight}`);
    root.classList.add(`font-${settings.fontWeight}`);
    root.classList.add(`tracking-${settings.letterSpacing}`);
    
    // Layout
    if (settings.compactMode) root.classList.add('compact-mode');
    if (settings.sidebarPosition === 'right') root.classList.add('sidebar-right');
    if (settings.headerStyle === 'floating') root.classList.add('header-floating');
    if (settings.headerStyle === 'hidden') root.classList.add('header-hidden');
    
    // Spacing
    root.classList.add(`padding-${settings.contentPadding}`);
    
    // Border radius
    root.style.setProperty('--custom-radius', 
      settings.borderRadius === 'none' ? '0' :
      settings.borderRadius === 'sm' ? '0.125rem' :
      settings.borderRadius === 'md' ? '0.375rem' :
      settings.borderRadius === 'lg' ? '0.5rem' :
      settings.borderRadius === 'xl' ? '0.75rem' : '9999px'
    );
    
    // Visual effects
    if (!settings.shadows) root.classList.add('no-shadows');
    if (!settings.animations) root.classList.add('no-animations');
    if (settings.glassEffect) root.classList.add('glass-effect');
    if (settings.luxuryMode) root.classList.add('luxury-mode');
    
    // Background patterns including new royal themes
    if (settings.backgroundPattern !== 'none') {
      root.classList.add(`bg-${settings.backgroundPattern}`);
    }
    
    // Custom colors
    if (settings.cardBackground) {
      root.style.setProperty('--custom-card-bg', settings.cardBackground);
    }
    if (settings.textColor) {
      root.style.setProperty('--custom-text', settings.textColor);
    }
    if (settings.borderColor) {
      root.style.setProperty('--custom-border', settings.borderColor);
    }
    
    // Accessibility
    if (settings.highContrast) root.classList.add('high-contrast');
    if (settings.reduceMotion) root.classList.add('reduce-motion');
    if (settings.focusIndicators) root.classList.add('focus-indicators');
    if (settings.dyslexiaFont) root.classList.add('dyslexia-font');
    if (settings.screenReaderOptimized) root.setAttribute('data-screen-reader-optimized', 'true');
    else root.removeAttribute('data-screen-reader-optimized');

    // Apply luxury mode styles
    if (settings.luxuryMode) {
      root.style.setProperty('--transition-duration', '0.6s');
      root.style.setProperty('--transition-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
    } else {
      root.style.setProperty('--transition-duration', '0.3s');
      root.style.setProperty('--transition-timing', 'ease');
    }

    console.log('UI customization applied:', settings);
  };

  const updateCustomization = (updates: Partial<UICustomization>) => {
    const updated = { ...customization, ...updates };
    setCustomization(updated);
    setCookie('zenith-ui-customization', JSON.stringify(updated), 8760); // 1 year
    applyCustomization(updated);
    console.log('UI customization updated and saved:', updated);
  };

  const resetCustomization = () => {
    const defaultSettings: UICustomization = {
      sidebarPosition: 'left',
      headerStyle: 'fixed',
      compactMode: false,
      uiScale: 'default',
      fontSize: 'base',
      fontFamily: 'inter',
      lineHeight: 'normal',
      fontWeight: 'normal',
      letterSpacing: 'normal',
      contentPadding: 'normal',
      borderRadius: 'md',
      shadows: true,
      animations: true,
      backgroundPattern: 'royal-velvet',
      glassEffect: false,
      luxuryMode: true,
      cardBackground: '',
      textColor: '',
      borderColor: '',
      highContrast: false,
      reduceMotion: false,
      focusIndicators: true,
      dyslexiaFont: false,
      screenReaderOptimized: false
    };
    updateCustomization(defaultSettings);
    console.log('UI customization reset to luxury defaults');
  };

  return { customization, updateCustomization, resetCustomization };
};
