import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Check, X } from 'lucide-react';
import { useScheduleEvents } from '@/hooks/useScheduleEvents';
import { toast } from 'sonner';

interface ScheduleEventProposal {
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  category: string;
}

interface ScheduleConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  proposals: ScheduleEventProposal[];
  date?: string;
}

export const ScheduleConfirmDialog = ({ isOpen, onClose, proposals, date }: ScheduleConfirmDialogProps) => {
  const { addEvent } = useScheduleEvents();
  const [selected, setSelected] = useState<Set<number>>(new Set(proposals.map((_, i) => i)));
  const [saving, setSaving] = useState(false);
  const eventDate = date || new Date().toISOString().split('T')[0];

  const toggleSelect = (idx: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const handleConfirm = async () => {
    setSaving(true);
    let added = 0;
    for (const idx of selected) {
      const p = proposals[idx];
      const result = await addEvent({
        title: p.title,
        description: p.description,
        event_date: eventDate,
        start_time: p.start_time,
        end_time: p.end_time,
        category: p.category || 'task',
        is_auto_generated: true,
        source: 'mindmate',
      });
      if (result) added++;
    }
    setSaving(false);
    if (added > 0) {
      toast.success(`${added} event${added > 1 ? 's' : ''} added to your schedule!`);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            MindMate Suggested Events
          </DialogTitle>
          <DialogDescription>
            Select which events you'd like to add to your schedule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {proposals.map((p, idx) => (
            <div
              key={idx}
              onClick={() => toggleSelect(idx)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                selected.has(idx) ? 'border-primary bg-primary/5' : 'border-border opacity-60'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selected.has(idx) ? 'border-primary bg-primary' : 'border-muted-foreground'
              }`}>
                {selected.has(idx) && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{p.title}</p>
                {p.description && <p className="text-xs text-muted-foreground truncate">{p.description}</p>}
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px]">
                    <Clock className="h-2.5 w-2.5 mr-1" />
                    {formatTime(p.start_time)}
                    {p.end_time && ` - ${formatTime(p.end_time)}`}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">{p.category}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={saving || selected.size === 0}>
            {saving ? 'Adding...' : `Add ${selected.size} Event${selected.size !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
