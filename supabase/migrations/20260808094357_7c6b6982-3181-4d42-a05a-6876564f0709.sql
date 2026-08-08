CREATE TABLE public.enquiry_forms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  slug text NOT NULL UNIQUE,
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiry_forms TO authenticated;
GRANT ALL ON public.enquiry_forms TO service_role;
ALTER TABLE public.enquiry_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enquiry forms select" ON public.enquiry_forms
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "enquiry forms manage" ON public.enquiry_forms
  FOR ALL TO authenticated
  USING (public.is_staff_manager(auth.uid()))
  WITH CHECK (public.is_staff_manager(auth.uid()));

CREATE TRIGGER enquiry_forms_updated_at BEFORE UPDATE ON public.enquiry_forms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.enquiry_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id uuid REFERENCES public.enquiry_forms(id) ON DELETE SET NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  customer_name text NOT NULL,
  mobile text NOT NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.enquiry_submissions TO authenticated;
GRANT ALL ON public.enquiry_submissions TO service_role;
ALTER TABLE public.enquiry_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enquiry submissions select" ON public.enquiry_submissions
  FOR SELECT TO authenticated USING (true);

CREATE INDEX enquiry_submissions_form_idx ON public.enquiry_submissions(form_id);