import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getCookie } from '@/utils/cookieUtils';

import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import gu from './locales/gu.json';
import hinglish from './locales/hinglish.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const savedLang = getCookie('zenith-language') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    bn: { translation: bn },
    ta: { translation: ta },
    te: { translation: te },
    gu: { translation: gu },
    hinglish: { translation: hinglish },
    es: { translation: es },
    fr: { translation: fr },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

if (typeof window !== 'undefined') {
  window.addEventListener('zenith-language-change', ((e: CustomEvent) => {
    i18n.changeLanguage(e.detail?.code || 'en');
  }) as EventListener);
}

export default i18n;
