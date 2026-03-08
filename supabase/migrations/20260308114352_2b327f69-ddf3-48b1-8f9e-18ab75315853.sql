-- Create user_achievements table to persist achievement progress
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  achievement_id text NOT NULL,
  unlocked_at timestamp with time zone DEFAULT now(),
  progress integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON public.user_achievements FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements"
  ON public.user_achievements FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_user_achievements_updated_at
  BEFORE UPDATE ON public.user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Also create user_activity_data table to sync activity tracker data to cloud
CREATE TABLE public.user_activity_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  last_mindmate_use text,
  last_journal_use text,
  last_mood_track text,
  last_meditation_use text,
  last_breathing_use text,
  last_sleep_use text,
  mindmate_streak integer NOT NULL DEFAULT 0,
  journal_streak integer NOT NULL DEFAULT 0,
  mood_streak integer NOT NULL DEFAULT 0,
  meditation_streak integer NOT NULL DEFAULT 0,
  sleep_streak integer NOT NULL DEFAULT 0,
  total_days_used integer NOT NULL DEFAULT 0,
  features_unlocked text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activity_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own activity data"
  ON public.user_activity_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity data"
  ON public.user_activity_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity data"
  ON public.user_activity_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity data"
  ON public.user_activity_data FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_user_activity_data_updated_at
  BEFORE UPDATE ON public.user_activity_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();