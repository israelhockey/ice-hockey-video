import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SITE_NAME } from "@/lib/site";

const NAV = [
  { to: "/games", label: "Games" },
  { to: "/request", label: "Request a breakdown" },
  { to: "/feedback", label: "Feedback" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden
              >
                <circle cx="12" cy="12" r="8" />
                <path d="M12 4v16" />
              </svg>
            </span>
            <span className="font-display text-xl font-semibold uppercase">{SITE_NAME}</span>
            <span className="rounded-full border border-primary/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              Beta
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "bg-accent text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-6 text-xs text-muted-foreground">
          <span>
            {SITE_NAME} · private beta. Results are AI-made and still being improved: tell us what's
            wrong.
          </span>
          <Link to="/feedback" className="hover:text-foreground">
            Send feedback
          </Link>
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{kicker}</p>
      <h1 className="font-display mt-2 text-4xl font-bold uppercase sm:text-5xl">{title}</h1>
      {children && <div className="mt-3 max-w-2xl text-muted-foreground">{children}</div>}
    </div>
  );
}
