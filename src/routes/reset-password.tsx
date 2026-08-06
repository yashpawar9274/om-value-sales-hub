import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset password — OM Value Homes CRM" },
      { name: "description", content: "Set a new password for your OM Value Homes CRM account." },
      { property: "og:title", content: "Reset password — OM Value Homes CRM" },
      { property: "og:description", content: "Set a new password for your OM Value Homes CRM account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="surface-card w-full max-w-sm space-y-4 p-6">
        <div>
          <h1 className="text-lg font-bold">Set a new password</h1>
          <p className="text-sm text-muted-foreground">Choose a password of at least 6 characters.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw">New password</Label>
          <Input id="pw" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pw2">Confirm password</Label>
          <Input id="pw2" type="password" minLength={6} required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" className="h-11 w-full" disabled={loading}>
          {loading ? "Saving…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
