import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarCheck, MapPin, Receipt, ShieldCheck, Users } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OM Value Homes CRM — Real Estate Sales Workspace" },
      {
        name: "description",
        content:
          "Internal mobile-first CRM for OM Value Homes: capture leads, never miss a follow-up, schedule site visits and track bookings.",
      },
      { property: "og:title", content: "OM Value Homes CRM — Real Estate Sales Workspace" },
      {
        property: "og:description",
        content: "Leads, follow-ups, site visits, bookings and daily reports in one mobile-first workspace.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Users, title: "Lead management", text: "Capture every enquiry with duplicate detection and full history." },
  { icon: CalendarCheck, title: "Follow-ups", text: "Today, upcoming and overdue — nothing slips through." },
  { icon: MapPin, title: "Site visits", text: "Schedule, navigate and record feedback on the move." },
  { icon: Receipt, title: "Bookings", text: "Units, payments, agreements and documents in one timeline." },
];

function Landing() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="gradient-hero px-6 pb-20 pt-20 text-primary-foreground">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">OM Value Homes</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            The sales CRM built for the field, not the desk.
          </h1>
          <p className="mt-4 max-w-xl text-base opacity-90">
            Every lead, follow-up, site visit and booking in one fast mobile workspace. Call, WhatsApp or navigate in
            two taps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-6 text-base font-semibold"
              onClick={() => navigate({ to: signedIn ? "/dashboard" : "/auth" })}
            >
              {signedIn ? "Open dashboard" : "Sign in to CRM"}
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs opacity-80">
            <ShieldCheck className="size-4" /> Internal use only — access is role controlled.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-10 grid max-w-3xl gap-3 px-4 pb-16 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="surface-card p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <f.icon className="size-5" />
            </span>
            <h2 className="mt-3 text-sm font-bold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        OM Value Homes CRM · <Link to="/auth">Team sign in</Link>
      </footer>
    </div>
  );
}
