import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Repeat, Cake, Calendar, Briefcase, Heart } from 'lucide-react';
import { toast } from 'sonner';

const QUICK_TEMPLATES = [
  { label: '🎂 Birthday', icon: Cake, category: 'birthday', recurrence_type: 'yearly' as const, color: 'hsl(340 75% 55%)' },
  { label: '💍 Anniversary', icon: Heart, category: 'anniversary', recurrence_type: 'yearly' as const, color: 'hsl(350 80% 55%)' },
  { label: '📅 Weekly Meeting', icon: Briefcase, category: 'study', recurrence_type: 'weekly' as const, color: 'hsl(200 70% 50%)' },
  { label: '🏋️ Daily Workout', icon: Calendar, category: 'exercise', recurrence_type: 'daily' as const, color: 'hsl(160 60% 45%)' },
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (event: any) => Promise<any>;
}

export const RecurringEventForm = ({ open, onOpenChange, onAdd }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('yearly');
  const [recurrenceDay, setRecurrenceDay] = useState(0);
  const [recurrenceDate, setRecurrenceDate] = useState(1);
  const [recurrenceMonth, setRecurrenceMonth] = useState(1);
  const [category, setCategory] = useState('task');
  const [color, setColor] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    const result = await onAdd({
      title,
      description: description || undefined,
      start_time: startTime,
      recurrence_type: recurrenceType,
      recurrence_day: recurrenceType === 'weekly' ? recurrenceDay : (recurrenceType !== 'daily' ? recurrenceDate : undefined),
      recurrence_date: recurrenceType !== 'daily' && recurrenceType !== 'weekly' ? recurrenceDate : undefined,
      recurrence_month: recurrenceType === 'yearly' ? recurrenceMonth : undefined,
      category,
      color: color || undefined,
    });

    if (result) {
      toast.success('Recurring event created!');
      setTitle('');
      setDescription('');
      onOpenChange(false);
    }
  };

  const applyTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    setCategory(template.category);
    setRecurrenceType(template.recurrence_type);
    setColor(template.color);
    if (template.category === 'birthday') setTitle('');
    if (template.category === 'exercise') setTitle('Workout');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-primary" />
            Add Recurring Event
          </DialogTitle>
        </DialogHeader>

        {/* Quick templates */}
        <div className="flex flex-wrap gap-2">
          {QUICK_TEMPLATES.map((t) => (
            <Button key={t.label} variant="outline" size="sm" className="text-xs gap-1 h-8" onClick={() => applyTemplate(t)}>
              {t.label}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          <Input placeholder="Event title (e.g. Mom's Birthday)" value={title} onChange={e => setTitle(e.target.value)} />
          <Input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Repeats</label>
            <Select value={recurrenceType} onValueChange={(v: any) => setRecurrenceType(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Every day</SelectItem>
                <SelectItem value="weekly">Every week</SelectItem>
                <SelectItem value="monthly">Every month</SelectItem>
                <SelectItem value="yearly">Every year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recurrenceType === 'weekly' && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Day of week</label>
              <Select value={recurrenceDay.toString()} onValueChange={v => setRecurrenceDay(parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAY_NAMES.map((d, i) => <SelectItem key={i} value={i.toString()}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {(recurrenceType === 'monthly' || recurrenceType === 'yearly') && (
            <div className="grid grid-cols-2 gap-2">
              {recurrenceType === 'yearly' && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Month</label>
                  <Select value={recurrenceMonth.toString()} onValueChange={v => setRecurrenceMonth(parseInt(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MONTH_NAMES.map((m, i) => <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Day</label>
                <Select value={recurrenceDate.toString()} onValueChange={v => setRecurrenceDate(parseInt(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Time</label>
            <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>

          <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90">Create Recurring Event</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
