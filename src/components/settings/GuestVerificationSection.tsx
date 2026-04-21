import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const GuestVerificationSection: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // A guest = anonymous user (no email) OR flagged in localStorage
  const isGuest = !!user && (!user.email || user.is_anonymous || localStorage.getItem('zenith-guest-account') === '1');

  useEffect(() => {
    if (user?.email && !user.is_anonymous) {
      localStorage.removeItem('zenith-guest-account');
    }
  }, [user]);

  if (!isGuest) return null;

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Missing info', description: 'Enter both email and password.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Weak password', description: 'Use at least 6 characters.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      // Attach email + password to current anonymous user
      const { error: updateErr } = await supabase.auth.updateUser({ email, password });
      if (updateErr) throw updateErr;
      toast({
        title: 'Verification email sent! 📧',
        description: 'Check your inbox to confirm your address. Your account is now safe.',
      });
      localStorage.removeItem('zenith-guest-account');
    } catch (err: any) {
      toast({
        title: 'Could not save account',
        description: err.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-4 space-y-3"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-amber-200 dark:bg-amber-800 p-2 flex-shrink-0">
          <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-200" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
            You're using a Guest Account
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-200/80 mt-1">
            Add your email and password below to save your data. Unverified guest accounts may be wiped at any time without warning.
          </p>
        </div>
      </div>

      <form onSubmit={handleConvert} className="space-y-3 pt-1">
        <div className="space-y-1.5">
          <Label htmlFor="guest-email" className="text-xs text-amber-900 dark:text-amber-100">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700 dark:text-amber-300" />
            <Input
              id="guest-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10 bg-white/80 dark:bg-gray-900/50 border-amber-300 dark:border-amber-700"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="guest-password" className="text-xs text-amber-900 dark:text-amber-100">Choose a password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700 dark:text-amber-300" />
            <Input
              id="guest-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="pl-10 bg-white/80 dark:bg-gray-900/50 border-amber-300 dark:border-amber-700"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            <><ShieldCheck className="mr-2 h-4 w-4" /> Save & Verify Account</>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default GuestVerificationSection;