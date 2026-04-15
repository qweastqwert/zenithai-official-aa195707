-- 1. Add columns to community_characters
ALTER TABLE public.community_characters
  ADD COLUMN IF NOT EXISTS avatar_type text NOT NULL DEFAULT 'emoji',
  ADD COLUMN IF NOT EXISTS avatar_image_url text,
  ADD COLUMN IF NOT EXISTS mood_tone text;

-- 2. Create character_conversations table
CREATE TABLE public.character_conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  character_id text NOT NULL,
  character_name text NOT NULL,
  title text NOT NULL DEFAULT 'New Conversation',
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.character_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON public.character_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
  ON public.character_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
  ON public.character_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
  ON public.character_conversations FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_character_conversations_updated_at
  BEFORE UPDATE ON public.character_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Create storage bucket for character avatars
INSERT INTO storage.buckets (id, name, public)
  VALUES ('character-avatars', 'character-avatars', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Character avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'character-avatars');

CREATE POLICY "Users can upload their own character avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'character-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own character avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'character-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own character avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'character-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Update delete_user_account to include character_conversations
CREATE OR REPLACE FUNCTION public.delete_user_account()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Anonymize community posts
  UPDATE public.community_posts
    SET user_id = NULL, is_anonymous = true
    WHERE user_id = _uid;

  -- Anonymize community comments
  UPDATE public.community_comments
    SET user_id = NULL, is_anonymous = true
    WHERE user_id = _uid;

  -- Anonymize community characters
  UPDATE public.community_characters
    SET creator_user_id = NULL
    WHERE creator_user_id = _uid;

  -- Delete character conversations
  DELETE FROM public.character_conversations WHERE user_id = _uid;

  -- Delete personal data
  DELETE FROM public.mood_entries WHERE user_id = _uid;
  DELETE FROM public.journal_entries WHERE user_id = _uid;
  DELETE FROM public.sleep_logs WHERE user_id = _uid;
  DELETE FROM public.sleep_profiles WHERE user_id = _uid;
  DELETE FROM public.mind_archive WHERE user_id = _uid;
  DELETE FROM public.conversation_history WHERE user_id = _uid;
  DELETE FROM public.ai_usage WHERE user_id = _uid;
  DELETE FROM public.schedule_events WHERE user_id = _uid;
  DELETE FROM public.recurring_events WHERE user_id = _uid;
  DELETE FROM public.notification_preferences WHERE user_id = _uid;
  DELETE FROM public.push_subscriptions WHERE user_id = _uid;
  DELETE FROM public.user_achievements WHERE user_id = _uid;
  DELETE FROM public.user_activity_data WHERE user_id = _uid;
  DELETE FROM public.post_votes WHERE user_id = _uid;
  DELETE FROM public.comment_votes WHERE user_id = _uid;
  DELETE FROM public.community_reports WHERE reporter_id = _uid;
  DELETE FROM public.ban_appeals WHERE user_id = _uid;
  DELETE FROM public.community_bans WHERE user_id = _uid;
  DELETE FROM public.therapist_applications WHERE user_id = _uid;
  DELETE FROM public.profiles WHERE user_id = _uid;
  DELETE FROM public.user_roles WHERE user_id = _uid;

  DELETE FROM auth.users WHERE id = _uid;
END;
$function$;