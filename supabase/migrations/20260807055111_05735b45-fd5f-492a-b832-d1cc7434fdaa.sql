
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'general',
  title text NOT NULL,
  body text,
  link text,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own notifications select" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own notifications update" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own notifications delete" ON public.notifications
  FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications insert self" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());

CREATE INDEX notifications_user_created_idx ON public.notifications (user_id, created_at DESC);
CREATE INDEX notifications_user_unread_idx ON public.notifications (user_id) WHERE is_read = false;

CREATE TABLE public.push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  platform text NOT NULL DEFAULT 'web',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_tokens TO authenticated;
GRANT ALL ON public.push_tokens TO service_role;

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own push tokens" ON public.push_tokens
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TRIGGER push_tokens_updated_at BEFORE UPDATE ON public.push_tokens
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- helper: insert a notification row
CREATE OR REPLACE FUNCTION public.notify_user(_user_id uuid, _actor_id uuid, _type text, _title text, _body text, _link text, _lead_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS NULL THEN RETURN; END IF;
  IF _actor_id IS NOT NULL AND _user_id = _actor_id THEN RETURN; END IF;
  INSERT INTO public.notifications (user_id, actor_id, type, title, body, link, lead_id)
  VALUES (_user_id, _actor_id, _type, _title, _body, _link, _lead_id);
END; $$;

REVOKE EXECUTE ON FUNCTION public.notify_user(uuid, uuid, text, text, text, text, uuid) FROM anon, PUBLIC;

CREATE OR REPLACE FUNCTION public.actor_name(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(NULLIF(p.full_name, ''), p.email, 'A team member') FROM public.profiles p WHERE p.id = _user_id;
$$;

REVOKE EXECUTE ON FUNCTION public.actor_name(uuid) FROM anon, PUBLIC;

-- new lead -> notify all admins/managers + assignee
CREATE OR REPLACE FUNCTION public.on_lead_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  m record;
  who text;
BEGIN
  who := public.actor_name(NEW.created_by);
  FOR m IN SELECT DISTINCT user_id FROM public.user_roles WHERE role IN ('admin','manager') LOOP
    PERFORM public.notify_user(m.user_id, NEW.created_by, 'lead_created',
      'New lead added by ' || who,
      NEW.customer_name || ' • ' || NEW.mobile,
      '/leads/' || NEW.id::text, NEW.id);
  END LOOP;
  IF NEW.assigned_to IS NOT NULL THEN
    PERFORM public.notify_user(NEW.assigned_to, NEW.created_by, 'lead_assigned',
      'Lead assigned to you',
      NEW.customer_name || ' • ' || NEW.mobile,
      '/leads/' || NEW.id::text, NEW.id);
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER leads_notify_insert AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.on_lead_created();

-- reassignment
CREATE OR REPLACE FUNCTION public.on_lead_reassigned()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to AND NEW.assigned_to IS NOT NULL THEN
    PERFORM public.notify_user(NEW.assigned_to, auth.uid(), 'lead_assigned',
      'Lead assigned to you', NEW.customer_name || ' • ' || NEW.mobile,
      '/leads/' || NEW.id::text, NEW.id);
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER leads_notify_reassign AFTER UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.on_lead_reassigned();

-- follow ups
CREATE OR REPLACE FUNCTION public.on_follow_up_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE m record; who text; cust text;
BEGIN
  who := public.actor_name(NEW.created_by);
  SELECT customer_name INTO cust FROM public.leads WHERE id = NEW.lead_id;
  PERFORM public.notify_user(NEW.assigned_to, NEW.created_by, 'follow_up',
    'Follow-up scheduled for you', COALESCE(cust,'Lead') || ' • ' || to_char(NEW.due_at, 'DD Mon HH24:MI'),
    '/leads/' || NEW.lead_id::text, NEW.lead_id);
  FOR m IN SELECT DISTINCT user_id FROM public.user_roles WHERE role IN ('admin','manager') LOOP
    PERFORM public.notify_user(m.user_id, NEW.created_by, 'follow_up',
      'Follow-up added by ' || who, COALESCE(cust,'Lead') || ' • ' || to_char(NEW.due_at, 'DD Mon HH24:MI'),
      '/leads/' || NEW.lead_id::text, NEW.lead_id);
  END LOOP;
  RETURN NEW;
END; $$;

CREATE TRIGGER follow_ups_notify_insert AFTER INSERT ON public.follow_ups
  FOR EACH ROW EXECUTE FUNCTION public.on_follow_up_created();

-- site visits
CREATE OR REPLACE FUNCTION public.on_site_visit_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE m record; who text; cust text;
BEGIN
  who := public.actor_name(NEW.created_by);
  SELECT customer_name INTO cust FROM public.leads WHERE id = NEW.lead_id;
  PERFORM public.notify_user(NEW.assigned_to, NEW.created_by, 'site_visit',
    'Site visit scheduled for you', COALESCE(cust,'Lead') || ' • ' || to_char(NEW.visit_at, 'DD Mon HH24:MI'),
    '/leads/' || NEW.lead_id::text, NEW.lead_id);
  FOR m IN SELECT DISTINCT user_id FROM public.user_roles WHERE role IN ('admin','manager') LOOP
    PERFORM public.notify_user(m.user_id, NEW.created_by, 'site_visit',
      'Site visit added by ' || who, COALESCE(cust,'Lead') || ' • ' || to_char(NEW.visit_at, 'DD Mon HH24:MI'),
      '/leads/' || NEW.lead_id::text, NEW.lead_id);
  END LOOP;
  RETURN NEW;
END; $$;

CREATE TRIGGER site_visits_notify_insert AFTER INSERT ON public.site_visits
  FOR EACH ROW EXECUTE FUNCTION public.on_site_visit_created();

-- bookings
CREATE OR REPLACE FUNCTION public.on_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE m record; who text; cust text;
BEGIN
  who := public.actor_name(NEW.created_by);
  SELECT customer_name INTO cust FROM public.leads WHERE id = NEW.lead_id;
  FOR m IN SELECT DISTINCT user_id FROM public.user_roles WHERE role IN ('admin','manager') LOOP
    PERFORM public.notify_user(m.user_id, NEW.created_by, 'booking',
      'Booking created by ' || who, COALESCE(cust,'Lead') || ' • ₹' || NEW.booking_amount::text,
      '/bookings', NEW.lead_id);
  END LOOP;
  RETURN NEW;
END; $$;

CREATE TRIGGER bookings_notify_insert AFTER INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.on_booking_created();

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
