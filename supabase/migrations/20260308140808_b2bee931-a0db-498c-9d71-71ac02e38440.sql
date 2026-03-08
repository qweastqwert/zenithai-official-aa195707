-- Add SELECT policy for community_posts so the security_invoker view can read them
CREATE POLICY "Authenticated users can view posts"
  ON public.community_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Also add SELECT policy for community_comments (same issue)
CREATE POLICY "Authenticated users can view comments"
  ON public.community_comments
  FOR SELECT
  TO authenticated
  USING (true);