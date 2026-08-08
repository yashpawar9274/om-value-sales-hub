import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { EmptyState, StatusChip } from "@/components/crm-ui";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { PAYMENT_STATUSES, formatCurrency, formatDate, labelOf } from "@/lib/crm";


export const Route = createFileRoute("/_authenticated/bookings/")({
  head: () => ({
    meta: [
      { title: "Bookings — OM Value Homes CRM" },
      { name: "description", content: "Confirmed bookings with amounts, payment and agreement status." },
      { property: "og:title", content: "Bookings — OM Value Homes CRM" },
      { property: "og:description", content: "Confirmed bookings with amounts, payment and agreement status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, booking_amount, received_amount, booking_date, payment_status, project_name, unit_number, lead_id, leads(customer_name)")
        .order("booking_date", { ascending: false });
      return data ?? [];
    },
  });

  const total = data.reduce((sum, b) => sum + Number(b.booking_amount ?? 0), 0);

  return (
    <AppShell title="Bookings" subtitle={`${data.length} bookings · ${formatCurrency(total)}`}>
      <div className="space-y-2.5">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : data.length === 0 ? (
          <EmptyState title="No bookings yet" description="Bookings appear here once a lead converts." />
        ) : (
          data.map((b) => {
            const lead = b.leads as { customer_name: string } | null;
            return (
              <Link
                key={b.id}
                to="/leads/$leadId"
                params={{ leadId: b.lead_id }}
                className="surface-card flex items-center justify-between gap-3 p-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold">{lead?.customer_name ?? "Customer"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {b.project_name ?? "Project"}
                    {b.unit_number ? ` · ${b.unit_number}` : ""} · {formatDate(b.booking_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(b.booking_amount)}</p>
                  <StatusChip label={labelOf(PAYMENT_STATUSES, b.payment_status)} value={b.payment_status} />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
