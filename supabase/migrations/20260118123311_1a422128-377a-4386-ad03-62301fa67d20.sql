-- Create a secure view that masks user_id for anonymous posts
-- This ensures anonymous posts don't expose the user's identity

CREATE OR REPLACE VIEW public.community_posts_safe
WITH (security_invoker = on) AS
SELECT 
  id,
  title,
  description,
  CASE 
    WHEN is_anonymous = true THEN NULL 
    ELSE user_id 
  END as user_id,
  created_at,
  updated_at,
  is_anonymous
FROM public.community_posts;

-- Create a similar secure view for anonymous comments
CREATE OR REPLACE VIEW public.community_comments_safe
WITH (security_invoker = on) AS
SELECT 
  id,
  post_id,
  content,
  CASE 
    WHEN is_anonymous = true THEN NULL 
    ELSE user_id 
  END as user_id,
  created_at,
  updated_at,
  is_anonymous
FROM public.community_comments;

-- Grant SELECT on these views
GRANT SELECT ON public.community_posts_safe TO authenticated;
GRANT SELECT ON public.community_posts_safe TO anon;
GRANT SELECT ON public.community_comments_safe TO authenticated;
GRANT SELECT ON public.community_comments_safe TO anon;