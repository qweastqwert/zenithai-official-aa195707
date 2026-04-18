-- Restore PostgREST table grants for community tables.
-- RLS policies only apply AFTER the role has table-level grants. Without these,
-- every query fails with "permission denied for table" before RLS is even checked.

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT SELECT ON public.community_posts TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_comments TO authenticated;
GRANT SELECT ON public.community_comments TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_votes TO authenticated;
GRANT SELECT ON public.post_votes TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.comment_votes TO authenticated;
GRANT SELECT ON public.comment_votes TO anon;

-- Safe views (security_invoker) need grants too
GRANT SELECT ON public.community_posts_safe TO authenticated, anon;
GRANT SELECT ON public.community_comments_safe TO authenticated, anon;