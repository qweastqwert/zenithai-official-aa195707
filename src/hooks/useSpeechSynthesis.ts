import { useState, useCallback, useRef, useEffect } from 'react';

interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string, options?: SpeechOptions) => void;
  speakSequence: (items: SpeechItem[], onItemStart?: (index: number) => void) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
}

export interface SpeechItem {
  text: string;
  pauseAfter?: number; // milliseconds to pause after this item
  rate?: number;
  pitch?: number;
}

export const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sequenceAbortRef = useRef(false);
  
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    sequenceAbortRef.current = true;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 0.9;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;
    
    // Select a calm, soothing voice if available
    if (options.voice) {
      utterance.voice = options.voice;
    } else if (voices.length > 0) {
      // Prefer English female voices for calming effect
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const speakSequence = useCallback(async (
    items: SpeechItem[], 
    onItemStart?: (index: number) => void
  ) => {
    if (!isSupported || items.length === 0) return;

    sequenceAbortRef.current = false;
    setIsSpeaking(true);

    for (let i = 0; i < items.length; i++) {
      if (sequenceAbortRef.current) break;

      const item = items[i];
      onItemStart?.(i);

      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(item.text);
        utterance.rate = item.rate ?? 0.85;
        utterance.pitch = item.pitch ?? 1;
        
        // Select voice
        if (voices.length > 0) {
          const preferredVoice = voices.find(v => 
            v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
          ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      });

      // Wait for the pause duration if specified
      if (item.pauseAfter && !sequenceAbortRef.current) {
        await new Promise(resolve => setTimeout(resolve, item.pauseAfter));
      }
    }

    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported, voices]);

  return {
    speak,
    speakSequence,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
  };
};

export default useSpeechSynthesis;
