import { useNavigate } from "@tanstack/react-router";
import { Bell, BellRing, CheckCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { ensureNotificationPermission } from "@/lib/push";
import { cn } from "@/lib/utils";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function NotificationBell() {
  const { notifications, unread, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) void ensureNotificationPermission();
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={unread > 0 ? `${unread} unread notifications` : "Notifications"}
          className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground transition-colors hover:bg-primary-foreground/25"
        >
          {unread > 0 ? <BellRing className="size-5" /> : <Bell className="size-5" />}
          {unread > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-destructive-foreground">
              {unread > 99 ? "99+" : unread}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={10} className="w-[min(22rem,calc(100vw-1.5rem))] p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">{unread > 0 ? `${unread} unread` : "You're all caught up"}</p>
          </div>
          {unread > 0 ? (
            <Button size="sm" variant="ghost" className="h-8 px-2 text-xs" onClick={() => void markAllRead()}>
              <CheckCheck className="size-3.5" /> Mark all
            </Button>
          ) : null}
        </div>

        <ScrollArea className="max-h-[22rem]">
          {notifications.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (!n.is_read) void markRead(n.id);
                      setOpen(false);
                      if (n.link) void navigate({ to: n.link });
                    }}
                    className={cn(
                      "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/60",
                      !n.is_read && "bg-primary/5",
                    )}
                  >
                    <span
                      className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.is_read ? "bg-transparent" : "bg-primary")}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{n.title}</span>
                      {n.body ? (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{n.body}</span>
                      ) : null}
                      <span className="mt-1 block text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
