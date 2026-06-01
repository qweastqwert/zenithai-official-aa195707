import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

/** Hash a PIN with salt using browser SubtleCrypto. */
async function hashPin(pin: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}::${pin}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

const SESSION_KEY = 'zenith-journal-private-unlocked';
const LOCAL_ATTEMPTS_KEY = 'zenith-journal-pin-attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 60 * 1000; // 1 hour

interface AttemptState {
  failed: number;
  lockedUntil: number | null;
}

function readAttempts(): AttemptState {
  try {
    const raw = localStorage.getItem(LOCAL_ATTEMPTS_KEY);
    if (!raw) return { failed: 0, lockedUntil: null };
    return JSON.parse(raw);
  } catch {
    return { failed: 0, lockedUntil: null };
  }
}
function writeAttempts(s: AttemptState) {
  localStorage.setItem(LOCAL_ATTEMPTS_KEY, JSON.stringify(s));
}

export const useJournalPin = () => {
  const { user } = useAuth();
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  );
  const [attemptState, setAttemptState] = useState<AttemptState>(readAttempts());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user) { setHasPin(false); return; }
      const { data, error } = await supabase
        .from('journal_private_pins')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.warn('PIN check error', error);
        setHasPin(false);
      } else {
        setHasPin(!!data);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  const setPin = useCallback(async (pin: string) => {
    if (!user) throw new Error('Must be signed in');
    if (!/^\d{4,8}$/.test(pin)) throw new Error('PIN must be 4–8 digits');
    const salt = randomSalt();
    const pin_hash = await hashPin(pin, salt);
    const { error } = await supabase
      .from('journal_private_pins')
      .insert({ user_id: user.id, pin_hash, salt });
    if (error) {
      // RLS only allows one INSERT — a duplicate means user already has a PIN.
      throw new Error('A PIN already exists. Contact the developer to reset it.');
    }
    setHasPin(true);
    sessionStorage.setItem(SESSION_KEY, '1');
    setIsUnlocked(true);
    writeAttempts({ failed: 0, lockedUntil: null });
    setAttemptState({ failed: 0, lockedUntil: null });
  }, [user]);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    if (!user) return false;
    const current = readAttempts();
    if (current.lockedUntil && current.lockedUntil > Date.now()) {
      throw new Error('Too many attempts. Try again later or contact the developer.');
    }
    const { data, error } = await supabase
      .from('journal_private_pins')
      .select('pin_hash, salt')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error || !data) throw new Error('PIN not found');
    const hash = await hashPin(pin, data.salt);
    const ok = hash === data.pin_hash;
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setIsUnlocked(true);
      writeAttempts({ failed: 0, lockedUntil: null });
      setAttemptState({ failed: 0, lockedUntil: null });
      return true;
    }
    const failed = current.failed + 1;
    const next: AttemptState =
      failed >= MAX_ATTEMPTS
        ? { failed, lockedUntil: Date.now() + LOCKOUT_MS }
        : { failed, lockedUntil: null };
    writeAttempts(next);
    setAttemptState(next);
    return false;
  }, [user]);

  const lock = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsUnlocked(false);
  }, []);

  return {
    hasPin,
    isUnlocked,
    setPin,
    verifyPin,
    lock,
    attemptState,
    maxAttempts: MAX_ATTEMPTS,
  };
};