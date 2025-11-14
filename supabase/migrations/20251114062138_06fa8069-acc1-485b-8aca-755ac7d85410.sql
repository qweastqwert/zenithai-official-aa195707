-- Create ban appeals table
CREATE TABLE IF NOT EXISTS public.ban_appeals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ban_id uuid NOT NULL,
  user_id uuid NOT NULL,
  appeal_text text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add reputation column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS reputation integer NOT NULL DEFAULT 0;

-- Enable RLS on ban_appeals
ALTER TABLE public.ban_appeals ENABLE ROW LEVEL SECURITY;

-- RLS policies for ban_appeals
CREATE POLICY "Users can create their own appeals"
ON public.ban_appeals
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own appeals"
ON public.ban_appeals
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all appeals"
ON public.ban_appeals
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update appeals"
ON public.ban_appeals
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Trigger for ban_appeals updated_at
CREATE TRIGGER update_ban_appeals_updated_at
BEFORE UPDATE ON public.ban_appeals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update reputation
CREATE OR REPLACE FUNCTION public.update_user_reputation(
  target_user_id uuid,
  points integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET reputation = GREATEST(0, reputation + points)
  WHERE user_id = target_user_id;
END;
$$;

-- Trigger to award reputation for creating posts
CREATE OR REPLACE FUNCTION public.award_post_reputation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    PERFORM public.update_user_reputation(NEW.user_id, 5);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER award_reputation_on_post
AFTER INSERT ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.award_post_reputation();

-- Trigger to award reputation for creating comments
CREATE OR REPLACE FUNCTION public.award_comment_reputation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    PERFORM public.update_user_reputation(NEW.user_id, 2);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER award_reputation_on_comment
AFTER INSERT ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION public.award_comment_reputation();

-- Trigger to deduct reputation when banned
CREATE OR REPLACE FUNCTION public.deduct_ban_reputation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.update_user_reputation(NEW.user_id, -50);
  RETURN NEW;
END;
$$;

CREATE TRIGGER deduct_reputation_on_ban
AFTER INSERT ON public.community_bans
FOR EACH ROW
EXECUTE FUNCTION public.deduct_ban_reputation();