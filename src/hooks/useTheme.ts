
import { useState, useEffect } from 'react';

export interface ThemeSettings {
  isDarkMode: boolean;
  accentColor: string;
  ageTheme: string;
}

export const useTheme = () => {
  const [settings, setSettings] = useState<ThemeSettings>({
    isDarkMode: false,
    accentColor: 'purple',
    ageTheme: 'normal'
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('zenith-theme-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        applyTheme(parsed);
      } catch (error) {
        console.error('Error parsing theme settings:', error);
      }
    }
  }, []);

  const applyTheme = (themeSettings: ThemeSettings) => {
    const root = document.documentElement;
    
    // Remove all existing theme classes first
    root.classList.remove('dark', 'theme-kids', 'theme-teen', 'theme-young-adult', 'theme-mature', 'theme-senior');
    
    // Apply dark mode
    if (themeSettings.isDarkMode) {
      root.classList.add('dark');
    }
    
    // Apply age theme
    if (themeSettings.ageTheme !== 'normal') {
      root.classList.add(`theme-${themeSettings.ageTheme}`);
    }

    // Apply accent color with CSS variables
    const accentColors = {
      purple: {
        primary: '#7C3AED',
        secondary: '#A855F7',
        soft: '#E9D5FF'
      },
      blue: {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        soft: '#DBEAFE'
      },
      green: {
        primary: '#10B981',
        secondary: '#34D399',
        soft: '#D1FAE5'
      },
      pink: {
        primary: '#EC4899',
        secondary: '#F472B6',
        soft: '#FCE7F3'
      },
      orange: {
        primary: '#F97316',
        secondary: '#FB923C',
        soft: '#FED7AA'
      },
      teal: {
        primary: '#14B8A6',
        secondary: '#5EEAD4',
        soft: '#CCFBF1'
      },
      indigo: {
        primary: '#6366F1',
        secondary: '#818CF8',
        soft: '#E0E7FF'
      }
    };

    const colorSet = accentColors[themeSettings.accentColor as keyof typeof accentColors] || accentColors.purple;
    
    root.style.setProperty('--zenith-primary', colorSet.primary);
    root.style.setProperty('--zenith-secondary', colorSet.secondary);
    root.style.setProperty('--zenith-soft', colorSet.soft);
    
    // Update Tailwind CSS variables for consistency
    root.style.setProperty('--primary', colorSet.primary);
    root.style.setProperty('--primary-foreground', '#ffffff');

    // Apply theme-specific text and background colors
    applyThemeColors(themeSettings.ageTheme, themeSettings.isDarkMode);
  };

  const applyThemeColors = (ageTheme: string, isDarkMode: boolean) => {
    const root = document.documentElement;
    
    // Define theme-specific colors with proper contrast
    const themeColors = {
      kids: {
        light: {
          background: '#FFF7ED',
          foreground: '#1F2937',
          card: '#FFFFFF',
          cardForeground: '#1F2937',
          muted: '#FEF3C7',
          mutedForeground: '#374151'
        },
        dark: {
          background: '#1F2937',
          foreground: '#F9FAFB',
          card: '#374151',
          cardForeground: '#F9FAFB',
          muted: '#4B5563',
          mutedForeground: '#D1D5DB'
        }
      },
      teen: {
        light: {
          background: '#FAF5FF',
          foreground: '#1F2937',
          card: '#FFFFFF',
          cardForeground: '#1F2937',
          muted: '#E9D5FF',
          mutedForeground: '#374151'
        },
        dark: {
          background: '#1F1B24',
          foreground: '#F3F4F6',
          card: '#2D1B69',
          cardForeground: '#F3F4F6',
          muted: '#4C1D95',
          mutedForeground: '#E5E7EB'
        }
      },
      'young-adult': {
        light: {
          background: '#F0F9FF',
          foreground: '#1F2937',
          card: '#FFFFFF',
          cardForeground: '#1F2937',
          muted: '#E0F2FE',
          mutedForeground: '#374151'
        },
        dark: {
          background: '#0F172A',
          foreground: '#F1F5F9',
          card: '#1E293B',
          cardForeground: '#F1F5F9',
          muted: '#334155',
          mutedForeground: '#CBD5E1'
        }
      },
      mature: {
        light: {
          background: '#FFFBEB',
          foreground: '#1F2937',
          card: '#FFFFFF',
          cardForeground: '#1F2937',
          muted: '#FEF3C7',
          mutedForeground: '#374151'
        },
        dark: {
          background: '#1C1917',
          foreground: '#FAFAF9',
          card: '#292524',
          cardForeground: '#FAFAF9',
          muted: '#44403C',
          mutedForeground: '#D6D3D1'
        }
      },
      senior: {
        light: {
          background: '#F0FDF4',
          foreground: '#1F2937',
          card: '#FFFFFF',
          cardForeground: '#1F2937',
          muted: '#D1FAE5',
          mutedForeground: '#374151'
        },
        dark: {
          background: '#14532D',
          foreground: '#F7FEF0',
          card: '#166534',
          cardForeground: '#F7FEF0',
          muted: '#15803D',
          mutedForeground: '#BBF7D0'
        }
      }
    };

    if (ageTheme !== 'normal' && themeColors[ageTheme as keyof typeof themeColors]) {
      const colors = themeColors[ageTheme as keyof typeof themeColors][isDarkMode ? 'dark' : 'light'];
      
      root.style.setProperty('--background', colors.background);
      root.style.setProperty('--foreground', colors.foreground);
      root.style.setProperty('--card', colors.card);
      root.style.setProperty('--card-foreground', colors.cardForeground);
      root.style.setProperty('--muted', colors.muted);
      root.style.setProperty('--muted-foreground', colors.mutedForeground);
    }
  };

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('zenith-theme-settings', JSON.stringify(updated));
    applyTheme(updated);
    console.log('Theme settings updated:', updated);
  };

  const getAgeBasedTheme = (age: number): string => {
    if (age <= 12) return 'kids';
    if (age <= 17) return 'teen';
    if (age <= 30) return 'young-adult';
    if (age <= 60) return 'mature';
    return 'senior';
  };

  return { settings, updateSettings, getAgeBasedTheme };
};
