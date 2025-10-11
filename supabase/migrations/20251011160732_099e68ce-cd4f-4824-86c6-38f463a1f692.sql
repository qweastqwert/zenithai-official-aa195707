-- Create mind_archive table for storing user memories
CREATE TABLE public.mind_archive (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  memory_text text NOT NULL,
  category text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mind_archive ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Users can view their own memories"
ON public.mind_archive
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memories"
ON public.mind_archive
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories"
ON public.mind_archive
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories"
ON public.mind_archive
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mind_archive_updated_at
BEFORE UPDATE ON public.mind_archive
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();