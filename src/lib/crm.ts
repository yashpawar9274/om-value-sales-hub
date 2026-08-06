import type { Database } from "@/integrations/supabase/types";

export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type LeadSource = Database["public"]["Enums"]["lead_source"];
export type LeadPriority = Database["public"]["Enums"]["lead_priority"];
export type FollowUpStatus = Database["public"]["Enums"]["followup_status"];
export type VisitStatus = Database["public"]["Enums"]["visit_status"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type AppRole = Database["public"]["Enums"]["app_role"];

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type FollowUp = Database["public"]["Tables"]["follow_ups"]["Row"];
export type SiteVisit = Database["public"]["Tables"]["site_visits"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "follow_up", label: "Follow-up" },
  { value: "site_visit_scheduled", label: "Site Visit Scheduled" },
  { value: "visited", label: "Visited" },
  { value: "negotiation", label: "Negotiation" },
  { value: "booked", label: "Booked" },
  { value: "lost", label: "Lost" },
  { value: "hold", label: "Hold" },
];

export const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "google", label: "Google" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "walk_in", label: "Walk-in" },
  { value: "reference", label: "Reference" },
  { value: "property_portal", label: "Property Portal" },
  { value: "others", label: "Others" },
];

export const LEAD_PRIORITIES: { value: LeadPriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const FOLLOWUP_STATUSES: { value: FollowUpStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "missed", label: "Missed" },
  { value: "rescheduled", label: "Rescheduled" },
];

export const VISIT_STATUSES: { value: VisitStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No Show" },
];

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "partial", label: "Partial" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const ROLES: { value: AppRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Sales Manager" },
  { value: "executive", label: "Sales Executive" },
];

export function labelOf<T extends string>(
  list: { value: T; label: string }[],
  value: T | null | undefined,
): string {
  return list.find((item) => item.value === value)?.label ?? "—";
}

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "primary";

export const STATUS_TONE: Record<string, Tone> = {
  new: "info",
  contacted: "neutral",
  interested: "primary",
  follow_up: "warning",
  site_visit_scheduled: "primary",
  visited: "info",
  negotiation: "warning",
  booked: "success",
  lost: "danger",
  hold: "neutral",
  pending: "warning",
  completed: "success",
  missed: "danger",
  rescheduled: "info",
  scheduled: "info",
  cancelled: "danger",
  no_show: "danger",
  partial: "warning",
  high: "danger",
  medium: "warning",
  low: "neutral",
};

export const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info/12 text-info",
  success: "bg-success/14 text-success",
  warning: "bg-warning/18 text-warning",
  danger: "bg-destructive/12 text-destructive",
  primary: "bg-primary/12 text-primary",
};

export function toneClassFor(value: string | null | undefined) {
  return TONE_CLASS[STATUS_TONE[value ?? ""] ?? "neutral"];
}

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

export function sanitizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export function telHref(phone: string) {
  return `tel:${sanitizePhone(phone)}`;
}

export function whatsappHref(phone: string, message?: string) {
  const digits = sanitizePhone(phone).replace(/^\+/, "");
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${withCountry}${text}`;
}

export function mapsHref(location: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]!);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
