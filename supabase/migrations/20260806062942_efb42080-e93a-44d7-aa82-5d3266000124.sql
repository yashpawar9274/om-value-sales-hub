-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin','manager','executive');
CREATE TYPE public.lead_status AS ENUM ('new','contacted','interested','follow_up','site_visit_scheduled','visited','negotiation','booked','lost','hold');
CREATE TYPE public.lead_source AS ENUM ('facebook','instagram','google','whatsapp','walk_in','reference','property_portal','others');
CREATE TYPE public.lead_priority AS ENUM ('high','medium','low');
CREATE TYPE public.followup_status AS ENUM ('pending','completed','missed','rescheduled');
CREATE TYPE public.visit_status AS ENUM ('scheduled','completed','cancelled','no_show');
CREATE TYPE public.payment_status AS ENUM ('pending','partial','completed','cancelled');

-- UPDATED_AT HELPER
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff_manager(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','manager'));
$$;

CREATE POLICY "profiles readable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin')) WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin insert profiles" ON public.profiles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') OR id = auth.uid());
CREATE POLICY "admin delete profiles" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "roles readable by authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);

-- LEADS
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  alternate_mobile TEXT,
  email TEXT,
  budget NUMERIC,
  configuration TEXT,
  source public.lead_source NOT NULL DEFAULT 'others',
  priority public.lead_priority NOT NULL DEFAULT 'medium',
  status public.lead_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX leads_mobile_idx ON public.leads (mobile);
CREATE INDEX leads_assigned_idx ON public.leads (assigned_to);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.can_access_lead(_lead_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.leads l
    WHERE l.id = _lead_id
      AND (public.is_staff_manager(auth.uid()) OR l.assigned_to = auth.uid() OR l.created_by = auth.uid())
  );
$$;

CREATE POLICY "leads select" ON public.leads FOR SELECT TO authenticated
  USING (public.is_staff_manager(auth.uid()) OR assigned_to = auth.uid() OR created_by = auth.uid());
CREATE POLICY "leads insert" ON public.leads FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "leads update" ON public.leads FOR UPDATE TO authenticated
  USING (public.is_staff_manager(auth.uid()) OR assigned_to = auth.uid() OR created_by = auth.uid())
  WITH CHECK (public.is_staff_manager(auth.uid()) OR assigned_to = auth.uid() OR created_by = auth.uid());
CREATE POLICY "leads delete" ON public.leads FOR DELETE TO authenticated
  USING (public.is_staff_manager(auth.uid()) OR created_by = auth.uid());

-- LEAD NOTES
CREATE TABLE public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_notes TO authenticated;
GRANT ALL ON public.lead_notes TO service_role;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lead_notes select" ON public.lead_notes FOR SELECT TO authenticated USING (public.can_access_lead(lead_id));
CREATE POLICY "lead_notes insert" ON public.lead_notes FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND public.can_access_lead(lead_id));
CREATE POLICY "lead_notes delete" ON public.lead_notes FOR DELETE TO authenticated USING (created_by = auth.uid() OR public.is_staff_manager(auth.uid()));

-- FOLLOW UPS
CREATE TABLE public.follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  due_at TIMESTAMPTZ NOT NULL,
  status public.followup_status NOT NULL DEFAULT 'pending',
  outcome TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX follow_ups_due_idx ON public.follow_ups (due_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.follow_ups TO authenticated;
GRANT ALL ON public.follow_ups TO service_role;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER follow_ups_updated_at BEFORE UPDATE ON public.follow_ups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "follow_ups select" ON public.follow_ups FOR SELECT TO authenticated USING (public.can_access_lead(lead_id));
CREATE POLICY "follow_ups insert" ON public.follow_ups FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND public.can_access_lead(lead_id));
CREATE POLICY "follow_ups update" ON public.follow_ups FOR UPDATE TO authenticated USING (public.can_access_lead(lead_id)) WITH CHECK (public.can_access_lead(lead_id));
CREATE POLICY "follow_ups delete" ON public.follow_ups FOR DELETE TO authenticated USING (created_by = auth.uid() OR public.is_staff_manager(auth.uid()));

-- SITE VISITS
CREATE TABLE public.site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  visit_at TIMESTAMPTZ NOT NULL,
  status public.visit_status NOT NULL DEFAULT 'scheduled',
  project_name TEXT,
  location TEXT,
  interested_unit TEXT,
  feedback TEXT,
  next_action TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX site_visits_at_idx ON public.site_visits (visit_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_visits TO authenticated;
GRANT ALL ON public.site_visits TO service_role;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER site_visits_updated_at BEFORE UPDATE ON public.site_visits FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "site_visits select" ON public.site_visits FOR SELECT TO authenticated USING (public.can_access_lead(lead_id));
CREATE POLICY "site_visits insert" ON public.site_visits FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND public.can_access_lead(lead_id));
CREATE POLICY "site_visits update" ON public.site_visits FOR UPDATE TO authenticated USING (public.can_access_lead(lead_id)) WITH CHECK (public.can_access_lead(lead_id));
CREATE POLICY "site_visits delete" ON public.site_visits FOR DELETE TO authenticated USING (created_by = auth.uid() OR public.is_staff_manager(auth.uid()));

-- BOOKINGS
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  project_name TEXT,
  unit_number TEXT,
  booking_amount NUMERIC NOT NULL DEFAULT 0,
  received_amount NUMERIC NOT NULL DEFAULT 0,
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  agreement_status TEXT NOT NULL DEFAULT 'pending',
  document_urls TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "bookings select" ON public.bookings FOR SELECT TO authenticated USING (public.can_access_lead(lead_id));
CREATE POLICY "bookings insert" ON public.bookings FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND public.can_access_lead(lead_id));
CREATE POLICY "bookings update" ON public.bookings FOR UPDATE TO authenticated USING (public.can_access_lead(lead_id)) WITH CHECK (public.can_access_lead(lead_id));
CREATE POLICY "bookings delete" ON public.bookings FOR DELETE TO authenticated USING (created_by = auth.uid() OR public.is_staff_manager(auth.uid()));

-- ACTIVITY LOGS
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  detail TEXT,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX activity_logs_lead_idx ON public.activity_logs (lead_id, created_at DESC);
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity select" ON public.activity_logs FOR SELECT TO authenticated USING (lead_id IS NULL OR public.can_access_lead(lead_id));
CREATE POLICY "activity insert" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());

-- APP SETTINGS
CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings select" ON public.app_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "settings admin write" ON public.app_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
GRANT INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;

-- SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name',''), NEW.email, NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN (SELECT COUNT(*) FROM public.user_roles) = 0 THEN 'admin'::public.app_role ELSE 'executive'::public.app_role END)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();