-- Mail messages
CREATE TABLE public.mail_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL = broadcast
  title TEXT NOT NULL,
  body_html TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'announcement', -- welcome | announcement | event | update
  is_welcome BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mail_messages_recipient ON public.mail_messages(recipient_user_id);
CREATE INDEX idx_mail_messages_created ON public.mail_messages(created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mail_messages TO authenticated;
GRANT ALL ON public.mail_messages TO service_role;

ALTER TABLE public.mail_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read their mail or broadcasts"
  ON public.mail_messages FOR SELECT TO authenticated
  USING (recipient_user_id = auth.uid() OR recipient_user_id IS NULL);

CREATE POLICY "Admins insert mail"
  ON public.mail_messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins delete mail"
  ON public.mail_messages FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins update mail"
  ON public.mail_messages FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Read receipts
CREATE TABLE public.mail_reads (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mail_id UUID NOT NULL REFERENCES public.mail_messages(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, mail_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mail_reads TO authenticated;
GRANT ALL ON public.mail_reads TO service_role;

ALTER TABLE public.mail_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their reads"
  ON public.mail_reads FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Per-user hide
CREATE TABLE public.mail_deleted (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mail_id UUID NOT NULL REFERENCES public.mail_messages(id) ON DELETE CASCADE,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, mail_id)
);

GRANT SELECT, INSERT, DELETE ON public.mail_deleted TO authenticated;
GRANT ALL ON public.mail_deleted TO service_role;

ALTER TABLE public.mail_deleted ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their hidden mail"
  ON public.mail_deleted FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Update new-user handler to also insert a welcome mail
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.mail_messages (recipient_user_id, title, body_html, category, is_welcome)
  VALUES (
    NEW.id,
    '🌸 Welcome to Zenith',
    '<div style="font-family: Inter, system-ui, sans-serif; line-height:1.6; color:#1f2937;">
       <h2 style="color:#7c3aed; margin-top:0;">Welcome to Zenith ✨</h2>
       <p>Hi there, and welcome to your new wellness sanctuary.</p>
       <p>Zenith is your private space to <strong>track your moods</strong>, <strong>journal your thoughts</strong>, <strong>breathe through hard moments</strong>, and <strong>talk to MindMate</strong> whenever you need a kind voice.</p>
       <p>A few gentle ways to start:</p>
       <ul>
         <li>💜 Tap <em>MindMate</em> to say hi to your AI companion</li>
         <li>📖 Open the <em>Journal</em> and write a single sentence about today</li>
         <li>🌿 Try a 1-minute <em>Breathing</em> exercise</li>
       </ul>
       <p>This mailbox is where we''ll send you occasional notes about new features, events, and little surprises. Nothing spammy — promise.</p>
       <p style="margin-top:24px;">With care,<br/><strong>The Zenith Team</strong> 🌱</p>
     </div>',
    'welcome',
    true
  );

  RETURN NEW;
END;
$$;