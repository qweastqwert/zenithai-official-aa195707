-- Create sleep_profiles table for user sleep preferences
CREATE TABLE public.sleep_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sleep_time TEXT NOT NULL,
  wake_time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sleep_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for sleep_profiles
CREATE POLICY "Users can view their own sleep profile" 
ON public.sleep_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sleep profile" 
ON public.sleep_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep profile" 
ON public.sleep_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep profile" 
ON public.sleep_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create sleep_logs table for daily sleep tracking
CREATE TABLE public.sleep_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date TEXT NOT NULL,
  sleep_confirmed_at TIMESTAMP WITH TIME ZONE,
  sleep_quality TEXT,
  wake_response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for sleep_logs
CREATE POLICY "Users can view their own sleep logs" 
ON public.sleep_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sleep logs" 
ON public.sleep_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep logs" 
ON public.sleep_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep logs" 
ON public.sleep_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sleep_profiles_updated_at
BEFORE UPDATE ON public.sleep_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sleep_logs_updated_at
BEFORE UPDATE ON public.sleep_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();