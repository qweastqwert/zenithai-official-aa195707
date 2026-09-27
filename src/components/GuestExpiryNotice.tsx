import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GuestVerificationSection from '@/components/settings/GuestVerificationSection';

const LIFETIME_DAYS = 10;
const DAY = 24 * 60 * 60 * 1000;

/** Pops up for guest accounts, warning how long until the account is deleted. */
const GuestExpiryNotice: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const isGuest = !!user?.is_anonymous && !user.email && !(user as any).new_email;
  const deleteAt = user ? new Date(user.created_at).getTime() + LIFETIME_DAYS * DAY : 0;
  const msLeft = deleteAt - Date.now();
  const daysLeft = Math.max(0, Math.ceil(msLeft / DAY));
  const urgent = daysLeft <= 3;

  useEffect(() => {
    if (!isGuest) return;
    // Remind once per session; urgent warnings every 4 hours of use
    const key = 'zenith-guest-notice-at';
    const last = Number(sessionStorage.getItem(key) || 0);
    const gap = urgent ? 4 * 60 * 60 * 1000 : Infinity;
    if (!last || Date.now() - last > gap) {
      const t = setTimeout(() => { setOpen(true); sessionStorage.setItem(key, String(Date.now())); }, 2500);
      return () => clearTimeout(t);
    }
  }, [isGuest, urgent]);

  if (!isGuest) return null;

  const when = new Date(deleteAt).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className={urgent ? 'h-5 w-5 text-destructive' : 'h-5 w-5 text-primary'} />
            {daysLeft <= 1 ? 'Your guest account is deleted today' : `${daysLeft} days left on your guest account`}
          </DialogTitle>
          <DialogDescription>
            Guest accounts are permanently deleted {LIFETIME_DAYS} days after they're created — yours on <strong>{when}</strong>, along
            with your moods, journals and progress. Add an email to keep everything and stop the deletion.
          </DialogDescription>
        </DialogHeader>
        <GuestVerificationSection />
        <Button variant="ghost" onClick={() => setOpen(false)} className="w-full">Remind me later</Button>
      </DialogContent>
    </Dialog>
  );
};

export default GuestExpiryNotice;
