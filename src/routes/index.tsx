import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/site-shell";
import { FEATURES, GAMES, SITE_NAME, STEPS, TAGLINE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE_NAME} · AI hockey film room` },
      { name: "description", content: TAGLINE },
      { property: "og:title", content: `${SITE_NAME} · AI hockey film room` },
      { property: "og:description", content: TAGLINE },
    ],
  }),
  component: Index,
});

function Index() {
  const demo = GAMES[0];
  return (
    <SiteShell>
      <section className="rink-bg border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Private beta
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-5xl leading-[0.95] font-bold uppercase sm:text-7xl">
            Your game film, <span className="text-primary">broken down by AI</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{TAGLINE}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/request"
              className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Request a game breakdown
            </Link>
            {demo?.rooms[1] && (
              <a
                href={demo.rooms[1].url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border bg-card/60 px-5 py-3 font-semibold transition-colors hover:bg-accent"
              >
                Open a sample film room ↗
              </a>
            )}
          </div>
          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              ["1 link", "YouTube or your file"],
              ["≤ 1 day", "to get your film room"],
              ["2 teams", "tracked and tagged"],
            ].map(([a, b]) => (
              <div key={a}>
                <dt className="font-display text-2xl font-semibold sm:text-3xl">{a}</dt>
                <dd className="text-xs text-muted-foreground sm:text-sm">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl font-bold uppercase">How it works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-xl border border-border bg-card p-5">
              <span className="font-display text-4xl font-bold text-primary">{s.n}</span>
              <h3 className="mt-2 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl font-bold uppercase">What you get</h2>
          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.t} className="bg-background p-5">
                <h3 className="font-semibold">{f.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase">This is a beta</h2>
            <p className="mt-3 text-muted-foreground">
              We're testing with a small group before opening it up. Some players won't be named
              yet: the AI only puts a name on a player when it's sure, and shows a "?" otherwise,
              which you can fix in the film room. Every breakdown is checked by us before you get
              it.
            </p>
            <p className="mt-3 text-muted-foreground">
              What we need from you: watch your film room, and tell us what's wrong, what's missing
              and what you'd use every week.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">Works best with</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                • A broadcast or wide camera that follows the play (LiveBarn-style feeds in testing)
              </li>
              <li>• Both rosters with jersey numbers</li>
              <li>• Clearly different jersey colours</li>
              <li>• Commentary audio, if there is any: it helps name players</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/request"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Send a game
              </Link>
              <Link
                to="/games"
                className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
              >
                See finished games
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
