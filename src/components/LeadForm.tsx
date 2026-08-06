import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  type Lead,
  type LeadPriority,
  type LeadSource,
  type LeadStatus,
} from "@/lib/crm";

export type LeadFormValues = {
  customer_name: string;
  mobile: string;
  alternate_mobile: string;
  email: string;
  budget: string;
  configuration: string;
  source: LeadSource;
  priority: LeadPriority;
  status: LeadStatus;
  assigned_to: string;
  location: string;
  notes: string;
};

export function emptyLead(): LeadFormValues {
  return {
    customer_name: "",
    mobile: "",
    alternate_mobile: "",
    email: "",
    budget: "",
    configuration: "",
    source: "others",
    priority: "medium",
    status: "new",
    assigned_to: "",
    location: "",
    notes: "",
  };
}

export function leadToForm(lead: Lead): LeadFormValues {
  return {
    customer_name: lead.customer_name,
    mobile: lead.mobile,
    alternate_mobile: lead.alternate_mobile ?? "",
    email: lead.email ?? "",
    budget: lead.budget !== null ? String(lead.budget) : "",
    configuration: lead.configuration ?? "",
    source: lead.source,
    priority: lead.priority,
    status: lead.status,
    assigned_to: lead.assigned_to ?? "",
    location: lead.location ?? "",
    notes: lead.notes ?? "",
  };
}

export function LeadForm({
  value,
  onChange,
  onSubmit,
  submitting,
  submitLabel,
  duplicateWarning,
}: {
  value: LeadFormValues;
  onChange: (next: LeadFormValues) => void;
  onSubmit: () => void;
  submitting: boolean;
  submitLabel: string;
  duplicateWarning?: string | null;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: team = [] } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
      return data ?? [];
    },
  });

  const set = (patch: Partial<LeadFormValues>) => onChange({ ...value, ...patch });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!value.customer_name.trim()) next["customer_name"] = "Customer name is required";
    if (!/^[\d+\-\s()]{8,15}$/.test(value.mobile.trim())) next["mobile"] = "Enter a valid mobile number";
    if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) next["email"] = "Enter a valid email";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="surface-card space-y-3 p-4">
        <Field label="Customer name" error={errors["customer_name"]}>
          <Input
            value={value.customer_name}
            maxLength={100}
            onChange={(e) => set({ customer_name: e.target.value })}
            placeholder="e.g. Ramesh Patel"
          />
        </Field>
        <Field label="Mobile number" error={errors["mobile"]}>
          <Input
            value={value.mobile}
            inputMode="tel"
            maxLength={15}
            onChange={(e) => set({ mobile: e.target.value })}
            placeholder="9876543210"
          />
          {duplicateWarning ? <p className="text-xs font-medium text-warning">{duplicateWarning}</p> : null}
        </Field>
        <Field label="Alternate number">
          <Input
            value={value.alternate_mobile}
            inputMode="tel"
            maxLength={15}
            onChange={(e) => set({ alternate_mobile: e.target.value })}
          />
        </Field>
        <Field label="Email" error={errors["email"]}>
          <Input type="email" maxLength={255} value={value.email} onChange={(e) => set({ email: e.target.value })} />
        </Field>
      </div>

      <div className="surface-card grid gap-3 p-4 sm:grid-cols-2">
        <Field label="Budget (₹)">
          <Input
            inputMode="numeric"
            value={value.budget}
            onChange={(e) => set({ budget: e.target.value.replace(/[^\d]/g, "") })}
            placeholder="4500000"
          />
        </Field>
        <Field label="Configuration">
          <Input
            value={value.configuration}
            maxLength={50}
            onChange={(e) => set({ configuration: e.target.value })}
            placeholder="2 BHK"
          />
        </Field>
        <Field label="Lead source">
          <Select value={value.source} onValueChange={(v) => set({ source: v as LeadSource })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Priority">
          <Select value={value.priority} onValueChange={(v) => set({ priority: v as LeadPriority })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_PRIORITIES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Status">
          <Select value={value.status} onValueChange={(v) => set({ status: v as LeadStatus })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Assigned executive">
          <Select value={value.assigned_to || "unassigned"} onValueChange={(v) => set({ assigned_to: v === "unassigned" ? "" : v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {team.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.full_name || t.email || "Team member"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Location / area">
            <Input value={value.location} maxLength={160} onChange={(e) => set({ location: e.target.value })} />
          </Field>
        </div>
      </div>

      <div className="surface-card p-4">
        <Field label="Notes">
          <Textarea rows={4} maxLength={1000} value={value.notes} onChange={(e) => set({ notes: e.target.value })} />
        </Field>
      </div>

      <Button type="submit" className="h-12 w-full text-base font-semibold" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
