import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ScheduleEvent {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string;
  end_time: string | null;
  category: string;
  is_completed: boolean;
  is_auto_generated: boolean;
  source: string;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export const useScheduleEvents = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEvents = useCallback(async (date?: string) => {
    if (!user) return;
    setLoading(true);
    try {
      let query = supabase
        .from('schedule_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (date) {
        query = query.eq('event_date', date);
      }

      const { data, error } = await query;
      if (error) throw error;
      setEvents((data as unknown as ScheduleEvent[]) || []);
    } catch (error) {
      console.error('Error fetching schedule events:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      fetchEvents(today);
    }
  }, [user, fetchEvents]);

  const addEvent = async (event: {
    title: string;
    description?: string;
    event_date: string;
    start_time: string;
    end_time?: string;
    category?: string;
    is_auto_generated?: boolean;
    source?: string;
    color?: string;
  }) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('schedule_events')
        .insert({
          user_id: user.id,
          title: event.title,
          description: event.description || null,
          event_date: event.event_date,
          start_time: event.start_time,
          end_time: event.end_time || null,
          category: event.category || 'task',
          is_auto_generated: event.is_auto_generated || false,
          source: event.source || 'manual',
          color: event.color || null,
        } as any)
        .select()
        .single();

      if (error) throw error;
      const newEvent = data as unknown as ScheduleEvent;
      setEvents(prev => [...prev, newEvent].sort((a, b) => a.start_time.localeCompare(b.start_time)));
      return newEvent;
    } catch (error) {
      console.error('Error adding schedule event:', error);
      return null;
    }
  };

  const updateEvent = async (id: string, updates: Partial<ScheduleEvent>) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('schedule_events')
        .update(updates as any)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      return true;
    } catch (error) {
      console.error('Error updating schedule event:', error);
      return false;
    }
  };

  const deleteEvent = async (id: string) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('schedule_events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setEvents(prev => prev.filter(e => e.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting schedule event:', error);
      return false;
    }
  };

  const toggleComplete = async (id: string) => {
    const event = events.find(e => e.id === id);
    if (!event) return false;
    return updateEvent(id, { is_completed: !event.is_completed });
  };

  const getEventsForDate = useCallback((date: string) => {
    return events.filter(e => e.event_date === date);
  }, [events]);

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleComplete,
    fetchEvents,
    getEventsForDate,
  };
};
