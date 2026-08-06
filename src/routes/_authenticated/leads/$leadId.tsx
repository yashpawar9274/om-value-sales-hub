import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { LeadForm, leadToForm, type LeadFormValues } from "@/components/LeadForm";
import { SectionCard, StatusChip } from "@/components/crm-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  FOLLOWUP_STATUSES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  VISIT_STATUSES,
  formatCurrency,
  formatDate,
  formatDateTime,
  labelOf,
  mapsHref,
  telHref,
  whatsappHref,
  type Lead,
  type VisitStatus,
} from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/leads/$leadId")({
  head: () => ({
    meta: [
      { title: "Lead details — OM Value Homes CRM" },
      { name: "description", content: "Full lead profile with notes, follow-ups, site visits and booking." },
      { property: "og:title", content: "Lead details — OM Value Homes CRM" },
      { property: "og:description", content: "Full lead profile with notes, follow-ups, site visits and booking." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LeadDetail,
});

function LeadDetail() {
  const { leadId } = Route.useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<LeadFormValues | null>(null);
  const [followDate, setFollowDate] = useState("");
  const [followNote, setFollowNote] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitProject, setVisitProject] = useState("");
  const [visitLocation, setVisitLocation] = useState("");

  const refresh = () => queryClient.invalidateQueries();

  const { data, isLoading } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      const [lead, notes, follows, visits, bookings, logs] = await Promise.all([
        supabase.from("leads").select("*").eq("id", leadId).maybeSingle(),
        supabase.from("lead_notes").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }),
        supabase.from("follow_ups").select("*").eq("lead_id", leadId).order("due_at", { ascending: false }),
        supabase.from("site_visits").select("*").eq("lead_id", leadId).order("visit_at", { ascending: false }),
        supabase.from("bookings").select("*").eq("lead_id", leadId).order("booking_date", { ascending: false }),
        supabase.from("activity_logs").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }),
      ]);
      return {
        lead: (lead.data ?? null) as Lead | null,
        notes: notes.data ?? [],
        follows: follows.data ?? [],
        visits: visits.data ?? [],
        bookings: bookings.data ?? [],
        logs: logs.data ?? [],
      };
    },
  });

  const lead = data?.lead ?? null;

  const saveLead = useMutation({
    mutationFn: async (values: LeadFormValues) => {
      const { error } = await supabase
        .from("leads")
        .update({
          customer_name: values.customer_name.trim(),
          mobile: values.mobile.trim(),
          alternate_mobile: values.alternate_mobile.trim() || null,
          email: values.email.trim() || null,
          budget: values.budget ? Number(values.budget) : null,
          configuration: values.configuration.trim() || null,
          source: values.source,
          priority: values.priority,
          status: values.status,
          assigned_to: values.assigned_to || null,
          location: values.location.trim() || null,
          notes: values.notes.trim() || null,
        })
        .eq("id", leadId);
      if (error) throw error;
      await supabase.from("activity_logs").insert({
        actor_id: user?.id ?? null,
        lead_id: leadId,
        action: "Lead updated",
        detail: `Status: ${labelOf(LEAD_STATUSES, values.status)}`,
      });
    },
    onSuccess: () => {
      toast.success("Lead updated");
      setEditing(false);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function changeStatus(status: string) {
    const { error } = await supabase.from("leads").update({ status: status as Lead["status"] }).eq("id", leadId);
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.from("activity_logs").insert({
      actor_id: user?.id ?? null,
      lead_id: leadId,
      action: "Status changed",
      detail: labelOf(LEAD_STATUSES, status),
    });
    toast.success("Status updated");
    refresh();
  }

  async function addNote() {
    if (!note.trim()) {
      return;
    }
    const { error } = await supabase.from("lead_notes").insert({ lead_id: leadId, note: note.trim(), created_by: user!.id });
    if (error) {
      toast.error(error.message);
      return;
    }
    setNote("");
    refresh();
  }

  async function addFollowUp() {
    if (!followDate) {
      toast.error("Pick a date and time");
      return;
    }
    const { error } = await supabase.from("follow_ups").insert({
      lead_id: leadId,
      due_at: new Date(followDate).toISOString(),
      notes: followNote.trim() || null,
      created_by: user!.id,
      assigned_to: lead?.assigned_to ?? user!.id,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setFollowDate("");
    setFollowNote("");
    toast.success("Follow-up scheduled");
    refresh();
  }

  async function completeFollowUp(id: string, status: "completed" | "missed") {
    const { error } = await supabase
      .from("follow_ups")
      .update({ status, completed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
  }

  async function addVisit() {
    if (!visitDate) {
      toast.error("Pick a visit date and time");
      return;
    }
    const { error } = await supabase.from("site_visits").insert({
      lead_id: leadId,
      visit_at: new Date(visitDate).toISOString(),
      project_name: visitProject.trim() || null,
      location: visitLocation.trim() || null,
      created_by: user!.id,
      assigned_to: lead?.assigned_to ?? user!.id,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setVisitDate("");
    setVisitProject("");
    setVisitLocation("");
    toast.success("Site visit scheduled");
    refresh();
  }

  async function setVisitStatus(id: string, status: VisitStatus) {
    const { error } = await supabase.from("site_visits").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
  }

  if (isLoading) {
    return (
      <AppShell title="Lead" back="/leads">
        <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  if (!lead) {
    return (
      <AppShell title="Lead not found" back="/leads">
        <p className="py-10 text-center text-sm text-muted-foreground">This lead may have been removed.</p>
      </AppShell>
    );
  }

  if (editing && form) {
    return (
      <AppShell title="Edit lead" subtitle={lead.customer_name} back="/leads">
        <LeadForm
          value={form}
          onChange={setForm}
          onSubmit={() => saveLead.mutate(form)}
          submitting={saveLead.isPending}
          submitLabel="Save changes"
        />
        <Button variant="ghost" className="mt-3 w-full" onClick={() => setEditing(false)}>
          Cancel
        </Button>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={lead.customer_name}
      subtitle={`${labelOf(LEAD_SOURCES, lead.source)} · added ${formatDate(lead.created_at)}`}
      back="/leads"
      action={
        <Button
          size="sm"
          variant="secondary"
          className="font-semibold"
          onClick={() => {
            setForm(leadToForm(lead));
            setEditing(true);
          }}
        >
          Edit
        </Button>
      }
    >
      <div className="surface-card space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip label={labelOf(LEAD_STATUSES, lead.status)} value={lead.status} />
          <StatusChip label={`${labelOf(LEAD_STATUSES, lead.priority) || lead.priority} priority`} value={lead.priority} />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Mobile" value={lead.mobile} />
          <Info label="Alternate" value={lead.alternate_mobile ?? "—"} />
          <Info label="Budget" value={formatCurrency(lead.budget)} />
          <Info label="Configuration" value={lead.configuration ?? "—"} />
          <Info label="Location" value={lead.location ?? "—"} />
          <Info label="Email" value={lead.email ?? "—"} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button asChild variant="outline" className="h-11">
            <a href={telHref(lead.mobile)}>
              <Phone className="size-4" /> Call
            </a>
          </Button>
          <Button asChild variant="outline" className="h-11">
            <a href={whatsappHref(lead.mobile, `Hi ${lead.customer_name},`)} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" /> Chat
            </a>
          </Button>
          <Button asChild variant="outline" className="h-11" disabled={!lead.location}>
            <a href={mapsHref(lead.location ?? "")} target="_blank" rel="noreferrer">
              <MapPin className="size-4" /> Map
            </a>
          </Button>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Update status</Label>
          <Select value={lead.status} onValueChange={changeStatus}>
            <SelectTrigger className="h-11">
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
        </div>
      </div>

      <Tabs defaultValue="notes" className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-3 space-y-3">
          <SectionCard title="Add note">
            <Textarea rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Call summary, requirement, objection…" />
            <Button className="mt-2 h-11 w-full" onClick={addNote} disabled={!note.trim()}>
              Save note
            </Button>
          </SectionCard>
          {(data?.notes ?? []).map((n) => (
            <div key={n.id} className="surface-card p-3.5">
              <p className="text-sm">{n.note}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.created_at)}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="followups" className="mt-3 space-y-3">
          <SectionCard title="Schedule follow-up">
            <div className="space-y-2">
              <Input type="datetime-local" className="h-11" value={followDate} onChange={(e) => setFollowDate(e.target.value)} />
              <Input maxLength={300} value={followNote} onChange={(e) => setFollowNote(e.target.value)} placeholder="What to discuss" className="h-11" />
              <Button className="h-11 w-full" onClick={addFollowUp}>
                Schedule
              </Button>
            </div>
          </SectionCard>
          {(data?.follows ?? []).map((f) => (
            <div key={f.id} className="surface-card space-y-2 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{formatDateTime(f.due_at)}</p>
                <StatusChip label={labelOf(FOLLOWUP_STATUSES, f.status)} value={f.status} />
              </div>
              {f.notes ? <p className="text-sm text-muted-foreground">{f.notes}</p> : null}
              {f.status === "pending" ? (
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => completeFollowUp(f.id, "completed")}>
                    Mark done
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => completeFollowUp(f.id, "missed")}>
                    Missed
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="visits" className="mt-3 space-y-3">
          <SectionCard title="Schedule site visit">
            <div className="space-y-2">
              <Input type="datetime-local" className="h-11" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
              <Input maxLength={120} className="h-11" value={visitProject} onChange={(e) => setVisitProject(e.target.value)} placeholder="Project name" />
              <Input maxLength={160} className="h-11" value={visitLocation} onChange={(e) => setVisitLocation(e.target.value)} placeholder="Location" />
              <Button className="h-11 w-full" onClick={addVisit}>
                Schedule visit
              </Button>
            </div>
          </SectionCard>
          {(data?.visits ?? []).map((v) => (
            <div key={v.id} className="surface-card space-y-2 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{formatDateTime(v.visit_at)}</p>
                <StatusChip label={labelOf(VISIT_STATUSES, v.status)} value={v.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {v.project_name ?? "Project TBD"}
                {v.location ? ` · ${v.location}` : ""}
              </p>
              <Select value={v.status} onValueChange={(s) => setVisitStatus(v.id, s as VisitStatus)}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VISIT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="timeline" className="mt-3 space-y-3">
          {(data?.bookings ?? []).length > 0 ? (
            <SectionCard title="Booking">
              {data!.bookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-1.5 text-sm">
                  <span>
                    {b.project_name ?? "Booking"} · {formatDate(b.booking_date)}
                  </span>
                  <span className="font-semibold">{formatCurrency(b.booking_amount)}</span>
                </div>
              ))}
              <Link to="/bookings" className="text-xs font-semibold text-primary">
                Manage bookings
              </Link>
            </SectionCard>
          ) : null}
          <SectionCard title="Activity">
            {(data?.logs ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
            ) : (
              <ul className="space-y-2.5">
                {data!.logs.map((l) => (
                  <li key={l.id} className="flex gap-3">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{l.action}</p>
                      {l.detail ? <p className="text-xs text-muted-foreground">{l.detail}</p> : null}
                      <p className="text-[11px] text-muted-foreground">{formatDateTime(l.created_at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="truncate font-medium">{value}</p>
    </div>
  );
}
