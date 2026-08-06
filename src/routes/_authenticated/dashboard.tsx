import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, Plus, MessageCircle } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { EmptyState, SectionCard, StatTile, StatusChip } from "@/components/crm-ui";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  LEAD_STATUSES,
  endOfToday,
  formatDateTime,
  labelOf,
  startOfToday,
  telHref,
  whatsappHref,
} from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — OM Value Homes CRM" },
      { name: "description", content: "Today's leads, follow-ups, site visits and bookings at a glance." },
      { property: "og:title", content: "Dashboard — OM Value Homes CRM" },
      { property: "og:description", content: "Today's leads, follow-ups, site visits and bookings at a glance." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { profile } = useAuth();
  const from = startOfToday().toISOString();
  const to = endOfToday().toISOString();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [leads, followups, visits, bookings, activity] = await Promise.all([
        supabase.from("leads").select("id, customer_name, mobile, status, priority, created_at").order("created_at", { ascending: false }),
        supabase
          .from("follow_ups")
          .select("id, due_at, status, notes, lead_id, leads(customer_name, mobile)")
          .order("due_at", { ascending: true }),
        supabase.from("site_visits").select("id, visit_at, status, lead_id, leads(customer_name)").order("visit_at"),
        supabase.from("bookings").select("id, booking_amount, booking_date, payment_status, leads(customer_name)"),
        supabase.from("activity_logs").select("id, action, detail, created_at").order("created_at", { ascending: false }).limit(8),
      ]);
      return {
        leads: leads.data ?? [],
        followups: followups.data ?? [],
        visits: visits.data ?? [],
        bookings: bookings.data ?? [],
        activity: activity.data ?? [],
      };
    },
  });

  const leads = data?.leads ?? [];
  const followups = data?.followups ?? [];
  const todayLeads = leads.filter((l) => l.created_at >= from && l.created_at <= to);
  const activeLeads = leads.filter((l) => !["booked", "lost"].includes(l.status));
  const todayFollowups = followups.filter((f) => f.status === "pending" && f.due_at >= from && f.due_at <= to);
  const missedFollowups = followups.filter((f) => f.status === "pending" && f.due_at < from);
  const todayVisits = (data?.visits ?? []).filter((v) => v.visit_at >= from && v.visit_at <= to);
  const bookings = data?.bookings ?? [];
  const conversion = leads.length ? Math.round((leads.filter((l) => l.status === "booked").length / leads.length) * 100) : 0;

  return (
    <AppShell
      title={`Hello${profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}`}
      subtitle={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
      action={
        <Button asChild size="sm" variant="secondary" className="font-semibold">
          <Link to="/leads/new">
            <Plus className="size-4" /> Lead
          </Link>
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total leads" value={leads.length} />
        <StatTile label="Today's leads" value={todayLeads.length} tone="info" />
        <StatTile label="Active leads" value={activeLeads.length} tone="info" />
        <StatTile label="Conversion" value={`${conversion}%`} tone="success" />
        <StatTile label="Today follow-ups" value={todayFollowups.length} tone="warning" />
        <StatTile label="Missed follow-ups" value={missedFollowups.length} tone="danger" />
        <StatTile label="Today's visits" value={todayVisits.length} tone="primary" />
        <StatTile label="Bookings" value={bookings.length} tone="success" />
      </div>

      <div className="mt-4 space-y-4">
        <SectionCard
          title="Today's follow-ups"
          action={
            <Link to="/followups" className="text-xs font-semibold text-primary">
              View all
            </Link>
          }
        >
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : todayFollowups.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing due today. Well played.</p>
          ) : (
            <ul className="divide-y divide-border">
              {todayFollowups.slice(0, 5).map((f) => {
                const lead = f.leads as { customer_name: string; mobile: string } | null;
                return (
                  <li key={f.id} className="flex items-center justify-between gap-2 py-2.5">
                    <Link to="/leads/$leadId" params={{ leadId: f.lead_id }} className="min-w-0">
                      <p className="truncate text-sm font-semibold">{lead?.customer_name ?? "Lead"}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(f.due_at)}</p>
                    </Link>
                    <div className="flex shrink-0 gap-1.5">
                      <Button asChild size="icon" variant="outline" className="size-9">
                        <a href={telHref(lead?.mobile ?? "")} aria-label="Call">
                          <Phone className="size-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="size-9">
                        <a href={whatsappHref(lead?.mobile ?? "")} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                          <MessageCircle className="size-4" />
                        </a>
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Recent leads"
          action={
            <Link to="/leads" className="text-xs font-semibold text-primary">
              View all
            </Link>
          }
        >
          {leads.length === 0 ? (
            <EmptyState
              title="No leads yet"
              description="Add your first enquiry to get started."
              action={
                <Button asChild size="sm" className="mt-2">
                  <Link to="/leads/new">Add lead</Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {leads.slice(0, 5).map((l) => (
                <li key={l.id}>
                  <Link to="/leads/$leadId" params={{ leadId: l.id }} className="flex items-center justify-between gap-2 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{l.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{l.mobile}</p>
                    </div>
                    <StatusChip label={labelOf(LEAD_STATUSES, l.status)} value={l.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent activity">
          {(data?.activity ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Activity will appear here as your team works.</p>
          ) : (
            <ul className="space-y-2.5">
              {data!.activity.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{a.action}</p>
                    {a.detail ? <p className="text-xs text-muted-foreground">{a.detail}</p> : null}
                    <p className="text-[11px] text-muted-foreground">{formatDateTime(a.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
