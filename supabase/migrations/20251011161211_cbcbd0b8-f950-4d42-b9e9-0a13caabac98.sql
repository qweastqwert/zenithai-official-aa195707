-- Create table for temporary conversation storage
CREATE TABLE public.conversation_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  messages jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  analyzed boolean NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own conversations"
ON public.conversation_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
ON public.conversation_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
ON public.conversation_history
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
ON public.conversation_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_conversation_history_user_created 
ON public.conversation_history(user_id, created_at DESC);

CREATE INDEX idx_conversation_history_analyzed 
ON public.conversation_history(analyzed) 
WHERE analyzed = false;

-- Create function to delete old conversations (older than 3 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_conversations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.conversation_history
  WHERE created_at < NOW() - INTERVAL '3 days';
END;
$$;