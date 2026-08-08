import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormField = {
  id: string;
  label: string;
  type: "text" | "tel" | "email" | "number" | "textarea" | "select";
  required?: boolean;
  options?: string[];
};

type PublicForm = { title: string; description: string | null; fields: FormField[] };

export const Route = createFileRoute("/enquiry/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Property enquiry — OM Value Homes" },
      { name: "description", content: "Share your requirement and our sales team will call you back shortly." },
      { property: "og:title", content: "Property enquiry — OM Value Homes" },
      { property: "og:description", content: "Share your requirement and our sales team will call you back shortly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PublicEnquiry,
});

function PublicEnquiry() {
  const { slug } = Route.useParams();
  const [form, setForm] = useState<PublicForm | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/public/enquiry/${slug}`)
      .then(async (res) => {
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) setLoadError(json.error ?? "Form not found");
        else setForm(json as PublicForm);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load this form");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function submit() {
    setError(null);
    if (name.trim().length < 2 || mobile.trim().length < 8) {
      setError("Please enter your name and mobile number.");
      return;
    }
    const missing = (form?.fields ?? []).find((f) => f.required && !values[f.label]?.trim());
    if (missing) {
      setError(`Please fill "${missing.label}".`);
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/public/enquiry/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_name: name.trim(), mobile: mobile.trim(), data: values }),
    });
    setSaving(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Could not submit. Please try again.");
      return;
    }
    setDone(true);
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="gradient-hero px-5 pb-8 pt-10 text-primary-foreground">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">OM Value Homes</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{form?.title ?? "Property enquiry"}</h1>
        {form?.description ? <p className="mt-1 text-sm opacity-85">{form.description}</p> : null}
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        {loadError ? (
          <div className="surface-card p-6 text-center">
            <p className="font-semibold">{loadError}</p>
            <p className="mt-1 text-sm text-muted-foreground">Please check the link with our team.</p>
          </div>
        ) : done ? (
          <div className="surface-card p-6 text-center">
            <p className="text-lg font-bold">Thank you!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Our sales team will contact you shortly on {mobile}.
            </p>
          </div>
        ) : !form ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="surface-card space-y-4 p-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Your name *</Label>
              <Input className="h-11" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Mobile number *</Label>
              <Input
                className="h-11"
                type="tel"
                inputMode="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>

            {form.fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">
                  {field.label}
                  {field.required ? " *" : ""}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    rows={3}
                    value={values[field.label] ?? ""}
                    onChange={(e) => setValues({ ...values, [field.label]: e.target.value })}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={values[field.label] ?? ""}
                    onValueChange={(v) => setValues({ ...values, [field.label]: v })}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options ?? []).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    className="h-11"
                    type={field.type}
                    value={values[field.label] ?? ""}
                    onChange={(e) => setValues({ ...values, [field.label]: e.target.value })}
                  />
                )}
              </div>
            ))}

            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

            <Button className="h-12 w-full" disabled={saving} onClick={submit}>
              {saving ? "Submitting…" : "Submit enquiry"}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
