import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { SectionCard } from "@/components/crm-ui";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ROLES, labelOf } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — OM Value Homes CRM" },
      { name: "description", content: "Your profile, team members and account controls." },
      { property: "og:title", content: "Settings — OM Value Homes CRM" },
      { property: "og:description", content: "Your profile, team members and account controls." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile, role, isManager } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: team = [] } = useQuery({
    queryKey: ["team-settings"],
    enabled: isManager,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, email, phone").order("full_name");
      return data ?? [];
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell title="Settings" subtitle="Profile and team">
      <div className="space-y-4">
        <SectionCard title="Your profile">
          <dl className="space-y-2 text-sm">
            <Row label="Name" value={profile?.full_name || "—"} />
            <Row label="Email" value={profile?.email || "—"} />
            <Row label="Phone" value={profile?.phone || "—"} />
            <Row label="Role" value={role ? labelOf(ROLES, role) : "—"} />
          </dl>
        </SectionCard>

        {isManager ? (
          <SectionCard title="Team">
            {team.length === 0 ? (
              <p className="text-sm text-muted-foreground">No team members yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {team.map((t) => (
                  <li key={t.id} className="py-2.5">
                    <p className="text-sm font-semibold">{t.full_name || t.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.email}
                      {t.phone ? ` · ${t.phone}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        ) : null}

        <Button variant="outline" className="h-12 w-full" onClick={signOut}>
          <LogOut className="size-4" /> Sign out
        </Button>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  );
}
