
REVOKE EXECUTE ON FUNCTION public.notify_user(uuid, uuid, text, text, text, text, uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.actor_name(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.on_lead_created() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.on_lead_reassigned() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.on_follow_up_created() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.on_site_visit_created() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.on_booking_created() FROM anon, authenticated, PUBLIC;
