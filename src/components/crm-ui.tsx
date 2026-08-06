import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { toneClassFor } from "@/lib/crm";

export function StatusChip({ label, value, className }: { label: string; value?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        toneClassFor(value ?? label.toLowerCase()),
        className,
      )}
    >
      {label}
    </span>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="surface-card flex flex-col items-center gap-2 px-6 py-12 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description ? <p className="max-w-xs text-sm text-muted-foreground">{description}</p> : null}
      {action}
    </div>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-card p-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold tracking-tight text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatTile({
  label,
  value,
  hint,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "info";
}) {
  const toneMap = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
    info: "text-info",
  } as const;
  return (
    <div className="surface-card px-3 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold tabular-nums", toneMap[tone])}>{value}</p>
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
