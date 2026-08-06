import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Phone } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { EmptyState, StatusChip } from "@/components/crm-ui";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { FOLLOWUP_STATUSES, endOfToday, formatDateTime, labelOf, startOfToday, telHref } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/followups")({
  head: () => ({
    meta: [
      { title: "Follow-ups — OM Value Homes CRM" },
      { name: "description", content: "Track today's, upcoming and missed customer follow-ups." },
      { property: "og:title", content: "Follow-ups — OM Value Homes CRM" },
      { property: "og:description", content: "Track today's, upcoming and missed customer follow-ups." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FollowUpsPage,
});

function FollowUpsPage() {
  const [tab, setTab] = useState("today");
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["followups"],
    queryFn: async () => {
      const { data } = await supabase
        .from("follow_ups")
        .select("id, due_at, status, notes, lead_id, leads(customer_name, mobile)")
        .order("due_at", { ascending: true });
      return data ?? [];
    },
  });

  const from = startOfToday().toISOString();
  const to = endOfToday().toISOString();
  const filtered = data.filter((f) => {
    if (tab === "today") return f.status === "pending" && f.due_at >= from && f.due_at <= to;
    if (tab === "upcoming") return f.status === "pending" && f.due_at > to;
    if (tab === "missed") return f.status === "missed" || (f.status === "pending" && f.due_at < from);
    return f.status === "completed";
  });

  async function complete(id: string) {
    const { error } = await supabase
      .from("follow_ups")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Marked done");
    queryClient.invalidateQueries();
  }

  return (
    <AppShell title="Follow-ups" subtitle={`${filtered.length} in view`}>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="missed">Missed</TabsTrigger>
          <TabsTrigger value="completed">Done</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-3 space-y-2.5">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <EmptyState title="Nothing here" description="Follow-ups you schedule from a lead will show up here." />
        ) : (
          filtered.map((f) => {
            const lead = f.leads as { customer_name: string; mobile: string } | null;
            return (
              <div key={f.id} className="surface-card space-y-2 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <Link to="/leads/$leadId" params={{ leadId: f.lead_id }} className="min-w-0">
                    <p className="truncate font-semibold">{lead?.customer_name ?? "Lead"}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(f.due_at)}</p>
                  </Link>
                  <StatusChip label={labelOf(FOLLOWUP_STATUSES, f.status)} value={f.status} />
                </div>
                {f.notes ? <p className="text-sm text-muted-foreground">{f.notes}</p> : null}
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <a href={telHref(lead?.mobile ?? "")}>
                      <Phone className="size-4" /> Call
                    </a>
                  </Button>
                  {f.status === "pending" ? (
                    <Button size="sm" className="flex-1" onClick={() => complete(f.id)}>
                      Mark done
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
