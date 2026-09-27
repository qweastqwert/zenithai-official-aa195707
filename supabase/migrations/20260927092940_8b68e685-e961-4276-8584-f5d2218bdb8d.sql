CREATE TABLE public.cap_nonces (sig text PRIMARY KEY, expires_at timestamptz NOT NULL);
CREATE TABLE public.cap_tokens (token_key text PRIMARY KEY, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.cap_nonces TO service_role;
GRANT ALL ON public.cap_tokens TO service_role;
ALTER TABLE public.cap_nonces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cap_tokens ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.consume_cap_token(_token text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
DECLARE _id text; _ver text; _key text; _n int;
BEGIN
  IF _token IS NULL OR position(':' in _token) = 0 THEN RETURN false; END IF;
  _id := split_part(_token, ':', 1);
  _ver := substr(_token, length(_id) + 2);
  _key := _id || ':' || encode(extensions.digest(_ver, 'sha256'), 'hex');
  DELETE FROM public.cap_tokens WHERE token_key = _key AND expires_at > now();
  GET DIAGNOSTICS _n = ROW_COUNT;
  DELETE FROM public.cap_tokens WHERE expires_at < now();
  RETURN _n > 0;
END; $$;
REVOKE EXECUTE ON FUNCTION public.consume_cap_token(text) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.require_cap_token()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.consume_cap_token(NEW.cap_token) THEN
    RAISE EXCEPTION 'Human verification failed. Please verify again.';
  END IF;
  NEW.cap_token := NULL;
  RETURN NEW;
END; $$;

ALTER TABLE public.community_posts ADD COLUMN cap_token text;
ALTER TABLE public.community_comments ADD COLUMN cap_token text;
ALTER TABLE public.mail_replies ADD COLUMN cap_token text;
CREATE TRIGGER require_cap_on_post BEFORE INSERT ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.require_cap_token();
CREATE TRIGGER require_cap_on_comment BEFORE INSERT ON public.community_comments FOR EACH ROW EXECUTE FUNCTION public.require_cap_token();
CREATE TRIGGER require_cap_on_mail_reply BEFORE INSERT ON public.mail_replies FOR EACH ROW EXECUTE FUNCTION public.require_cap_token();

-- Shared purge used by account deletion and guest cleanup
CREATE OR REPLACE FUNCTION public.purge_user_data(_uid uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.community_posts SET user_id = NULL, is_anonymous = true WHERE user_id = _uid;
  UPDATE public.community_comments SET user_id = NULL, is_anonymous = true WHERE user_id = _uid;
  UPDATE public.community_characters SET creator_user_id = NULL WHERE creator_user_id = _uid;
  DELETE FROM public.character_conversations WHERE user_id = _uid;
  DELETE FROM public.mood_entries WHERE user_id = _uid;
  DELETE FROM public.journal_entries WHERE user_id = _uid;
  DELETE FROM public.journal_private_pins WHERE user_id = _uid;
  DELETE FROM public.pin_reset_requests WHERE user_id = _uid;
  DELETE FROM public.sleep_logs WHERE user_id = _uid;
  DELETE FROM public.sleep_profiles WHERE user_id = _uid;
  DELETE FROM public.mind_archive WHERE user_id = _uid;
  DELETE FROM public.conversation_history WHERE user_id = _uid;
  DELETE FROM public.ai_usage WHERE user_id = _uid;
  DELETE FROM public.schedule_events WHERE user_id = _uid;
  DELETE FROM public.recurring_events WHERE user_id = _uid;
  DELETE FROM public.treatment_plans WHERE user_id = _uid;
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
  DELETE FROM public.mail_replies WHERE sender_user_id = _uid;
  DELETE FROM public.mail_reads WHERE user_id = _uid;
  DELETE FROM public.mail_deleted WHERE user_id = _uid;
  DELETE FROM public.mail_messages WHERE recipient_user_id = _uid;
  UPDATE public.mail_messages SET sender_user_id = NULL WHERE sender_user_id = _uid;
  DELETE FROM public.profiles WHERE user_id = _uid;
  DELETE FROM public.user_roles WHERE user_id = _uid;
  DELETE FROM auth.users WHERE id = _uid;
END; $$;
REVOKE EXECUTE ON FUNCTION public.purge_user_data(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  PERFORM public.purge_user_data(auth.uid());
END; $$;

-- Guests with no linked (or pending) email are removed 10 days after creation
CREATE OR REPLACE FUNCTION public.cleanup_expired_guests()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record; _n int := 0;
BEGIN
  FOR r IN SELECT id FROM auth.users
    WHERE is_anonymous = true
      AND coalesce(email, '') = '' AND coalesce(email_change, '') = ''
      AND created_at < now() - interval '10 days'
  LOOP
    PERFORM public.purge_user_data(r.id);
    _n := _n + 1;
  END LOOP;
  DELETE FROM public.cap_nonces WHERE expires_at < now();
  RETURN _n;
END; $$;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_guests() FROM PUBLIC, anon, authenticated;

SELECT cron.schedule('cleanup-expired-guests', '0 * * * *', $$SELECT public.cleanup_expired_guests()$$);