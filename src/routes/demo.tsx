import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteShell } from "@/components/site-shell";
import { DEMO_ROOM, SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: `Film room demo · ${SITE_NAME}` },
      {
        name: "description",
        content:
          "A real game broken down by the AI: every player tracked and named, every shift and event tagged.",
      },
    ],
  }),
  component: Demo,
});

const TIPS = [
  { k: "▶ Demo", d: "Press it under the video for a 3-minute guided tour of every feature." },
  {
    k: "Click a player",
    d: "The film room follows him, even off screen, with his live speed and stats.",
  },
  {
    k: "Stats",
    d: "Switch to Stats at the top for workload, shot map, xG and each player's report.",
  },
  {
    k: "Name the unknowns",
    d: "Players the AI wasn't sure about show as “?”. Name them once and every stat updates.",
  },
];

function Demo() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Live demo</p>
        <h1 className="font-display mt-2 text-4xl font-bold uppercase sm:text-5xl">
          This is what you get after every game
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {DEMO_ROOM.summary} Nothing here was tagged by hand: the AI tracked the players, read the
          jersey numbers, listened to the commentary and tagged the events.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TIPS.map((t) => (
            <li key={t.k} className="rounded-xl border border-border bg-card p-4">
              <p className="font-display text-lg font-semibold uppercase text-primary">{t.k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t.d}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-[1480px] px-2 sm:px-4">
        <div className="overflow-hidden rounded-xl border border-border bg-black">
          <iframe
            src={DEMO_ROOM.src}
            title="Film room demo"
            className="block h-[88vh] min-h-[640px] w-full"
            allow="fullscreen; clipboard-write"
            allowFullScreen
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-3 text-sm text-muted-foreground">
          <span>Works best on a laptop or desktop. On a phone, open it full screen.</span>
          <a
            href={DEMO_ROOM.src}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Open full screen ↗
          </a>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase">
              Want this for your own game?
            </h2>
            <p className="mt-1 text-muted-foreground">
              Send a game link and both rosters. Your film room is usually ready within a day.
            </p>
          </div>
          <Link
            to="/request"
            className="shrink-0 rounded-md bg-primary px-5 py-3 text-center font-semibold text-primary-foreground hover:opacity-90"
          >
            Request a breakdown
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
