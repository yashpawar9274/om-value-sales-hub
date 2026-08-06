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
      const [leads, bookings] = await Promise.all([
        supabase.from("leads").select("*"),
        supabase.from("bookings").select("booking_amount, received_amount, booking_date"),
      ]);
      return { leads: (leads.data ?? []) as Lead[], bookings: bookings.data ?? [] };
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
