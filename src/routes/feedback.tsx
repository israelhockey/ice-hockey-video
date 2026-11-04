import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { Choice, Field, Section, Sent, TextArea, TextInput } from "@/components/form-bits";
import { PageHeader, SiteShell } from "@/components/site-shell";
import { copyText, formatFields, openEmail } from "@/lib/send";
import { CONTACT_EMAIL, GAMES, SITE_NAME } from "@/lib/site";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [{ title: `Feedback · ${SITE_NAME}` }] }),
  component: FeedbackPage,
});

const SCALE = ["1", "2", "3", "4", "5"];

function FeedbackPage() {
  const [names, setNames] = useState("");
  const [useful, setUseful] = useState("");
  const [body, setBody] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const rooms = GAMES.flatMap((g) =>
    g.rooms.map((r) => `${g.home.name} vs ${g.away.name} · ${r.label}`),
  );

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const g = (k: string) => String(d.get(k) ?? "");
    const text = formatFields([
      ["Name", g("name")],
      ["Email", g("email")],
      ["Role", g("role")],
      ["Film room", g("room")],
      ["Player names right (1-5)", names],
      ["How useful (1-5)", useful],
      ["What worked", g("good")],
      ["What's wrong or confusing", g("bad")],
      ["What should we add", g("add")],
      ["Would you pay for it / what for", g("pay")],
    ]);
    setBody(text);
    setCopied(false);
    openEmail(`Beta feedback${g("name") ? ` from ${g("name")}` : ""}`, text);
  }

  return (
    <SiteShell>
      <PageHeader kicker="Beta" title="Tell us what to fix">
        Honest feedback is the whole point of the beta. Two minutes is plenty: short answers are
        fine.
      </PageHeader>
      <form onSubmit={submit} className="mx-auto max-w-6xl space-y-6 px-4 pb-16 [&>*]:max-w-3xl">
        <Section title="You">
          <Field label="Name">
            <TextInput name="name" autoComplete="name" />
          </Field>
          <Field label="Email (optional)">
            <TextInput name="email" type="email" autoComplete="email" />
          </Field>
          <Field label="Your role" wide>
            <TextInput name="role" placeholder="Coach, player, parent, scout, league…" />
          </Field>
        </Section>

        <Section title="The film room">
          <Field label="Which one did you look at?" wide>
            <select
              name="room"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {rooms.map((r) => (
                <option key={r}>{r}</option>
              ))}
              <option>My own game</option>
            </select>
          </Field>
          <Rating
            label="How often were the player names right?"
            low="Mostly wrong"
            high="All right"
            value={names}
            onChange={setNames}
          />
          <Rating
            label="How useful is it for you?"
            low="Not useful"
            high="I'd use it every game"
            value={useful}
            onChange={setUseful}
          />
        </Section>

        <Section title="Your thoughts">
          <Field label="What worked well?" wide>
            <TextArea name="good" rows={3} />
          </Field>
          <Field
            label="What was wrong, broken or confusing?"
            hint="Timestamps or player names help us find it"
            wide
          >
            <TextArea name="bad" rows={4} />
          </Field>
          <Field label="What should we add?" wide>
            <TextArea name="add" rows={3} />
          </Field>
          <Field label="Would you pay for this? For what?" wide>
            <TextArea name="pay" rows={2} />
          </Field>
        </Section>

        {body && (
          <Sent
            copied={copied}
            onCopy={async () => setCopied(await copyText(`To: ${CONTACT_EMAIL}\n\n${body}`))}
          />
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90 sm:w-auto"
        >
          Send feedback
        </button>
      </form>
    </SiteShell>
  );
}

function Rating({
  label,
  low,
  high,
  value,
  onChange,
}: {
  label: string;
  low: string;
  high: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="sm:col-span-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">{low}</span>
        {SCALE.map((n) => (
          <Choice key={n} name={label} value={n} current={value} onChange={onChange}>
            {n}
          </Choice>
        ))}
        <span className="text-xs text-muted-foreground">{high}</span>
      </div>
    </div>
  );
}
