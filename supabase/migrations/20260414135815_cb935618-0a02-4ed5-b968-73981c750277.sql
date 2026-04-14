
CREATE OR REPLACE FUNCTION public.delete_user_account()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Anonymize community posts (keep content, remove author)
  UPDATE public.community_posts
    SET user_id = NULL, is_anonymous = true
    WHERE user_id = _uid;

  -- Anonymize community comments
  UPDATE public.community_comments
    SET user_id = NULL, is_anonymous = true
    WHERE user_id = _uid;

  -- Anonymize community characters (keep them but mark as deleted account)
  UPDATE public.community_characters
    SET creator_user_id = NULL
    WHERE creator_user_id = _uid;

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

  -- Finally delete the auth user (cascades anything with FK)
  DELETE FROM auth.users WHERE id = _uid;
END;
$$;

-- Allow community_characters.creator_user_id to be NULL for deleted accounts
ALTER TABLE public.community_characters
  ALTER COLUMN creator_user_id DROP NOT NULL;
