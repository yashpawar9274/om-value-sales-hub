import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { LeadForm, emptyLead, type LeadFormValues } from "@/components/LeadForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/leads/new")({
  head: () => ({
    meta: [
      { title: "Add lead — OM Value Homes CRM" },
      { name: "description", content: "Capture a new property enquiry with source, budget and assignment." },
      { property: "og:title", content: "Add lead — OM Value Homes CRM" },
      { property: "og:description", content: "Capture a new property enquiry with source, budget and assignment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewLead,
});

function NewLead() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isManager } = useAuth();
  const [values, setValues] = useState<LeadFormValues>(emptyLead());
  const [saving, setSaving] = useState(false);
  const [duplicate, setDuplicate] = useState<string | null>(null);


  useEffect(() => {
    const mobile = values.mobile.trim();
    if (mobile.length < 8) {
      setDuplicate(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      const { data } = await supabase.from("leads").select("customer_name").eq("mobile", mobile).limit(1);
      if (cancelled) return;
      setDuplicate(data && data.length > 0 ? `A lead already exists for this number (${data[0]!.customer_name}).` : null);
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [values.mobile]);

  async function handleSubmit() {
    setSaving(true);
    const { data, error } = await supabase
      .from("leads")
      .insert({
        customer_name: values.customer_name.trim(),
        mobile: values.mobile.trim(),
        alternate_mobile: values.alternate_mobile.trim() || null,
        email: values.email.trim() || null,
        budget: values.budget ? Number(values.budget) : null,
        configuration: values.configuration.trim() || null,
        source: values.source,
        priority: values.priority,
        status: values.status,
        assigned_to: values.assigned_to || user?.id || null,
        location: values.location.trim() || null,
        notes: values.notes.trim() || null,
        created_by: user!.id,
      })
      .select("id")
      .single();
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.from("activity_logs").insert({
      actor_id: user?.id ?? null,
      lead_id: data.id,
      action: "Lead created",
      detail: values.customer_name.trim(),
    });

    queryClient.invalidateQueries();
    toast.success("Lead added");
    navigate({ to: "/leads/$leadId", params: { leadId: data.id }, replace: true });
  }

  return (
    <AppShell title="Add lead" subtitle="Capture a new enquiry" back="/leads">
      <LeadForm
        value={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        submitting={saving}
        submitLabel="Save lead"
        duplicateWarning={duplicate}
      />
    </AppShell>
  );
}
