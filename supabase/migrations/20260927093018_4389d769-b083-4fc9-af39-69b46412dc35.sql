REVOKE EXECUTE ON FUNCTION public.require_cap_token() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_user_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;