import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/site-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ, GAMES, MORNING_AFTER, SITE_NAME, STEPS } from "@/lib/site";

const HERO_COPY =
  "Send the game after the final horn. By morning you have every shift and every goal clipped, skater workload and fatigue, a shot map, and a report link for each player.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE_NAME} · Hockey film room for coaches and video staff` },
      { name: "description", content: HERO_COPY },
      { property: "og:type", content: "website" },
      { property: "og:title", content: `${SITE_NAME} · Hockey film room for coaches and video staff` },
      { property: "og:description", content: HERO_COPY },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: `${SITE_NAME} · Hockey film room for coaches and video staff` },
      { name: "twitter:description", content: HERO_COPY },
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
            Private beta · for coaches and video staff
          </p>
          <h1 className="font-display mt-3 max-w-4xl text-5xl leading-[0.95] font-bold uppercase sm:text-7xl">
            The morning after the game, <span className="text-primary">already broken down</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{HERO_COPY}</p>
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
              ["≤ 1 day", "film room back in the beta"],
              ["Every shift", "and every goal, clipped"],
              ["1 link", "per player, ready to forward"],
            ].map(([a, b]) => (
              <div key={a}>
                <dt className="font-display text-2xl font-semibold sm:text-3xl">{a}</dt>
                <dd className="text-xs text-muted-foreground sm:text-sm">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl font-bold uppercase">
            What's waiting for you in the morning
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            One breakdown per game, checked by a person before it reaches you.
          </p>
          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {MORNING_AFTER.map((f) => (
              <div key={f.t} className="bg-background p-5">
                <h3 className="font-semibold">{f.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
            <div className="flex flex-col justify-between gap-4 bg-background p-5">
              <p className="text-sm text-muted-foreground">
                Want this for your next game? Send the link and both rosters.
              </p>
              <Link
                to="/request"
                className="self-start rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Send a game
              </Link>
            </div>
          </div>
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
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="font-display text-3xl font-bold uppercase">Questions staff ask us</h2>
          <div className="mt-6 rounded-xl border border-border bg-card px-5">
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((f) => (
                <AccordionItem
                  key={f.q}
                  value={f.q}
                  className="border-border last:border-b-0"
                >
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground sm:text-base">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-3xl font-bold uppercase">Send your next game</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            We need the video link and both rosters with jersey numbers. During the beta every
            breakdown is checked by us before you get it, and we want to know what's wrong, what's
            missing and what you'd use every week.
          </p>
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
      </section>
    </SiteShell>
  );
}
