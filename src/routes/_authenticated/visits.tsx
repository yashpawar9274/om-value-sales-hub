import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { EmptyState, StatusChip } from "@/components/crm-ui";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { VISIT_STATUSES, formatDateTime, labelOf, mapsHref, type VisitStatus } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/visits")({
  head: () => ({
    meta: [
      { title: "Site visits — OM Value Homes CRM" },
      { name: "description", content: "Schedule and track customer site visits and their outcomes." },
      { property: "og:title", content: "Site visits — OM Value Homes CRM" },
      { property: "og:description", content: "Schedule and track customer site visits and their outcomes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VisitsPage,
});

function VisitsPage() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["visits"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_visits")
        .select("id, visit_at, status, project_name, location, lead_id, leads(customer_name)")
        .order("visit_at", { ascending: false });
      return data ?? [];
    },
  });

  async function setStatus(id: string, status: VisitStatus) {
    const { error } = await supabase.from("site_visits").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    queryClient.invalidateQueries();
  }

  return (
    <AppShell title="Site visits" subtitle={`${data.length} scheduled`}>
      <div className="space-y-2.5">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : data.length === 0 ? (
          <EmptyState title="No site visits yet" description="Schedule a visit from any lead's Visits tab." />
        ) : (
          data.map((v) => {
            const lead = v.leads as { customer_name: string } | null;
            return (
              <div key={v.id} className="surface-card space-y-2 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <Link to="/leads/$leadId" params={{ leadId: v.lead_id }} className="min-w-0">
                    <p className="truncate font-semibold">{lead?.customer_name ?? "Lead"}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(v.visit_at)}</p>
                  </Link>
                  <StatusChip label={labelOf(VISIT_STATUSES, v.status)} value={v.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {v.project_name ?? "Project TBD"}
                  {v.location ? ` · ${v.location}` : ""}
                </p>
                <div className="flex gap-2">
                  <Select value={v.status} onValueChange={(s) => setStatus(v.id, s as VisitStatus)}>
                    <SelectTrigger className="h-10 flex-1 text-xs">
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
                  <Button asChild variant="outline" size="sm" disabled={!v.location}>
                    <a href={mapsHref(v.location ?? "")} target="_blank" rel="noreferrer">
                      <MapPin className="size-4" /> Map
                    </a>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
