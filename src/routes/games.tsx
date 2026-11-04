import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader, SiteShell } from "@/components/site-shell";
import { GAMES, SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/games")({
  head: () => ({ meta: [{ title: `Games · ${SITE_NAME}` }] }),
  component: Games,
});

function Games() {
  return (
    <SiteShell>
      <PageHeader kicker="Game library" title="Finished film rooms">
        Each period opens in its own film room: video with every player boxed and named, stats, shot
        map, shift chart and the tagged plays.
      </PageHeader>
      <div className="mx-auto max-w-6xl space-y-6 px-4 pb-16">
        {GAMES.map((g) => (
          <article key={g.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{g.league}</p>
                <h2 className="font-display mt-1 flex flex-wrap items-center gap-2 text-3xl font-bold uppercase">
                  <Team {...g.home} />
                  <span className="text-muted-foreground">vs</span>
                  <Team {...g.away} />
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{g.note}</p>
              </div>
              {g.library && (
                <a
                  href={g.library}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Whole game ↗
                </a>
              )}
            </div>
            <ul className="grid gap-px bg-border sm:grid-cols-3">
              {g.rooms.map((r) => (
                <li key={r.label} className="bg-card">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-full p-5 transition-colors hover:bg-accent"
                  >
                    <span className="font-display text-xl font-semibold uppercase">
                      {r.label} ↗
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-muted-foreground">Want your own game in here?</p>
          <Link
            to="/request"
            className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Request a breakdown
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}

function Team({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-3 rounded-sm" style={{ background: color }} />
      {name}
    </span>
  );
}
