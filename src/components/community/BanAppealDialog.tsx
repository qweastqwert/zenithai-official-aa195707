import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useBanAppeals } from '@/hooks/useBanAppeals';

interface BanAppealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banId: string;
}

const BanAppealDialog: React.FC<BanAppealDialogProps> = ({ open, onOpenChange, banId }) => {
  const [appealText, setAppealText] = useState('');
  const { createAppeal } = useBanAppeals();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!appealText.trim()) return;
    
    setSubmitting(true);
    const success = await createAppeal(banId, appealText);
    setSubmitting(false);

    if (success) {
      setAppealText('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appeal Your Ban</DialogTitle>
          <DialogDescription>
            Explain why you believe this ban should be reconsidered
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appeal-text">Your Appeal</Label>
            <Textarea
              id="appeal-text"
              value={appealText}
              onChange={(e) => setAppealText(e.target.value)}
              placeholder="Please explain your situation..."
              rows={6}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!appealText.trim() || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Appeal'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BanAppealDialog;
