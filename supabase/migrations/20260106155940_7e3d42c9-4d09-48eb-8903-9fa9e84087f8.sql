-- Drop existing insert policy first, then recreate
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.community_posts;

CREATE POLICY "Authenticated users can create posts"
ON public.community_posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);