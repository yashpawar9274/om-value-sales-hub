import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { registerPushToken, showLocalNotification } from "@/lib/push";

export type AppNotification = Database["public"]["Tables"]["notifications"]["Row"];

export function useNotifications() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as AppNotification[];
    },
  });

  // Live updates + browser notification
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          const row = payload.new as AppNotification;
          queryClient.setQueryData<AppNotification[]>(["notifications", userId], (prev) =>
            prev ? [row, ...prev].slice(0, 50) : [row],
          );
          showLocalNotification(row.title, row.body ?? "", row.link);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  // Background push registration (no-op until Firebase keys are set)
  useEffect(() => {
    if (!userId) return;
    void registerPushToken(userId);
  }, [userId]);

  const unread = notifications.filter((n) => !n.is_read).length;

  const markRead = useCallback(
    async (id: string) => {
      queryClient.setQueryData<AppNotification[]>(["notifications", userId], (prev) =>
        (prev ?? []).map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    },
    [queryClient, userId],
  );

  const markAllRead = useCallback(async () => {
    if (!userId) return;
    queryClient.setQueryData<AppNotification[]>(["notifications", userId], (prev) =>
      (prev ?? []).map((n) => ({ ...n, is_read: true })),
    );
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
  }, [queryClient, userId]);

  return { notifications, unread, isLoading, markRead, markAllRead };
}
