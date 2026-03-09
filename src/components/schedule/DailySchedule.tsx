import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, Calendar, Clock, ChevronLeft, ChevronRight, Trash2, 
  Moon, Sun, Sparkles, Brain, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduleEvents, ScheduleEvent } from '@/hooks/useScheduleEvents';
import { useSleepProfile } from '@/hooks/useSleepProfile';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  sleep: { label: 'Sleep', color: 'hsl(230 60% 55%)', icon: <Moon className="h-3 w-3" /> },
  wake: { label: 'Wake Up', color: 'hsl(45 90% 50%)', icon: <Sun className="h-3 w-3" /> },
  task: { label: 'Task', color: 'hsl(var(--primary))', icon: <Calendar className="h-3 w-3" /> },
  wellness: { label: 'Wellness', color: 'hsl(160 60% 45%)', icon: <Sparkles className="h-3 w-3" /> },
  mindmate: { label: 'MindMate', color: 'hsl(270 70% 55%)', icon: <Brain className="h-3 w-3" /> },
  exercise: { label: 'Exercise', color: 'hsl(340 75% 55%)', icon: <Sparkles className="h-3 w-3" /> },
  meal: { label: 'Meal', color: 'hsl(25 85% 50%)', icon: <Clock className="h-3 w-3" /> },
  study: { label: 'Study/Work', color: 'hsl(200 70% 50%)', icon: <Calendar className="h-3 w-3" /> },
};

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
  const { profile: sleepProfile } = useSleepProfile();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formState, setFormState] = useState<AddEventFormState>({
    title: '', description: '', start_time: '', end_time: '', category: 'task'
  });

  // Fetch events when date changes
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
        color: 'hsl(230 60% 55%)',
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

  const navigateDate = (direction: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + direction);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  const sortedEvents = [...events].sort((a, b) => a.start_time.localeCompare(b.start_time));

  // Generate time slots for visual timeline
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const getEventsAtHour = (hour: string) => {
    const h = parseInt(hour);
    return sortedEvents.filter(e => {
      const eH = parseInt(e.start_time.split(':')[0]);
      return eH === h;
    });
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Daily Schedule
          </CardTitle>
          <Button size="sm" onClick={() => setShowAddForm(true)} className="gap-1">
            <Plus className="h-3 w-3" /> Add
          </Button>
        </div>
        
        {/* Date Navigation */}
        <div className="flex items-center justify-between mt-2">
          <Button variant="ghost" size="icon" onClick={() => navigateDate(-1)} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
            {isToday && <Badge variant="secondary" className="ml-2 text-[10px]">Today</Badge>}
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigateDate(1)} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Loading schedule...</div>
        ) : sortedEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No events for this day</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAddForm(true)}>
              Add your first event
            </Button>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-2">
              <AnimatePresence>
                {sortedEvents.map((event) => {
                  const catConfig = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.task;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        event.is_completed ? 'opacity-50 bg-muted/30' : 'bg-card hover:bg-accent/5'
                      }`}
                    >
                      {/* Time indicator */}
                      <div className="flex-shrink-0 w-14 text-center">
                        <span className="text-xs font-mono text-muted-foreground">
                          {formatTime(event.start_time)}
                        </span>
                      </div>

                      {/* Color bar */}
                      <div 
                        className="w-1 h-10 rounded-full flex-shrink-0"
                        style={{ backgroundColor: event.color || catConfig.color }}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-medium ${event.is_completed ? 'line-through' : ''}`}>
                            {event.title}
                          </span>
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4" style={{ borderColor: catConfig.color, color: catConfig.color }}>
                            {catConfig.label}
                          </Badge>
                        </div>
                        {event.description && (
                          <p className="text-[11px] text-muted-foreground truncate">{event.description}</p>
                        )}
                        {event.end_time && (
                          <span className="text-[10px] text-muted-foreground">
                            Until {formatTime(event.end_time)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!event.is_auto_generated && (
                          <Checkbox
                            checked={event.is_completed}
                            onCheckedChange={() => toggleComplete(event.id)}
                            className="h-4 w-4"
                          />
                        )}
                        {!event.is_auto_generated && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}

        {/* Summary */}
        {sortedEvents.length > 0 && (
          <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>{sortedEvents.filter(e => e.is_completed).length}/{sortedEvents.filter(e => !e.is_auto_generated).length} tasks done</span>
            <span>{sortedEvents.length} events total</span>
          </div>
        )}
      </CardContent>

      {/* Add Event Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Event — {formatDate(selectedDate)}</DialogTitle>
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
                <Input
                  type="time"
                  value={formState.start_time}
                  onChange={(e) => setFormState(prev => ({ ...prev, start_time: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">End time (optional)</label>
                <Input
                  type="time"
                  value={formState.end_time}
                  onChange={(e) => setFormState(prev => ({ ...prev, end_time: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <Select value={formState.category} onValueChange={(v) => setFormState(prev => ({ ...prev, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
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
            <Button onClick={handleAddEvent} className="w-full">Add Event</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
