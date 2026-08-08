import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, ExternalLink, Plus, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { EmptyState, SectionCard } from "@/components/crm-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, whatsappHref } from "@/lib/crm";

type FieldType = "text" | "tel" | "email" | "number" | "textarea" | "select";
type BuilderField = { id: string; label: string; type: FieldType; required: boolean; options?: string[] };

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Short text" },
  { value: "textarea", label: "Long text" },
  { value: "tel", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "select", label: "Dropdown" },
];

const DEFAULT_FIELDS: BuilderField[] = [
  { id: "f1", label: "Budget", type: "text", required: false },
  { id: "f2", label: "Configuration", type: "select", required: false, options: ["1 BHK", "2 BHK", "3 BHK", "Plot", "Shop"] },
  { id: "f3", label: "Preferred location", type: "text", required: false },
  { id: "f4", label: "Message", type: "textarea", required: false },
];

export const Route = createFileRoute("/_authenticated/forms")({
  head: () => ({
    meta: [
      { title: "Enquiry forms — OM Value Homes CRM" },
      { name: "description", content: "Build enquiry forms, share the public link and collect leads automatically." },
      { property: "og:title", content: "Enquiry forms — OM Value Homes CRM" },
      { property: "og:description", content: "Build enquiry forms, share the public link and collect leads automatically." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FormsPage,
});

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${base || "enquiry"}-${Math.random().toString(36).slice(2, 7)}`;
}

function FormsPage() {
  const { user, isManager } = useAuth();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<BuilderField[]>(DEFAULT_FIELDS);
  const [saving, setSaving] = useState(false);

  const { data: forms = [], isLoading } = useQuery({
    queryKey: ["enquiry-forms"],
    queryFn: async () => {
      const { data } = await supabase
        .from("enquiry_forms")
        .select("id, title, description, slug, fields, is_active, created_at")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ["enquiry-submissions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("enquiry_submissions")
        .select("id, form_id, customer_name, mobile, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const origin = typeof window === "undefined" ? "" : window.location.origin;

  async function createForm() {
    if (!user) return;
    if (title.trim().length < 3) {
      toast.error("Form ka title daaliye");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("enquiry_forms").insert({
      title: title.trim(),
      description: description.trim() || null,
      slug: slugify(title),
      fields: fields.filter((f) => f.label.trim().length > 0),
      created_by: user.id,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Form created");
    setTitle("");
    setDescription("");
    setFields(DEFAULT_FIELDS);
    setCreating(false);
    await queryClient.invalidateQueries({ queryKey: ["enquiry-forms"] });
  }

  async function toggleActive(id: string, next: boolean) {
    const { error } = await supabase.from("enquiry_forms").update({ is_active: next }).eq("id", id);
    if (error) return toast.error(error.message);
    await queryClient.invalidateQueries({ queryKey: ["enquiry-forms"] });
  }

  async function remove(id: string) {
    const { error } = await supabase.from("enquiry_forms").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Form deleted");
    await queryClient.invalidateQueries({ queryKey: ["enquiry-forms"] });
  }

  if (!isManager) {
    return (
      <AppShell title="Enquiry forms" subtitle="Admin only">
        <EmptyState title="Not available" description="Only admins and managers can manage enquiry forms." />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Enquiry forms"
      subtitle="Form banaiye, link share kijiye — leads apne aap aayenge"
      action={
        <Button size="sm" variant="secondary" className="font-semibold" onClick={() => setCreating((v) => !v)}>
          <Plus className="size-4" /> {creating ? "Close" : "Form"}
        </Button>
      }
    >
      <div className="space-y-4">
        {creating ? (
          <SectionCard title="New enquiry form">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Title</Label>
                <Input className="h-11" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Site enquiry form" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Description</Label>
                <Textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  Fields (name aur mobile hamesha included hain)
                </p>
                {fields.map((field, index) => (
                  <div key={field.id} className="grid gap-2 rounded-xl border border-border p-2.5 sm:grid-cols-[1fr_9rem_auto]">
                    <Input
                      className="h-10"
                      value={field.label}
                      placeholder="Field label"
                      onChange={(e) => {
                        const next = [...fields];
                        next[index] = { ...field, label: e.target.value };
                        setFields(next);
                      }}
                    />
                    <Select
                      value={field.type}
                      onValueChange={(v) => {
                        const next = [...fields];
                        next[index] = { ...field, type: v as FieldType };
                        setFields(next);
                      }}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) => {
                          const next = [...fields];
                          next[index] = { ...field, required: checked };
                          setFields(next);
                        }}
                      />
                      <span className="text-xs text-muted-foreground">Req.</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-9"
                        onClick={() => setFields(fields.filter((f) => f.id !== field.id))}
                        aria-label="Remove field"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    {field.type === "select" ? (
                      <Input
                        className="h-10 sm:col-span-3"
                        placeholder="Options, comma separated"
                        value={(field.options ?? []).join(", ")}
                        onChange={(e) => {
                          const next = [...fields];
                          next[index] = {
                            ...field,
                            options: e.target.value.split(",").map((o) => o.trim()).filter(Boolean),
                          };
                          setFields(next);
                        }}
                      />
                    ) : null}
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setFields([...fields, { id: `f${Date.now()}`, label: "", type: "text", required: false }])
                  }
                >
                  <Plus className="size-4" /> Add field
                </Button>
              </div>

              <Button className="h-11 w-full" disabled={saving} onClick={createForm}>
                {saving ? "Saving…" : "Create form"}
              </Button>
            </div>
          </SectionCard>
        ) : null}

        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : forms.length === 0 ? (
          <EmptyState title="No enquiry forms yet" description="Builder ka purana form yahan add kijiye aur team ko share kijiye." />
        ) : (
          forms.map((form) => {
            const link = `${origin}/enquiry/${form.slug}`;
            const count = submissions.filter((s) => s.form_id === form.id).length;
            return (
              <SectionCard key={form.id} title={form.title}>
                <div className="space-y-3">
                  {form.description ? <p className="text-sm text-muted-foreground">{form.description}</p> : null}
                  <p className="text-xs text-muted-foreground">
                    Created {formatDate(form.created_at)} · {count} recent submissions
                  </p>
                  <p className="truncate rounded-lg bg-muted px-3 py-2 text-xs">{link}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await navigator.clipboard.writeText(link);
                        toast.success("Link copied");
                      }}
                    >
                      <Copy className="size-4" /> Copy
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={whatsappHref("", `${form.title}: ${link}`)} target="_blank" rel="noreferrer">
                        <Share2 className="size-4" /> Share
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={link} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-4" /> Open
                      </a>
                    </Button>
                    <div className="ml-auto flex items-center gap-2">
                      <Switch checked={form.is_active} onCheckedChange={(v) => toggleActive(form.id, v)} />
                      <span className="text-xs text-muted-foreground">{form.is_active ? "Active" : "Off"}</span>
                      <Button size="icon" variant="ghost" className="size-9" onClick={() => remove(form.id)} aria-label="Delete form">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </SectionCard>
            );
          })
        )}

        {submissions.length > 0 ? (
          <SectionCard title="Recent submissions">
            <ul className="divide-y divide-border">
              {submissions.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-2 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{s.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{s.mobile}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(s.created_at)}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        ) : null}
      </div>
    </AppShell>
  );
}
