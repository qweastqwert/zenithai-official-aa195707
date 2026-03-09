
-- Create schedule_events table for daily schedule
CREATE TABLE public.schedule_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  category TEXT NOT NULL DEFAULT 'task',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_auto_generated BOOLEAN NOT NULL DEFAULT false,
  source TEXT DEFAULT 'manual',
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own schedule events"
  ON public.schedule_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedule events"
  ON public.schedule_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedule events"
  ON public.schedule_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedule events"
  ON public.schedule_events FOR DELETE
  USING (auth.uid() = user_id);

-- Updated at trigger
CREATE TRIGGER update_schedule_events_updated_at
  BEFORE UPDATE ON public.schedule_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
