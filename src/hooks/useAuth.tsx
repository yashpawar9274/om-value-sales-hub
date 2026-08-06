import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { AppRole, Profile } from "@/lib/crm";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  profile: Profile | null;
  role: AppRole | null;
  isManager: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  profile: null,
  role: null,
  isManager: false,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id ?? null;

  const { data } = useQuery({
    queryKey: ["me", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [profileRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId!).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId!),
      ]);
      const roles = (rolesRes.data ?? []).map((r) => r.role as AppRole);
      const role: AppRole | null = roles.includes("admin")
        ? "admin"
        : roles.includes("manager")
          ? "manager"
          : roles.includes("executive")
            ? "executive"
            : null;
      return { profile: (profileRes.data as Profile | null) ?? null, role };
    },
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      profile: data?.profile ?? null,
      role: data?.role ?? null,
      isManager: data?.role === "admin" || data?.role === "manager",
      isAdmin: data?.role === "admin",
    }),
    [session, loading, data],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
