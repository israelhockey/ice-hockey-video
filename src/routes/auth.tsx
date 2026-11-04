import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { Field, TextInput } from "@/components/form-bits";
import { PageHeader, SiteShell } from "@/components/site-shell";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { SITE_NAME } from "@/lib/site";

const safePath = (p: unknown) =>
  typeof p === "string" && p.startsWith("/") && !p.startsWith("//") ? p : "/admin";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: safePath(s.redirect) }),
  head: () => ({
    meta: [
      { title: `Sign in · ${SITE_NAME}` },
      { name: "description", content: "Sign in to Ice Hockey Video." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const go = () => navigate({ to: redirect, replace: true });
    supabase.auth.getUser().then(({ data }) => data.user && go());
    const { data } = supabase.auth.onAuthStateChange((e) => e === "SIGNED_IN" && go());
    return () => data.subscription.unsubscribe();
  }, [navigate, redirect]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const email = String(d.get("email"));
    const password = String(d.get("password"));
    setBusy(true);
    setMsg("");
    const { data, error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}${redirect}` },
          });
    setBusy(false);
    if (error) return setMsg(error.message);
    if (mode === "up" && !data.session) setMsg("Check your email to confirm, then sign in.");
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/auth`,
    });
    if (r.error) setMsg(r.error.message);
  }

  return (
    <SiteShell>
      <PageHeader kicker="Private" title={mode === "in" ? "Sign in" : "Create account"} />
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="max-w-md space-y-4 rounded-xl border border-border bg-card p-5">
          <button
            type="button"
            onClick={google}
            className="w-full rounded-md border border-input px-4 py-2.5 text-sm font-semibold hover:bg-accent"
          >
            Continue with Google
          </button>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Email">
              <TextInput name="email" type="email" required autoComplete="email" />
            </Field>
            <Field label="Password">
              <TextInput name="password" type="password" required minLength={6} />
            </Field>
            {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
            <button
              disabled={busy}
              className="w-full rounded-md bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90"
            >
              {mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="text-sm text-primary hover:underline"
          >
            {mode === "in" ? "No account yet? Create one" : "Have an account? Sign in"}
          </button>
        </div>
      </div>
    </SiteShell>
  );
}
