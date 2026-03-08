-- Drop and recreate community_posts_safe view to mask user_id for anonymous posts
DROP VIEW IF EXISTS public.community_posts_safe;

CREATE VIEW public.community_posts_safe AS
SELECT 
  id,
  CASE WHEN is_anonymous = true THEN NULL ELSE user_id END AS user_id,
  title,
  description,
  is_anonymous,
  created_at,
  updated_at
FROM public.community_posts;

-- Grant select to authenticated and anon
GRANT SELECT ON public.community_posts_safe TO authenticated;
GRANT SELECT ON public.community_posts_safe TO anon;

-- Drop and recreate community_comments_safe view to mask user_id for anonymous comments
DROP VIEW IF EXISTS public.community_comments_safe;

CREATE VIEW public.community_comments_safe AS
SELECT 
  id,
  post_id,
  CASE WHEN is_anonymous = true THEN NULL ELSE user_id END AS user_id,
  content,
  is_anonymous,
  created_at,
  updated_at
FROM public.community_comments;

-- Grant select to authenticated and anon
GRANT SELECT ON public.community_comments_safe TO authenticated;
GRANT SELECT ON public.community_comments_safe TO anon;