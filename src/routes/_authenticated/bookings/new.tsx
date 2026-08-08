import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { SectionCard } from "@/components/crm-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PAYMENT_STATUSES, type PaymentStatus } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/bookings/new")({
  head: () => ({
    meta: [
      { title: "Add booking — OM Value Homes CRM" },
      { name: "description", content: "Record a new or already-completed booking against an existing lead." },
      { property: "og:title", content: "Add booking — OM Value Homes CRM" },
      { property: "og:description", content: "Record a new or already-completed booking against an existing lead." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NewBooking,
});

function NewBooking() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    booking_date: new Date().toISOString().slice(0, 10),
    project_name: "",
    unit_number: "",
    booking_amount: "",
    received_amount: "",
    payment_status: "pending" as PaymentStatus,
    agreement_status: "pending",
    notes: "",
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["leads-for-booking"],
    queryFn: async () => {
      const { data } = await supabase
        .from("leads")
        .select("id, customer_name, mobile, status")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? leads.filter((l) => l.customer_name.toLowerCase().includes(q) || l.mobile.includes(q))
      : leads;
    return list.slice(0, 8);
  }, [leads, search]);

  const selected = leads.find((l) => l.id === leadId) ?? null;

  async function save() {
    if (!leadId || !user) {
      toast.error("Pehle lead select kijiye");
      return;
    }
    if (!form.booking_amount) {
      toast.error("Booking amount daaliye");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("bookings").insert({
      lead_id: leadId,
      booking_date: form.booking_date,
      project_name: form.project_name.trim() || null,
      unit_number: form.unit_number.trim() || null,
      booking_amount: Number(form.booking_amount),
      received_amount: Number(form.received_amount || 0),
      payment_status: form.payment_status,
      agreement_status: form.agreement_status,
      notes: form.notes.trim() || null,
      created_by: user.id,
    });

    if (error) {
      setSaving(false);
      toast.error(error.message);
      return;
    }

    await supabase.from("leads").update({ status: "booked" }).eq("id", leadId);
    await supabase.from("activity_logs").insert({
      lead_id: leadId,
      action: "Booking added",
      detail: `${form.project_name || "Booking"} · ₹${form.booking_amount}`,
      actor_id: user.id,
    });

    await queryClient.invalidateQueries();
    setSaving(false);
    toast.success("Booking added");
    navigate({ to: "/bookings" });
  }

  return (
    <AppShell title="Add booking" subtitle="Nayi ya purani booking record kijiye" back="/bookings">
      <div className="space-y-4">
        <SectionCard title="Lead">
          {selected ? (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{selected.customer_name}</p>
                <p className="text-xs text-muted-foreground">{selected.mobile}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setLeadId(null)}>
                Change
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="Search customer name or mobile"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11"
              />
              <ul className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <li className="py-3 text-sm text-muted-foreground">
                    Koi lead nahi mili. Pehle lead add kijiye.
                  </li>
                ) : (
                  filtered.map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        onClick={() => setLeadId(l.id)}
                        className="flex w-full items-center justify-between gap-2 py-2.5 text-left"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">{l.customer_name}</span>
                          <span className="block text-xs text-muted-foreground">{l.mobile}</span>
                        </span>
                        <span className="text-xs font-semibold text-primary">Select</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Booking details">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Booking date">
              <Input
                type="date"
                className="h-11"
                value={form.booking_date}
                onChange={(e) => setForm({ ...form, booking_date: e.target.value })}
              />
            </Field>
            <Field label="Project">
              <Input
                className="h-11"
                value={form.project_name}
                onChange={(e) => setForm({ ...form, project_name: e.target.value })}
              />
            </Field>
            <Field label="Unit number">
              <Input
                className="h-11"
                value={form.unit_number}
                onChange={(e) => setForm({ ...form, unit_number: e.target.value })}
              />
            </Field>
            <Field label="Booking amount (₹)">
              <Input
                type="number"
                inputMode="numeric"
                className="h-11"
                value={form.booking_amount}
                onChange={(e) => setForm({ ...form, booking_amount: e.target.value })}
              />
            </Field>
            <Field label="Received amount (₹)">
              <Input
                type="number"
                inputMode="numeric"
                className="h-11"
                value={form.received_amount}
                onChange={(e) => setForm({ ...form, received_amount: e.target.value })}
              />
            </Field>
            <Field label="Payment status">
              <Select
                value={form.payment_status}
                onValueChange={(v) => setForm({ ...form, payment_status: v as PaymentStatus })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Agreement status">
              <Select
                value={form.agreement_status}
                onValueChange={(v) => setForm({ ...form, agreement_status: v })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Notes">
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Field>
          </div>
        </SectionCard>

        <Button className="h-12 w-full" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save booking"}
        </Button>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
