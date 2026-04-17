
-- 1. Revoke public/authenticated execute on reputation function (triggers still work)
REVOKE EXECUTE ON FUNCTION public.update_user_reputation(uuid, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_user_reputation(uuid, integer) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_user_reputation(uuid, integer) FROM anon;

-- 2. Songs bucket: owner-scoped policies (folder = user id)
CREATE POLICY "Users can read own songs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'Songs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own songs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'Songs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own songs"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'Songs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own songs"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'Songs' AND auth.uid()::text = (storage.foldername(name))[1]);
