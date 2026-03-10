import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface RecurringEvent {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  color: string | null;
  start_time: string;
  end_time: string | null;
  recurrence_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  recurrence_day: number | null;
  recurrence_month: number | null;
  recurrence_date: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useRecurringEvents = () => {
  const [recurringEvents, setRecurringEvents] = useState<RecurringEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecurringEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('recurring_events')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecurringEvents((data as unknown as RecurringEvent[]) || []);
    } catch (error) {
      console.error('Error fetching recurring events:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchRecurringEvents();
  }, [user, fetchRecurringEvents]);

  const addRecurringEvent = async (event: {
    title: string;
    description?: string;
    category?: string;
    color?: string;
    start_time?: string;
    end_time?: string;
    recurrence_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurrence_day?: number;
    recurrence_month?: number;
    recurrence_date?: number;
  }) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('recurring_events')
        .insert({
          user_id: user.id,
          title: event.title,
          description: event.description || null,
          category: event.category || 'task',
          color: event.color || null,
          start_time: event.start_time || '09:00',
          end_time: event.end_time || null,
          recurrence_type: event.recurrence_type,
          recurrence_day: event.recurrence_day ?? null,
          recurrence_month: event.recurrence_month ?? null,
          recurrence_date: event.recurrence_date ?? null,
        } as any)
        .select()
        .single();

      if (error) throw error;
      const newEvent = data as unknown as RecurringEvent;
      setRecurringEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (error) {
      console.error('Error adding recurring event:', error);
      return null;
    }
  };

  const deleteRecurringEvent = async (id: string) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('recurring_events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setRecurringEvents(prev => prev.filter(e => e.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting recurring event:', error);
      return false;
    }
  };

  const getRecurringEventsForDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;

    return recurringEvents.filter(e => {
      if (!e.is_active) return false;
      switch (e.recurrence_type) {
        case 'daily':
          return true;
        case 'weekly':
          return e.recurrence_day === dayOfWeek;
        case 'monthly':
          return e.recurrence_date === dayOfMonth;
        case 'yearly':
          return e.recurrence_month === month && e.recurrence_date === dayOfMonth;
        default:
          return false;
      }
    });
  }, [recurringEvents]);

  return {
    recurringEvents,
    loading,
    addRecurringEvent,
    deleteRecurringEvent,
    fetchRecurringEvents,
    getRecurringEventsForDate,
  };
};
