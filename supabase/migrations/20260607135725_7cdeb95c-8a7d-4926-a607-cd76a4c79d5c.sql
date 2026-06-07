
-- 1. Restrict votes visibility to authenticated
DROP POLICY IF EXISTS "Anyone can view post votes" ON public.post_votes;
CREATE POLICY "Authenticated users can view post votes" ON public.post_votes
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can view comment votes" ON public.comment_votes;
CREATE POLICY "Authenticated users can view comment votes" ON public.comment_votes
  FOR SELECT TO authenticated USING (true);

-- 2. Restrict user_roles policies to authenticated role only
DROP POLICY IF EXISTS "Only admins can create roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Only admins can create roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 3. Remove redundant PII columns from pin_reset_requests
ALTER TABLE public.pin_reset_requests DROP COLUMN IF EXISTS user_email;
ALTER TABLE public.pin_reset_requests DROP COLUMN IF EXISTS user_display_name;

-- 4. Revoke anonymous EXECUTE on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.delete_user_account() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_get_community_posts() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_get_community_comments() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_leaderboard(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_clear_journal_pin(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_user_banned(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.update_user_reputation(uuid, integer) FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_conversations() FROM anon, public, authenticated;

GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_community_posts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_community_comments() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_clear_journal_pin(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_banned(uuid) TO authenticated;

-- 5. Drop public listing policy on character-avatars bucket
-- (Bucket remains public so direct file URLs still work, but no enumeration via API)
DROP POLICY IF EXISTS "Character avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Character avatars readable by authenticated"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'character-avatars');
