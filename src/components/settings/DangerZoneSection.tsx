import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const DangerZoneSection = () => {
  const [step, setStep] = useState(0); // 0=idle, 1=first confirm, 2=second confirm, 3=type DELETE
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) throw error;

      toast({
        title: 'Account deleted',
        description: 'Your account and personal data have been permanently removed.',
      });

      // Sign out and reload
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err: any) {
      console.error('Delete account error:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setStep(0);
      setConfirmText('');
    }
  };

  const reset = () => {
    setStep(0);
    setConfirmText('');
  };

  return (
    <>
      <div className="space-y-3 rounded-lg border-2 border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all personal data. Community posts and characters you created will remain but show as "Deleted Account". Character conversations will be permanently deleted. This action is <strong>irreversible</strong>.
        </p>
        <Button
          variant="destructive"
          className="gap-2"
          onClick={() => setStep(1)}
        >
          <Trash2 className="h-4 w-4" />
          Delete My Account
        </Button>
      </div>

      {/* Step 1: Are you sure? */}
      <AlertDialog open={step === 1} onOpenChange={(open) => !open && reset()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account including all mood entries, journal entries, sleep data, AI conversations, character conversations, memories, schedule, achievements, and profile. Community posts and character bots will remain but be anonymized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={reset}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => setStep(2)}
            >
              Yes, I want to delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Step 2: Really sure? */}
      <AlertDialog open={step === 2} onOpenChange={(open) => !open && reset()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              This cannot be undone!
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to permanently erase all your data from Zenith AI. There is no way to recover your account after this. Are you absolutely sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={reset}>Go Back</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => setStep(3)}
            >
              I understand, continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Step 3: Type DELETE */}
      <AlertDialog open={step === 3} onOpenChange={(open) => !open && reset()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Final Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>Type <strong>DELETE</strong> below to permanently delete your account.</p>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="border-destructive/50 focus-visible:ring-destructive"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={reset}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={confirmText !== 'DELETE' || deleting}
              onClick={handleDelete}
            >
              {deleting ? 'Deleting...' : 'Permanently Delete Account'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DangerZoneSection;
