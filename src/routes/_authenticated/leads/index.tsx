import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download, Phone, Plus, Search } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { EmptyState, StatusChip } from "@/components/crm-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  downloadCsv,
  formatCurrency,
  formatDate,
  labelOf,
  telHref,
  type Lead,
} from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/leads/")({
  head: () => ({
    meta: [
      { title: "Leads — OM Value Homes CRM" },
      { name: "description", content: "Search, filter and manage every property enquiry in one place." },
      { property: "og:title", content: "Leads — OM Value Homes CRM" },
      { property: "og:description", content: "Search, filter and manage every property enquiry in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LeadsPage,
});

function LeadsPage() {
  const { isManager } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [priority, setPriority] = useState("all");
  const [staff, setStaff] = useState("all");

  const { data: team = [] } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
      return data ?? [];
    },
  });

  const nameOf = (id: string | null) => {
    if (!id) return "Unassigned";
    const p = team.find((t) => t.id === id);
    return p?.full_name || p?.email || "Team member";
  };

  const staffOptions = team.map((t) => ({ value: t.id, label: t.full_name || t.email || "Team member" }));

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (source !== "all" && l.source !== source) return false;
      if (priority !== "all" && l.priority !== priority) return false;
      if (staff !== "all" && l.created_by !== staff && l.assigned_to !== staff) return false;
      if (!q) return true;
      return (
        l.customer_name.toLowerCase().includes(q) ||
        l.mobile.includes(q) ||
        (l.location ?? "").toLowerCase().includes(q) ||
        (l.configuration ?? "").toLowerCase().includes(q)
      );
    });
  }, [leads, search, status, source, priority, staff]);

  function exportCsv() {
    downloadCsv(
      "leads",
      filtered.map((l) => ({
        Name: l.customer_name,
        Mobile: l.mobile,
        Email: l.email ?? "",
        Budget: l.budget ?? "",
        Configuration: l.configuration ?? "",
        Source: labelOf(LEAD_SOURCES, l.source),
        Status: labelOf(LEAD_STATUSES, l.status),
        Priority: labelOf(LEAD_PRIORITIES, l.priority),
        Location: l.location ?? "",
        "Added by": nameOf(l.created_by),
        "Assigned to": nameOf(l.assigned_to),
        Created: formatDate(l.created_at),
      })),
    );
  }

  return (
    <AppShell
      title="Leads"
      subtitle={`${filtered.length} of ${leads.length} leads`}
      action={
        <Button asChild size="sm" variant="secondary" className="font-semibold">
          <Link to="/leads/new">
            <Plus className="size-4" /> New
          </Link>
        </Button>
      }
    >
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, mobile, area…"
            className="h-11 pl-9"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <FilterSelect value={status} onChange={setStatus} placeholder="Status" options={LEAD_STATUSES} />
          <FilterSelect value={source} onChange={setSource} placeholder="Source" options={LEAD_SOURCES} />
          <FilterSelect value={priority} onChange={setPriority} placeholder="Priority" options={LEAD_PRIORITIES} />
        </div>
        {isManager && staffOptions.length > 0 ? (
          <FilterSelect value={staff} onChange={setStaff} placeholder="Staff" options={staffOptions} />
        ) : null}
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="size-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="mt-2 space-y-2.5">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading leads…</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={leads.length === 0 ? "No leads yet" : "No matching leads"}
            description={leads.length === 0 ? "Capture your first enquiry to get moving." : "Try clearing a filter or two."}
            action={
              leads.length === 0 ? (
                <Button asChild size="sm" className="mt-2">
                  <Link to="/leads/new">Add lead</Link>
                </Button>
              ) : null
            }
          />
        ) : (
          filtered.map((l) => (
            <div key={l.id} className="surface-card flex items-center gap-3 p-3.5">
              <Link to="/leads/$leadId" params={{ leadId: l.id }} className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{l.customer_name}</p>
                  <StatusChip label={labelOf(LEAD_STATUSES, l.status)} value={l.status} />
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {l.mobile}
                  {l.configuration ? ` · ${l.configuration}` : ""}
                  {l.budget ? ` · ${formatCurrency(l.budget)}` : ""}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {labelOf(LEAD_SOURCES, l.source)} · {formatDate(l.created_at)}
                </p>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                  Added by {nameOf(l.created_by)} · Assigned to {nameOf(l.assigned_to)}
                </p>
              </Link>
              <Button asChild size="icon" variant="outline" className="size-10 shrink-0">
                <a href={telHref(l.mobile)} aria-label={`Call ${l.customer_name}`}>
                  <Phone className="size-4" />
                </a>
              </Button>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: readonly { value: string; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 text-xs">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {placeholder.toLowerCase()}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
