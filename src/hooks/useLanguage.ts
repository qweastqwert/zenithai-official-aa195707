import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '@/utils/cookieUtils';

export interface LanguageOption {
  code: string;
  label: string;
  native: string;
  group: 'indian' | 'international';
}

export const LANGUAGES: LanguageOption[] = [
  // Indian languages first (per request)
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', group: 'indian' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', group: 'indian' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', group: 'indian' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', group: 'indian' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', group: 'indian' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', group: 'indian' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', group: 'indian' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', group: 'indian' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', group: 'indian' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', group: 'indian' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া', group: 'indian' },
  { code: 'ur', label: 'Urdu', native: 'اردو', group: 'indian' },
  { code: 'sa', label: 'Sanskrit', native: 'संस्कृतम्', group: 'indian' },
  { code: 'hinglish', label: 'Hinglish', native: 'Hinglish', group: 'indian' },
  // International
  { code: 'en', label: 'English', native: 'English', group: 'international' },
  { code: 'es', label: 'Spanish', native: 'Español', group: 'international' },
  { code: 'fr', label: 'French', native: 'Français', group: 'international' },
  { code: 'de', label: 'German', native: 'Deutsch', group: 'international' },
  { code: 'pt', label: 'Portuguese', native: 'Português', group: 'international' },
  { code: 'ar', label: 'Arabic', native: 'العربية', group: 'international' },
  { code: 'zh', label: 'Chinese', native: '中文', group: 'international' },
  { code: 'ja', label: 'Japanese', native: '日本語', group: 'international' },
];

const STORAGE_KEY = 'zenith-language';

export const useLanguage = () => {
  const [language, setLanguageState] = useState<string>('en');

  useEffect(() => {
    const saved = getCookie(STORAGE_KEY);
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLanguageState(saved);
      document.documentElement.setAttribute('lang', saved);
    }
  }, []);

  const setLanguage = (code: string) => {
    setLanguageState(code);
    setCookie(STORAGE_KEY, code, 8760);
    document.documentElement.setAttribute('lang', code);
    window.dispatchEvent(new CustomEvent('zenith-language-change', { detail: { code } }));
  };

  return { language, setLanguage, languages: LANGUAGES };
};
