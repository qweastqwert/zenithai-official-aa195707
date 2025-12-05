-- Update community_posts to keep posts when user is deleted (set user_id to NULL)
-- First drop any existing foreign key constraints on user_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'community_posts_user_id_fkey' 
    AND table_name = 'community_posts'
  ) THEN
    ALTER TABLE public.community_posts DROP CONSTRAINT community_posts_user_id_fkey;
  END IF;
END $$;

-- Update community_comments to keep comments when user is deleted
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'community_comments_user_id_fkey' 
    AND table_name = 'community_comments'
  ) THEN
    ALTER TABLE public.community_comments DROP CONSTRAINT community_comments_user_id_fkey;
  END IF;
END $$;