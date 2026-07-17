
-- Mail replies
CREATE TABLE public.mail_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mail_id UUID NOT NULL REFERENCES public.mail_messages(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL,
  body_html TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_mail_replies_mail ON public.mail_replies(mail_id);
CREATE INDEX idx_mail_replies_sender ON public.mail_replies(sender_user_id);

GRANT SELECT, INSERT ON public.mail_replies TO authenticated;
GRANT ALL ON public.mail_replies TO service_role;

ALTER TABLE public.mail_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can send replies as themselves"
  ON public.mail_replies FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_user_id);

CREATE POLICY "Users can view their own replies"
  ON public.mail_replies FOR SELECT TO authenticated
  USING (auth.uid() = sender_user_id);

CREATE POLICY "Admins can view all replies"
  ON public.mail_replies FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Treatment plans
CREATE TABLE public.treatment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  cbt_summary TEXT,
  ai_context TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_treatment_plans_user ON public.treatment_plans(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.treatment_plans TO authenticated;
GRANT ALL ON public.treatment_plans TO service_role;

ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own treatment plans"
  ON public.treatment_plans FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_treatment_plans_updated_at
  BEFORE UPDATE ON public.treatment_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
