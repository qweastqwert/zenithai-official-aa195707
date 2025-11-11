-- Create enum for report types
CREATE TYPE public.report_type AS ENUM ('post', 'comment');

-- Create enum for report reasons
CREATE TYPE public.report_reason AS ENUM (
  'spam',
  'harassment',
  'inappropriate_content',
  'misinformation',
  'other'
);

-- Create enum for report status
CREATE TYPE public.report_status AS ENUM ('pending', 'reviewed', 'dismissed', 'actioned');

-- Create community_reports table
CREATE TABLE public.community_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL,
  reported_user_id uuid,
  report_type report_type NOT NULL,
  content_id uuid NOT NULL,
  reason report_reason NOT NULL,
  details text,
  status report_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create community_bans table
CREATE TABLE public.community_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  banned_by uuid NOT NULL,
  reason text NOT NULL,
  ban_days integer NOT NULL CHECK (ban_days >= 1 AND ban_days <= 365),
  banned_until timestamp with time zone NOT NULL,
  is_permanent boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_bans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_reports
CREATE POLICY "Users can create reports"
  ON public.community_reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports"
  ON public.community_reports
  FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports"
  ON public.community_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update reports"
  ON public.community_reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for community_bans
CREATE POLICY "Users can view their own ban status"
  ON public.community_bans
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bans"
  ON public.community_bans
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create bans"
  ON public.community_bans
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update bans"
  ON public.community_bans
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete bans"
  ON public.community_bans
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to check if user is banned
CREATE OR REPLACE FUNCTION public.is_user_banned(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.community_bans
    WHERE user_id = user_uuid
      AND (is_permanent = true OR banned_until > now())
  );
END;
$$;

-- Create trigger to update updated_at
CREATE TRIGGER update_community_reports_updated_at
  BEFORE UPDATE ON public.community_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_bans_updated_at
  BEFORE UPDATE ON public.community_bans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();