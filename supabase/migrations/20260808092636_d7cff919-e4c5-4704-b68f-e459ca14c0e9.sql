
-- Harden role-check helpers so signed-in users cannot probe other users' roles
CREATE OR REPLACE FUNCTION public.is_staff_manager(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $function$
  SELECT CASE
    WHEN _user_id IS DISTINCT FROM auth.uid()
         AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin','manager'))
      THEN false
    ELSE EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','manager'))
  END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $function$
  SELECT CASE
    WHEN _user_id IS DISTINCT FROM auth.uid()
         AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin','manager'))
      THEN false
    ELSE EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
  END;
$function$;

-- profiles: only own row, or staff managers/admins
DROP POLICY IF EXISTS "profiles readable by authenticated" ON public.profiles;
CREATE POLICY "profiles select own or manager" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_staff_manager(auth.uid()));

-- user_roles: only own rows, or staff managers/admins
DROP POLICY IF EXISTS "roles readable by authenticated" ON public.user_roles;
CREATE POLICY "user_roles select own or manager" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff_manager(auth.uid()));
