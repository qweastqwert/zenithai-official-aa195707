import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, AlertTriangle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useJournalPin } from '@/hooks/useJournalPin';
import { useToast } from '@/hooks/use-toast';

interface PrivateSpaceGateProps {
  onUnlocked: () => void;
}

/**
 * Gate shown before the user can read or write into the Private Space.
 * - If they have no PIN yet, prompts them to create one (must confirm twice).
 * - Otherwise prompts for the PIN. After 5 wrong attempts, locks for 1 hour.
 * - Reset is intentionally NOT user-self-serve — they must contact the developer.
 */
const PrivateSpaceGate: React.FC<PrivateSpaceGateProps> = ({ onUnlocked }) => {
  const { hasPin, setPin, verifyPin, attemptState, maxAttempts } = useJournalPin();
  const { toast } = useToast();
  const [pin, setPinValue] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [busy, setBusy] = useState(false);

  const locked =
    attemptState.lockedUntil != null && attemptState.lockedUntil > Date.now();
  const minutesLeft = locked
    ? Math.ceil((attemptState.lockedUntil! - Date.now()) / 60000)
    : 0;

  const handleCreate = async () => {
    if (pin !== confirmPin) {
      toast({ title: 'PINs do not match', variant: 'destructive' });
      return;
    }
    setBusy(true);
    try {
      await setPin(pin);
      toast({ title: 'Private Space ready 🔒', description: 'Remember this PIN — it cannot be reset without the developer.' });
      onUnlocked();
    } catch (e: any) {
      toast({ title: 'Could not set PIN', description: e?.message ?? 'Try again', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async () => {
    setBusy(true);
    try {
      const ok = await verifyPin(pin);
      if (ok) {
        toast({ title: 'Unlocked 🔓' });
        onUnlocked();
      } else {
        toast({
          title: 'Wrong PIN',
          description: `Attempt ${attemptState.failed + 1} of ${maxAttempts}.`,
          variant: 'destructive',
        });
        setPinValue('');
      }
    } catch (e: any) {
      toast({ title: 'Blocked', description: e?.message ?? 'Try again later', variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  if (hasPin === null) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        Loading Private Space…
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 space-y-5"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold">
          {hasPin ? 'Enter your Private PIN' : 'Create a Private PIN'}
        </h3>
        <p className="text-xs text-muted-foreground">
          {hasPin
            ? 'Unlock to view and write private journal entries.'
            : '4–8 digits. This PIN protects your private entries and cannot be reset by you — only by the developer after careful verification.'}
        </p>
      </div>

      {locked ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm space-y-2">
          <div className="flex items-center gap-2 text-destructive font-medium">
            <AlertTriangle className="h-4 w-4" />
            Too many wrong attempts
          </div>
          <p className="text-muted-foreground text-xs">
            Try again in about {minutesLeft} minute{minutesLeft === 1 ? '' : 's'}, or email the developer to reset your PIN.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <Input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={8}
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPinValue(e.target.value.replace(/\D/g, ''))}
            className="text-center tracking-[0.5em] text-lg"
            autoFocus
          />
          {!hasPin && (
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              placeholder="Confirm PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              className="text-center tracking-[0.5em] text-lg"
            />
          )}
          <Button
            className="w-full"
            disabled={busy || pin.length < 4 || (!hasPin && confirmPin.length < 4)}
            onClick={hasPin ? handleVerify : handleCreate}
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            {hasPin ? 'Unlock Private Space' : 'Create PIN'}
          </Button>
        </div>
      )}

      {hasPin && (
        <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-1.5">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Mail className="h-3.5 w-3.5" /> Forgot your PIN?
          </div>
          <p>
            For your safety we don't allow self-reset. Email{' '}
            <a className="underline" href="mailto:support@zenithai.app?subject=Private%20Journal%20PIN%20Reset">
              support@zenithai.app
            </a>{' '}
            from your account email and the developer will verify your identity before clearing the PIN.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PrivateSpaceGate;