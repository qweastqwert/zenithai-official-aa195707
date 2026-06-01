
-- Table for PIN reset requests (admin-handled)
CREATE TABLE public.pin_reset_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT,
  user_display_name TEXT,
  reason TEXT NOT NULL,
  confirmation_phrase TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | denied | cancelled
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.pin_reset_requests TO authenticated;
GRANT ALL ON public.pin_reset_requests TO service_role;

ALTER TABLE public.pin_reset_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own reset requests"
  ON public.pin_reset_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reset requests"
  ON public.pin_reset_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own pending requests"
  ON public.pin_reset_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status IN ('pending','cancelled'));

CREATE POLICY "Admins can view all reset requests"
  ON public.pin_reset_requests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update reset requests"
  ON public.pin_reset_requests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_pin_reset_requests_updated_at
  BEFORE UPDATE ON public.pin_reset_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Allow admins to clear a PIN after verifying a reset request
CREATE OR REPLACE FUNCTION public.admin_clear_journal_pin(_target_user uuid, _request_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  DELETE FROM public.journal_private_pins WHERE user_id = _target_user;

  UPDATE public.pin_reset_requests
    SET status = 'approved', reviewed_by = auth.uid(), reviewed_at = now()
    WHERE id = _request_id;
END;
$$;
