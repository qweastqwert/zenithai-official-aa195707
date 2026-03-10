import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Repeat, Calendar } from 'lucide-react';
import { useScheduleEvents } from '@/hooks/useScheduleEvents';
import { useRecurringEvents } from '@/hooks/useRecurringEvents';
import { useSleepProfile } from '@/hooks/useSleepProfile';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduleCalendar } from './ScheduleCalendar';
import { EventList } from './EventList';
import { RecurringEventForm } from './RecurringEventForm';

interface AddEventFormState {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  category: string;
}

export const DailySchedule = () => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const { events, loading, addEvent, deleteEvent, toggleComplete, fetchEvents } = useScheduleEvents();
  const { recurringEvents, addRecurringEvent, deleteRecurringEvent, getRecurringEventsForDate } = useRecurringEvents();
  const { profile: sleepProfile } = useSleepProfile();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [formState, setFormState] = useState<AddEventFormState>({
    title: '', description: '', start_time: '', end_time: '', category: 'task'
  });

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate, fetchEvents]);

  // Auto-add sleep/wake events
  useEffect(() => {
    if (!sleepProfile || loading) return;
    const hasSleepEvent = events.some(e => e.category === 'sleep' && e.event_date === selectedDate && e.is_auto_generated);
    const hasWakeEvent = events.some(e => e.category === 'wake' && e.event_date === selectedDate && e.is_auto_generated);

    if (!hasSleepEvent && sleepProfile.sleep_time) {
      addEvent({
        title: '🌙 Bedtime',
        description: 'Scheduled sleep time',
        event_date: selectedDate,
        start_time: sleepProfile.sleep_time,
        category: 'sleep',
        is_auto_generated: true,
        source: 'sleep_profile',
        color: 'hsl(260 60% 55%)',
      });
    }
    if (!hasWakeEvent && sleepProfile.wake_time) {
      addEvent({
        title: '☀️ Wake Up',
        description: 'Scheduled wake time',
        event_date: selectedDate,
        start_time: sleepProfile.wake_time,
        category: 'wake',
        is_auto_generated: true,
        source: 'sleep_profile',
        color: 'hsl(45 90% 50%)',
      });
    }
  }, [sleepProfile, events, selectedDate, loading]);

  const handleAddEvent = async () => {
    if (!formState.title.trim() || !formState.start_time) {
      toast.error('Title and start time are required');
      return;
    }
    const result = await addEvent({
      title: formState.title,
      description: formState.description || undefined,
      event_date: selectedDate,
      start_time: formState.start_time,
      end_time: formState.end_time || undefined,
      category: formState.category,
    });
    if (result) {
      toast.success('Event added!');
      setFormState({ title: '', description: '', start_time: '', end_time: '', category: 'task' });
      setShowAddForm(false);
    } else {
      toast.error('Failed to add event');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteEvent(id);
    if (success) toast.success('Event removed');
  };

  const handleDeleteRecurring = async (id: string) => {
    const success = await deleteRecurringEvent(id);
    if (success) toast.success('Recurring event removed');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const recurringForDate = getRecurringEventsForDate(selectedDate);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Calendar */}
      <ScheduleCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        events={events}
        recurringEvents={recurringEvents}
        getRecurringEventsForDate={getRecurringEventsForDate}
      />

      {/* Selected date header + actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{formatDate(selectedDate)}</h3>
          <p className="text-xs text-muted-foreground">
            {events.length + recurringForDate.length} events
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowRecurringForm(true)} className="gap-1 text-xs h-8 border-primary/30 text-primary hover:bg-primary/10">
            <Repeat className="h-3 w-3" /> Recurring
          </Button>
          <Button size="sm" onClick={() => setShowAddForm(true)} className="gap-1 text-xs h-8 bg-primary hover:bg-primary/90">
            <Plus className="h-3 w-3" /> Add
          </Button>
        </div>
      </div>

      {/* Event list */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading schedule...</div>
          ) : (
            <EventList
              events={events}
              recurringEventsForDate={recurringForDate}
              onToggleComplete={toggleComplete}
              onDelete={handleDelete}
              onDeleteRecurring={handleDeleteRecurring}
            />
          )}
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Add Event — {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Event title"
              value={formState.title}
              onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="Description (optional)"
              value={formState.description}
              onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Start time</label>
                <Input type="time" value={formState.start_time} onChange={(e) => setFormState(prev => ({ ...prev, start_time: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">End time (optional)</label>
                <Input type="time" value={formState.end_time} onChange={(e) => setFormState(prev => ({ ...prev, end_time: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <Select value={formState.category} onValueChange={(v) => setFormState(prev => ({ ...prev, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">📋 Task</SelectItem>
                  <SelectItem value="wellness">✨ Wellness</SelectItem>
                  <SelectItem value="exercise">💪 Exercise</SelectItem>
                  <SelectItem value="meal">🍽️ Meal</SelectItem>
                  <SelectItem value="study">📚 Study/Work</SelectItem>
                  <SelectItem value="mindmate">🧠 MindMate Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddEvent} className="w-full bg-primary hover:bg-primary/90">Add Event</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recurring Event Form */}
      <RecurringEventForm
        open={showRecurringForm}
        onOpenChange={setShowRecurringForm}
        onAdd={addRecurringEvent}
      />
    </div>
  );
};
