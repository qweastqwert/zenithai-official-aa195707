
import { useEffect, useRef } from 'react';
import { setCookie, getCookie } from '@/utils/cookieUtils';

export const useJournalAutosave = (content: string, mood: string) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const AUTOSAVE_KEY = 'zenith-journal-draft';

  // Save draft with debouncing (only save if there's actual content)
  useEffect(() => {
    if (content?.trim() || mood) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const draft = { content, mood, timestamp: Date.now() };
        setCookie(AUTOSAVE_KEY, JSON.stringify(draft), 1); // 1 hour expiry
        console.log('Journal draft autosaved');
      }, 2000); // 2 second delay
    }

    return () => clearTimeout(timeoutRef.current);
  }, [content, mood]);

  const loadDraft = () => {
    try {
      const saved = getCookie(AUTOSAVE_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        // Only load if draft is recent (within 24 hours)
        if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
          return { content: draft.content || '', mood: draft.mood || '' };
        }
      }
    } catch (error) {
      console.error('Error loading journal draft:', error);
    }
    return { content: '', mood: '' };
  };

  const clearDraft = () => {
    setCookie(AUTOSAVE_KEY, '', -1); // Clear the cookie
    console.log('Journal draft cleared');
  };

  return { loadDraft, clearDraft };
};
