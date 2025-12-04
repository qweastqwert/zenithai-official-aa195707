-- Create votes table for posts
CREATE TABLE public.post_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create votes table for comments
CREATE TABLE public.comment_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.community_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable RLS
ALTER TABLE public.post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_votes
CREATE POLICY "Anyone can view post votes" ON public.post_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote on posts" ON public.post_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes" ON public.post_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own votes" ON public.post_votes FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for comment_votes
CREATE POLICY "Anyone can view comment votes" ON public.comment_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote on comments" ON public.comment_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes" ON public.comment_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own votes" ON public.comment_votes FOR DELETE USING (auth.uid() = user_id);

-- Function to update reputation when post is voted
CREATE OR REPLACE FUNCTION public.handle_post_vote_reputation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_author_id UUID;
BEGIN
  SELECT user_id INTO post_author_id FROM public.community_posts WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  
  IF post_author_id IS NOT NULL THEN
    IF TG_OP = 'INSERT' THEN
      PERFORM public.update_user_reputation(post_author_id, NEW.vote_type);
    ELSIF TG_OP = 'UPDATE' THEN
      -- Remove old vote effect, add new vote effect
      PERFORM public.update_user_reputation(post_author_id, NEW.vote_type - OLD.vote_type);
    ELSIF TG_OP = 'DELETE' THEN
      PERFORM public.update_user_reputation(post_author_id, -OLD.vote_type);
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Function to update reputation when comment is voted
CREATE OR REPLACE FUNCTION public.handle_comment_vote_reputation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  comment_author_id UUID;
BEGIN
  SELECT user_id INTO comment_author_id FROM public.community_comments WHERE id = COALESCE(NEW.comment_id, OLD.comment_id);
  
  IF comment_author_id IS NOT NULL THEN
    IF TG_OP = 'INSERT' THEN
      PERFORM public.update_user_reputation(comment_author_id, NEW.vote_type);
    ELSIF TG_OP = 'UPDATE' THEN
      PERFORM public.update_user_reputation(comment_author_id, NEW.vote_type - OLD.vote_type);
    ELSIF TG_OP = 'DELETE' THEN
      PERFORM public.update_user_reputation(comment_author_id, -OLD.vote_type);
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
CREATE TRIGGER on_post_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.post_votes
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_vote_reputation();

CREATE TRIGGER on_comment_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.comment_votes
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_vote_reputation();