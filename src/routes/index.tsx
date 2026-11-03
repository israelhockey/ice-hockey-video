import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ice Hockey Video" },
      { name: "description", content: "Ice Hockey Video — a fresh start." },
      { property: "og:title", content: "Ice Hockey Video" },
      { property: "og:description", content: "Ice Hockey Video — a fresh start." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">Ice Hockey Video</h1>
    </main>
  );
}
