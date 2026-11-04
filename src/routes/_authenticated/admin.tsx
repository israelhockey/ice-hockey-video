import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader, SiteShell } from "@/components/site-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: `Admin · ${SITE_NAME}` }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

type Req = Tables<"breakdown_requests">;
type Fb = Tables<"feedback">;
const STATUSES = ["new", "running", "done"] as const;

export function average(values: (number | null)[]) {
  const v = values.filter((x): x is number => typeof x === "number");
  return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
}

function AdminPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isAdmin = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      return !!data;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { redirect: "/admin" }, replace: true });
  }

  const out = (
    <button onClick={signOut} className="text-sm text-primary hover:underline">
      Sign out
    </button>
  );

  if (isAdmin.isLoading) return <SiteShell><p className="p-8 text-muted-foreground">Loading…</p></SiteShell>;
  if (!isAdmin.data)
    return (
      <SiteShell>
        <PageHeader kicker="Private" title="Not allowed">
          This page is only for the site owner. You're signed in as {user.email}. {out}
        </PageHeader>
      </SiteShell>
    );

  return (
    <SiteShell>
      <PageHeader kicker="Private" title="Admin">
        Signed in as {user.email}. {out}
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Tabs defaultValue="requests">
          <TabsList>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="mt-4">
            <Requests />
          </TabsContent>
          <TabsContent value="feedback" className="mt-4">
            <Feedback />
          </TabsContent>
        </Tabs>
      </div>
    </SiteShell>
  );
}

function Requests() {
  const q = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("breakdown_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  if (q.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (q.error) return <p className="text-destructive">Couldn't load requests.</p>;
  if (!q.data?.length) return <p className="text-muted-foreground">No requests yet.</p>;
  return (
    <div className="space-y-4">
      {q.data.map((r) => (
        <RequestCard key={r.id} r={r} />
      ))}
    </div>
  );
}

function RequestCard({ r }: { r: Req }) {
  const qc = useQueryClient();
  const [link, setLink] = useState(r.filmroom_url ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function update(patch: Partial<Req>) {
    setBusy(true);
    setErr("");
    const { error } = await supabase.from("breakdown_requests").update(patch).eq("id", r.id);
    setBusy(false);
    if (error) return setErr("Couldn't save. Try again.");
    qc.invalidateQueries({ queryKey: ["admin-requests"] });
  }

  async function openRoster() {
    if (!r.roster_file_path) return;
    const { data } = await supabase.storage.from("rosters").createSignedUrl(r.roster_file_path, 300);
    if (data) window.open(data.signedUrl, "_blank");
  }

  const span =
    r.span === "period" ? `Period: ${r.period}` : r.span === "range" ? `${r.range_from} to ${r.range_to}` : "Full game";

  return (
    <article className="rounded-xl border border-border bg-card p-5 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold uppercase">
            {r.home_team} <span className="text-muted-foreground">vs</span> {r.away_team}
          </h3>
          <p className="text-muted-foreground">
            {r.name} · <a className="text-primary hover:underline" href={`mailto:${r.email}`}>{r.email}</a>
            {r.team_org && ` · ${r.team_org}`} · {new Date(r.created_at).toLocaleString()}
          </p>
        </div>
        <select
          value={r.status}
          disabled={busy}
          onChange={(e) => update({ status: e.target.value })}
          className="rounded-md border border-input bg-background px-2 py-1 text-sm capitalize"
          aria-label="Status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        <Row k="Video"><a href={r.video_url} target="_blank" rel="noreferrer" className="break-all text-primary hover:underline">{r.video_url}</a></Row>
        <Row k="Analyse">{span}</Row>
        <Row k="Jerseys">{r.home_color || "?"} / {r.away_color || "?"}</Row>
        {r.goalies && <Row k="Goalies">{r.goalies}</Row>}
      </dl>
      {r.roster_text && (
        <details className="mt-3">
          <summary className="cursor-pointer font-medium">Roster</summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs">{r.roster_text}</pre>
        </details>
      )}
      {r.roster_file_path && (
        <button onClick={openRoster} className="mt-2 text-primary hover:underline">Download roster CSV</button>
      )}
      {r.notes && <p className="mt-3 whitespace-pre-wrap"><span className="font-medium">Notes: </span>{r.notes}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Paste the film room link"
          type="url"
          className="min-w-64 flex-1 rounded-md border border-input bg-background px-3 py-2"
        />
        <button
          disabled={busy || !link.trim()}
          onClick={() => update({ filmroom_url: link.trim(), status: "done" })}
          className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          Mark done
        </button>
      </div>
      {err && <p className="mt-2 text-destructive">{err}</p>}
    </article>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase text-muted-foreground">{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Feedback() {
  const q = useQuery({
    queryKey: ["admin-feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Fb[];
    },
  });
  if (q.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (q.error) return <p className="text-destructive">Couldn't load feedback.</p>;
  const rows = q.data ?? [];
  const avgNames = average(rows.map((r) => r.names_right_1to5));
  const avgUseful = average(rows.map((r) => r.useful_1to5));
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Responses" value={String(rows.length)} />
        <Stat label="Player names right (avg)" value={avgNames == null ? "–" : `${avgNames} / 5`} />
        <Stat label="How useful (avg)" value={avgUseful == null ? "–" : `${avgUseful} / 5`} />
      </div>
      {rows.map((f) => (
        <article key={f.id} className="rounded-xl border border-border bg-card p-5 text-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="font-semibold">
              {f.name || "Anonymous"}
              {f.role && <span className="font-normal text-muted-foreground"> · {f.role}</span>}
              {f.email && <span className="font-normal text-muted-foreground"> · {f.email}</span>}
            </p>
            <span className="text-muted-foreground">{new Date(f.created_at).toLocaleString()}</span>
          </div>
          <p className="mt-1 text-muted-foreground">{f.film_room}</p>
          <p className="mt-2">
            Names right: <b>{f.names_right_1to5 ?? "–"}</b>/5 · Useful: <b>{f.useful_1to5 ?? "–"}</b>/5
          </p>
          {[
            ["What worked", f.what_worked],
            ["Wrong or confusing", f.whats_wrong],
            ["Add", f.what_to_add],
            ["Would pay", f.would_pay],
          ].map(([k, v]) =>
            v ? (
              <p key={k} className="mt-2 whitespace-pre-wrap"><span className="font-medium">{k}: </span>{v}</p>
            ) : null,
          )}
        </article>
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}
