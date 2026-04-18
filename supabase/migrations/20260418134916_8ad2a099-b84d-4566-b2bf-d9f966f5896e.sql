
-- Enable pg_cron and pg_net for scheduled push notifications
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule the send-scheduled-notifications edge function to run every minute
SELECT cron.schedule(
  'send-scheduled-notifications-every-minute',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://tipqgwdgplxlbwuvxyxa.supabase.co/functions/v1/send-scheduled-notifications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcHFnd2RncGx4bGJ3dXZ4eXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3OTg1MjYsImV4cCI6MjA2NzM3NDUyNn0.J9M4wG60dxyP17Jx95quletRqvJmUQbawEIwJS9MfO0'
    ),
    body := jsonb_build_object('scheduled', true)
  ) AS request_id;
  $$
);
