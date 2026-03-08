-- Fix: Prevent anonymous post identity leakage by restricting direct SELECT on base tables
-- Force all reads through the secure views which properly mask user_id

-- Drop existing permissive SELECT policies that expose user_id for anonymous posts
DROP POLICY IF EXISTS "Anyone can view community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Anyone can view community comments" ON public.community_comments;

-- Revoke direct SELECT access from base tables
REVOKE SELECT ON public.community_posts FROM anon;
REVOKE SELECT ON public.community_posts FROM authenticated;

REVOKE SELECT ON public.community_comments FROM anon;
REVOKE SELECT ON public.community_comments FROM authenticated;

-- Allow SELECT only through the secure views (grants already exist from prior migration)
-- Re-grant to ensure views are accessible
GRANT SELECT ON public.community_posts_safe TO anon;
GRANT SELECT ON public.community_posts_safe TO authenticated;
GRANT SELECT ON public.community_comments_safe TO anon;
GRANT SELECT ON public.community_comments_safe TO authenticated;

-- Admin moderation access: Create helper functions for admins to read full data
CREATE OR REPLACE FUNCTION public.admin_get_community_posts()
RETURNS SETOF public.community_posts
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.community_posts
  WHERE EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.admin_get_community_comments()
RETURNS SETOF public.community_comments
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.community_comments
  WHERE EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Revoke public execute on these admin functions
REVOKE EXECUTE ON FUNCTION public.admin_get_community_posts() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_get_community_comments() FROM PUBLIC;

-- Grant only to authenticated (admin check is inside the function)
GRANT EXECUTE ON FUNCTION public.admin_get_community_posts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_community_comments() TO authenticated;