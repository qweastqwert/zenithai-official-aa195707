import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, Phone, Wind, MessageSquare, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

/**
 * Persistent floating SOS button — bottom-right on the marketing page and dashboard.
 * Opens a sheet with crisis helplines, a 60-sec grounding launcher, and a
 * pre-filled SMS to the user's saved emergency contact (when configured).
 *
 * Sits above MobileNavigation by respecting safe-area inset, hides on small
 * screens when the user explicitly opens a fullscreen flow.
 */
const SosButton: React.FC<{ hidden?: boolean }> = ({ hidden }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { profile } = useProfile() as any;

  if (hidden) return null;

  const contactName: string | undefined = profile?.emergency_contact_name;
  const contactPhone: string | undefined = profile?.emergency_contact_phone;
  const smsBody = encodeURIComponent(
    "Hi — I'm not okay right now and could use your support. Can you reach out when you can? — sent via Zenith"
  );

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onClick={() => setOpen(true)}
        aria-label="Get help now"
        className="fixed right-3 z-[60] flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg ring-2 ring-destructive/40 hover:shadow-xl"
        style={{
          bottom: 'calc(5.25rem + env(safe-area-inset-bottom))',
        }}
      >
        <LifeBuoy className="h-5 w-5 md:h-6 md:w-6" />
        <span className="sr-only">SOS — get help now</span>
      </motion.button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-destructive">
              <LifeBuoy className="h-5 w-5" /> You're safe here
            </SheetTitle>
            <SheetDescription>
              Pick one — every option below is okay.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 grid gap-2">
            <a href="tel:9152987821" className="block">
              <Button variant="destructive" className="w-full justify-start h-12">
                <Phone className="h-4 w-4 mr-2" /> Call iCall · 9152987821
                <span className="ml-auto text-[10px] opacity-80">India · free</span>
              </Button>
            </a>
            <a href="tel:18602662345" className="block">
              <Button variant="outline" className="w-full justify-start h-12">
                <Phone className="h-4 w-4 mr-2" /> Vandrevala · 1860-266-2345
                <span className="ml-auto text-[10px] opacity-80">24×7</span>
              </Button>
            </a>

            <Button
              variant="secondary"
              className="w-full justify-start h-12"
              onClick={() => {
                setOpen(false);
                navigate('/breathing-exercises');
              }}
            >
              <Wind className="h-4 w-4 mr-2" /> 60-sec grounding (5-4-3-2-1)
            </Button>

            {contactPhone ? (
              <a href={`sms:${contactPhone}?&body=${smsBody}`} className="block">
                <Button variant="default" className="w-full justify-start h-12">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Text {contactName || 'my emergency contact'}
                </Button>
              </a>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-muted-foreground"
                onClick={() => {
                  setOpen(false);
                  navigate('/chat');
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Set an emergency contact in Settings → Profile
              </Button>
            )}
          </div>

          <p className="mt-4 text-[11px] text-muted-foreground text-center">
            If you're in immediate danger, please call your local emergency number.
          </p>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SosButton;