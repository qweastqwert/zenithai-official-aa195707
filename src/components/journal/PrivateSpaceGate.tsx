import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, AlertTriangle, Mail, KeyRound, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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
  const { user } = useAuth();
  const [pin, setPinValue] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [resetReason, setResetReason] = useState('');
  const [resetPhrase, setResetPhrase] = useState('');
  const [ack1, setAck1] = useState(false);
  const [ack2, setAck2] = useState(false);
  const [ack3, setAck3] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [existingRequest, setExistingRequest] = useState<{ id: string; status: string; created_at: string; expires_at?: string | null } | null>(null);
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNowTick(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const REQUIRED_PHRASE = 'I understand my private entries will remain inaccessible until reset';

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('pin_reset_requests')
        .select('id, status, created_at, expires_at')
        .eq('user_id', user.id)
        .in('status', ['pending'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) setExistingRequest((data as any) ?? null);
    })();
    return () => { cancelled = true; };
  }, [user, resetOpen]);

  const submitResetRequest = async () => {
    if (!user) return;
    if (resetPhrase.trim() !== REQUIRED_PHRASE) {
      toast({ title: 'Confirmation phrase does not match', variant: 'destructive' });
      return;
    }
    setResetBusy(true);
    try {
      const { error } = await supabase.from('pin_reset_requests').insert({
        user_id: user.id,
        user_email: user.email ?? null,
        user_display_name: user.user_metadata?.name ?? null,
        reason: resetReason.trim().slice(0, 1000),
        confirmation_phrase: resetPhrase.trim(),
      });
      if (error) throw error;
      toast({
        title: 'Reset request submitted',
        description: 'An admin will review it. You\'ll keep using the app normally; only your private journals stay locked until then.',
      });
      setResetOpen(false);
      setResetStep(1);
      setResetReason('');
      setResetPhrase('');
      setAck1(false); setAck2(false); setAck3(false);
    } catch (e: any) {
      toast({ title: 'Could not submit', description: e?.message ?? 'Try again', variant: 'destructive' });
    } finally {
      setResetBusy(false);
    }
  };

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
        <div className="rounded-xl bg-muted/40 p-3 text-[11px] text-muted-foreground space-y-2">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Mail className="h-3.5 w-3.5" /> Forgot your PIN?
          </div>
          {existingRequest ? (
            (() => {
              const exp = existingRequest.expires_at ? new Date(existingRequest.expires_at).getTime() : null;
              const msLeft = exp ? exp - nowTick : null;
              const expired = msLeft != null && msLeft <= 0;
              const hrs = msLeft != null ? Math.max(0, Math.floor(msLeft / 3_600_000)) : 0;
              const mins = msLeft != null ? Math.max(0, Math.floor((msLeft % 3_600_000) / 60_000)) : 0;
              return (
                <div className="space-y-1.5">
                  <p className="text-foreground/80">
                    You have a <strong>pending reset request</strong> submitted{' '}
                    {new Date(existingRequest.created_at).toLocaleDateString()}.
                  </p>
                  {expired ? (
                    <p className="text-destructive font-medium">
                      This request has expired. You can submit a new one below.
                    </p>
                  ) : msLeft != null ? (
                    <p className="text-[10px] text-muted-foreground">
                      Expires in <strong>{hrs}h {mins}m</strong>. An admin will review it soon.
                    </p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">An admin will review it soon.</p>
                  )}
                  {expired && (
                    <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => setResetOpen(true)}>
                      <KeyRound className="h-3 w-3 mr-1" /> Submit new request
                    </Button>
                  )}
                </div>
              );
            })()
          ) : (
            <>
              <p>
                Self-reset is disabled for your safety. Submit a reset request — an admin will verify and clear your PIN. Your private entries stay locked but safe until then.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                onClick={() => setResetOpen(true)}
              >
                <KeyRound className="h-3 w-3 mr-1" /> Request PIN reset
              </Button>
            </>
          )}
        </div>
      )}

      {/* Reset request dialog */}
      <Dialog open={resetOpen} onOpenChange={(o) => { setResetOpen(o); if (!o) setResetStep(1); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" /> Request PIN reset · Step {resetStep} of 3
            </DialogTitle>
            <DialogDescription>
              This is irreversible once approved. Read each step carefully.
            </DialogDescription>
          </DialogHeader>

          {resetStep === 1 && (
            <div className="space-y-3 text-sm">
              <p className="font-medium">Please acknowledge:</p>
              <label className="flex gap-2 items-start cursor-pointer">
                <Checkbox checked={ack1} onCheckedChange={(v) => setAck1(!!v)} />
                <span>I understand my <strong>private journal entries</strong> stay locked until an admin manually clears my PIN.</span>
              </label>
              <label className="flex gap-2 items-start cursor-pointer">
                <Checkbox checked={ack2} onCheckedChange={(v) => setAck2(!!v)} />
                <span>I confirm this account belongs to me and I'm not requesting on behalf of anyone else.</span>
              </label>
              <label className="flex gap-2 items-start cursor-pointer">
                <Checkbox checked={ack3} onCheckedChange={(v) => setAck3(!!v)} />
                <span>I accept that the admin may contact me using my account email to verify identity before approving.</span>
              </label>
            </div>
          )}

          {resetStep === 2 && (
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="font-medium">Why do you need a reset?</span>
                <Textarea
                  className="mt-1"
                  rows={4}
                  placeholder="E.g. I forgot my PIN after a long break, or I want to start fresh."
                  value={resetReason}
                  onChange={(e) => setResetReason(e.target.value.slice(0, 1000))}
                />
                <span className="text-[10px] text-muted-foreground">{resetReason.length}/1000</span>
              </label>
            </div>
          )}

          {resetStep === 3 && (
            <div className="space-y-3 text-sm">
              <p>Type this exact phrase to confirm:</p>
              <p className="rounded-md bg-muted px-3 py-2 font-mono text-xs">{REQUIRED_PHRASE}</p>
              <Input
                value={resetPhrase}
                onChange={(e) => setResetPhrase(e.target.value)}
                placeholder="Type the phrase exactly"
              />
            </div>
          )}

          <DialogFooter className="gap-2">
            {resetStep > 1 && (
              <Button variant="ghost" size="sm" onClick={() => setResetStep((s) => (s - 1) as 1 | 2)}>
                Back
              </Button>
            )}
            {resetStep < 3 ? (
              <Button
                size="sm"
                disabled={
                  (resetStep === 1 && !(ack1 && ack2 && ack3)) ||
                  (resetStep === 2 && resetReason.trim().length < 10)
                }
                onClick={() => setResetStep((s) => (s + 1) as 2 | 3)}
              >
                Continue
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={resetBusy || resetPhrase.trim() !== REQUIRED_PHRASE}
                onClick={submitResetRequest}
              >
                {resetBusy && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                Submit request
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PrivateSpaceGate;