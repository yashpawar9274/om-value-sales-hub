import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarCheck,
  ChevronLeft,
  LayoutDashboard,
  MapPin,
  FileText,
  Receipt,
  Settings,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { NotificationBell } from "@/components/NotificationBell";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { cn } from "@/lib/utils";


const NAV = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/followups", label: "Follow-up", icon: CalendarCheck },
  { to: "/visits", label: "Visits", icon: MapPin },
  { to: "/settings", label: "More", icon: Settings },
] as const;

const DESKTOP_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/followups", label: "Follow-ups", icon: CalendarCheck },
  { to: "/visits", label: "Site Visits", icon: MapPin },
  { to: "/bookings", label: "Bookings", icon: Receipt },
  { to: "/forms", label: "Enquiry Forms", icon: FileText },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  title,
  subtitle,
  action,
  back,
  children,
}: {
  title: string;
  subtitle?: string | undefined;
  action?: ReactNode;
  back?: "/dashboard" | "/leads" | "/followups" | "/visits" | "/bookings" | "/forms" | "/reports" | "/settings" | undefined;
  children: ReactNode;
}) {

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <aside className="no-print fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-sidebar px-3 py-5 lg:flex">
        <div className="px-3 pb-6">
          <p className="text-sm font-bold tracking-tight text-sidebar-foreground">OM Value Homes</p>
          <p className="text-xs text-muted-foreground">Sales CRM</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {DESKTOP_NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-60">
        <header className="no-print sticky top-0 z-30 gradient-hero px-4 pb-5 pt-6 text-primary-foreground shadow-[var(--shadow-card)]">
          <div className="mx-auto flex max-w-4xl items-start justify-between gap-3">
            <div>
              {back ? (
                <Link to={back} className="mb-1 inline-flex items-center gap-1 text-xs font-semibold opacity-85">
                  <ChevronLeft className="size-3.5" /> Back
                </Link>
              ) : null}
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              {subtitle ? <p className="mt-0.5 text-sm opacity-85">{subtitle}</p> : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {action}
              <NotificationBell />
            </div>

          </div>

        </header>

        <main className="mx-auto max-w-4xl px-4 pb-28 pt-4 lg:pb-10">{children}</main>
      </div>

      <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl transition-colors",
                    active && "bg-primary-soft",
                  )}
                >
                  <item.icon className="size-5" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <VoiceAssistant />
    </div>
  );
}
