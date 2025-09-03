-- Create AI usage tracking table with RLS
CREATE TABLE public.ai_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature TEXT NOT NULL, -- 'mindmate', 'analytics_tip', etc.
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for AI usage tracking
CREATE POLICY "Users can view their own AI usage" 
ON public.ai_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI usage logs" 
ON public.ai_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Fix the update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;