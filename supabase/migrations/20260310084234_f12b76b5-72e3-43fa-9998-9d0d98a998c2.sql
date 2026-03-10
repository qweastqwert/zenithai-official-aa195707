
-- Recurring events table for birthdays, anniversaries, weekly/monthly events
CREATE TABLE public.recurring_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'task',
  color text,
  start_time text NOT NULL DEFAULT '09:00',
  end_time text,
  recurrence_type text NOT NULL DEFAULT 'yearly', -- daily, weekly, monthly, yearly
  recurrence_day integer, -- day of week (0-6) for weekly, day of month for monthly
  recurrence_month integer, -- month (1-12) for yearly
  recurrence_date integer, -- day of month for yearly
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.recurring_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own recurring events"
  ON public.recurring_events FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own recurring events"
  ON public.recurring_events FOR SELECT TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring events"
  ON public.recurring_events FOR UPDATE TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring events"
  ON public.recurring_events FOR DELETE TO public
  USING (auth.uid() = user_id);

CREATE TRIGGER update_recurring_events_updated_at
  BEFORE UPDATE ON public.recurring_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
