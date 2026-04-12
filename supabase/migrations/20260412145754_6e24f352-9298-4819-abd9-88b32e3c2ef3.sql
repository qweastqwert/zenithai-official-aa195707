
-- 1) Add username column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique ON public.profiles (username) WHERE username IS NOT NULL;

-- 2) Push subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  device_name text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.push_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own subscriptions" ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.push_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscriptions" ON public.push_subscriptions FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_push_subscriptions_updated_at BEFORE UPDATE ON public.push_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  mood_reminder_time text DEFAULT '09:00',
  journal_reminder_time text DEFAULT '21:00',
  sleep_reminder_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  timezone text DEFAULT 'Asia/Kolkata',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own preferences" ON public.notification_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.notification_preferences FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Community characters table
CREATE TABLE IF NOT EXISTS public.community_characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_user_id uuid NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  avatar_emoji text NOT NULL DEFAULT '🤖',
  system_prompt text NOT NULL,
  greeting text,
  is_private boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.community_characters ENABLE ROW LEVEL SECURITY;

-- Public characters visible to all authenticated; private only to creator
CREATE POLICY "View public characters" ON public.community_characters FOR SELECT TO authenticated USING (is_private = false);
CREATE POLICY "View own private characters" ON public.community_characters FOR SELECT TO authenticated USING (creator_user_id = auth.uid());
CREATE POLICY "Create own characters" ON public.community_characters FOR INSERT TO authenticated WITH CHECK (creator_user_id = auth.uid());
CREATE POLICY "Update own characters" ON public.community_characters FOR UPDATE TO authenticated USING (creator_user_id = auth.uid());
CREATE POLICY "Delete own characters" ON public.community_characters FOR DELETE TO authenticated USING (creator_user_id = auth.uid());

CREATE TRIGGER update_community_characters_updated_at BEFORE UPDATE ON public.community_characters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
