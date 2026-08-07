import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { SectionCard, StatTile } from "@/components/crm-ui";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LEAD_SOURCES, LEAD_STATUSES, downloadCsv, formatCurrency, formatDate, labelOf, type Lead } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "Reports — OM Value Homes CRM" },
      { name: "description", content: "Lead source performance, pipeline breakdown and booking revenue." },
      { property: "og:title", content: "Reports — OM Value Homes CRM" },
      { property: "og:description", content: "Lead source performance, pipeline breakdown and booking revenue." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { data } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const [leads, bookings, team] = await Promise.all([
        supabase.from("leads").select("*"),
        supabase.from("bookings").select("booking_amount, received_amount, booking_date, created_by"),
        supabase.from("profiles").select("id, full_name, email").order("full_name"),
      ]);
      return { leads: (leads.data ?? []) as Lead[], bookings: bookings.data ?? [], team: team.data ?? [] };
    },
  });

  const leads = data?.leads ?? [];
  const bookings = data?.bookings ?? [];
  const revenue = bookings.reduce((s, b) => s + Number(b.booking_amount ?? 0), 0);
  const received = bookings.reduce((s, b) => s + Number(b.received_amount ?? 0), 0);
  const conversion = leads.length ? Math.round((leads.filter((l) => l.status === "booked").length / leads.length) * 100) : 0;

  const bySource = LEAD_SOURCES.map((s) => ({ ...s, count: leads.filter((l) => l.source === s.value).length })).filter((s) => s.count > 0);
  const byStatus = LEAD_STATUSES.map((s) => ({ ...s, count: leads.filter((l) => l.status === s.value).length })).filter((s) => s.count > 0);
  const max = Math.max(1, ...bySource.map((s) => s.count));

  const team = data?.team ?? [];
  const byStaff = team
    .map((t) => {
      const added = leads.filter((l) => l.created_by === t.id);
      const owned = leads.filter((l) => l.assigned_to === t.id);
      const booked = owned.filter((l) => l.status === "booked").length;
      const value = bookings.filter((b) => b.created_by === t.id).reduce((s, b) => s + Number(b.booking_amount ?? 0), 0);
      return {
        id: t.id,
        name: t.full_name || t.email || "Team member",
        added: added.length,
        owned: owned.length,
        booked,
        conversion: owned.length ? Math.round((booked / owned.length) * 100) : 0,
        value,
      };
    })
    .filter((s) => s.added > 0 || s.owned > 0)
    .sort((a, b) => b.added - a.added);

  return (
    <AppShell
      title="Reports"
      subtitle="Performance overview"
      action={
        <Button
          size="sm"
          variant="secondary"
          className="font-semibold"
          onClick={() =>
            downloadCsv(
              "lead-report",
              leads.map((l) => ({
                Name: l.customer_name,
                Mobile: l.mobile,
                Source: labelOf(LEAD_SOURCES, l.source),
                Status: labelOf(LEAD_STATUSES, l.status),
                Budget: l.budget ?? "",
                Created: formatDate(l.created_at),
              })),
            )
          }
        >
          <Download className="size-4" /> CSV
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total leads" value={leads.length} />
        <StatTile label="Conversion" value={`${conversion}%`} tone="success" />
        <StatTile label="Booking value" value={formatCurrency(revenue)} tone="primary" />
        <StatTile label="Received" value={formatCurrency(received)} tone="info" />
      </div>

      <div className="mt-4 space-y-4">
        <SectionCard title="Leads by source">
          {bySource.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {bySource.map((s) => (
                <li key={s.value}>
                  <div className="flex justify-between text-sm">
                    <span>{s.label}</span>
                    <span className="font-semibold">{s.count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${(s.count / max) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Staff performance"
          action={
            byStaff.length > 0 ? (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs"
                onClick={() =>
                  downloadCsv(
                    "staff-report",
                    byStaff.map((s) => ({
                      Staff: s.name,
                      "Leads added": s.added,
                      "Leads assigned": s.owned,
                      Booked: s.booked,
                      "Conversion %": s.conversion,
                      "Booking value": s.value,
                    })),
                  )
                }
              >
                <Download className="size-3.5" /> CSV
              </Button>
            ) : null
          }
        >
          {byStaff.length === 0 ? (
            <p className="text-sm text-muted-foreground">No staff activity yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {byStaff.map((s) => (
                <li key={s.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold">{s.name}</p>
                    <p className="shrink-0 text-sm font-semibold text-primary">{formatCurrency(s.value)}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.added} added · {s.owned} assigned · {s.booked} booked · {s.conversion}% conversion
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Pipeline by status">
          {byStatus.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {byStatus.map((s) => (
                <li key={s.value} className="flex justify-between py-2 text-sm">
                  <span>{s.label}</span>
                  <span className="font-semibold">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
