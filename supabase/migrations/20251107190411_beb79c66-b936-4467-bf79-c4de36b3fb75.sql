-- Fix user_roles public exposure
-- Drop the insecure public policy
DROP POLICY IF EXISTS "Anyone can view user roles" ON public.user_roles;

-- Add secure policy: Users can only view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add database constraints for community content
ALTER TABLE public.community_posts 
ADD CONSTRAINT title_length_check CHECK (char_length(title) <= 200),
ADD CONSTRAINT description_length_check CHECK (char_length(description) <= 2000);

ALTER TABLE public.community_comments
ADD CONSTRAINT content_length_check CHECK (char_length(content) <= 2000);