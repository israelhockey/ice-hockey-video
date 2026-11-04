import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import { Choice, Field, Section, Sent, TextArea, TextInput } from "@/components/form-bits";
import { PageHeader, SiteShell } from "@/components/site-shell";
import { copyText, formatFields, openEmail } from "@/lib/send";
import { CONTACT_EMAIL, SITE_NAME, TURNAROUND } from "@/lib/site";

export const Route = createFileRoute("/request")({
  head: () => ({ meta: [{ title: `Request a breakdown · ${SITE_NAME}` }] }),
  component: RequestPage,
});

const ROSTER_EXAMPLE = `team,number,name,position
HC Tel Aviv,10,Richie Hayward,F
HC Tel Aviv,30,Daniel Kreiner,G
Jerusalem Capitals,9,Natanel Peretz,F`;

function RequestPage() {
  const [span, setSpan] = useState("full");
  const [body, setBody] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [roster, setRoster] = useState("");
  const [rosterFile, setRosterFile] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function loadCsv(f: File | undefined) {
    if (!f) return;
    setRosterFile(f.name);
    setFile(f);
    setRoster((await f.text()).trim());
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const g = (k: string) => String(d.get(k) ?? "");
    const spanText =
      span === "full"
        ? "Full game"
        : span === "period"
          ? `Period: ${g("period")}`
          : `From ${g("from")} to ${g("to")} in the video`;
    setSaving(true);
    setBody(null);
    try {
      const roster_file_path = file ? await uploadRoster(file) : null;
      await saveRequest({
        name: g("name"),
        email: g("email"),
        team_org: g("org"),
        video_url: g("video"),
        span,
        period: span === "period" ? g("period") : null,
        range_from: span === "range" ? g("from") : null,
        range_to: span === "range" ? g("to") : null,
        home_team: g("home"),
        home_color: g("homeColor"),
        away_team: g("away"),
        away_color: g("awayColor"),
        goalies: g("goalies"),
        roster_text: roster,
        roster_file_path,
        notes: g("notes"),
      });
      setDone(true);
      window.scrollTo({ top: 0 });
    } catch {
      setBody(
        formatFields([
          ["Name", g("name")],
          ["Email", g("email")],
          ["Team / organisation", g("org")],
          ["Video", g("video")],
          ["What to analyse", spanText],
          ["Home team", `${g("home")} (jersey: ${g("homeColor")})`],
          ["Away team", `${g("away")} (jersey: ${g("awayColor")})`],
          ["Goalies who played", g("goalies")],
          ["Roster", roster],
          ["Notes", g("notes")],
        ]),
      );
      setCopied(false);
    } finally {
      setSaving(false);
    }
  }

  if (done)
    return (
      <SiteShell>
        <PageHeader kicker="Beta" title="Request received">
          Thanks for sending your game.
        </PageHeader>
        <ThankYou title="Thank you!">
          We'll email your film room link, usually within a day.
        </ThankYou>
      </SiteShell>
    );

  return (
    <SiteShell>
      <PageHeader kicker="Beta" title="Request a game breakdown">
        Send us one game and both rosters. You'll get a link to your film room, usually{" "}
        {TURNAROUND.toLowerCase()}.
      </PageHeader>
      <form onSubmit={submit} className="mx-auto max-w-6xl space-y-6 px-4 pb-16 [&>*]:max-w-3xl">
        <Section title="You">
          <Field label="Your name">
            <TextInput name="name" required autoComplete="name" />
          </Field>
          <Field label="Email" hint="Where we send the film room link">
            <TextInput name="email" type="email" required autoComplete="email" />
          </Field>
          <Field label="Team or organisation" wide>
            <TextInput name="org" placeholder="e.g. HC Tel Aviv U18" />
          </Field>
        </Section>

        <Section title="The game">
          <Field
            label="Video link"
            hint="YouTube, LiveBarn share link, or Google Drive / Dropbox. No link? Say so in the notes and we'll get the file from you."
            wide
          >
            <TextInput
              name="video"
              type="url"
              required
              placeholder="https://www.youtube.com/watch?v=…"
            />
          </Field>
          <div className="sm:col-span-2">
            <span className="text-sm font-medium">What should we analyse?</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <Choice name="span" value="full" current={span} onChange={setSpan}>
                Full game
              </Choice>
              <Choice name="span" value="period" current={span} onChange={setSpan}>
                One period
              </Choice>
              <Choice name="span" value="range" current={span} onChange={setSpan}>
                A time range
              </Choice>
            </div>
          </div>
          {span === "period" && (
            <Field label="Which period">
              <select
                name="period"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>1st</option>
                <option>2nd</option>
                <option>3rd</option>
                <option>Overtime</option>
              </select>
            </Field>
          )}
          {span === "range" && (
            <>
              <Field label="Start (time in the video)">
                <TextInput name="from" required placeholder="1:05:00" />
              </Field>
              <Field label="End">
                <TextInput name="to" required placeholder="1:25:00" />
              </Field>
            </>
          )}
        </Section>

        <Section title="Teams">
          <Field label="Home team">
            <TextInput name="home" required />
          </Field>
          <Field label="Home jersey colour in this game">
            <TextInput name="homeColor" required placeholder="e.g. dark blue" />
          </Field>
          <Field label="Away team">
            <TextInput name="away" required />
          </Field>
          <Field label="Away jersey colour in this game">
            <TextInput name="awayColor" required placeholder="e.g. white with red" />
          </Field>
          <Field
            label="Goalies who played (optional)"
            hint="Goalie numbers are hard to read on pads, so naming them helps"
            wide
          >
            <TextInput name="goalies" placeholder="Home: Daniel Kreiner · Away: Henri Kolb" />
          </Field>
        </Section>

        <Section title="Rosters">
          <Field
            label="Both rosters"
            hint="One player per line: team, number, name, position (F, D or G). Paste it, or upload a CSV."
            wide
          >
            <TextArea
              rows={9}
              value={roster}
              onChange={(e) => setRoster(e.target.value)}
              placeholder={ROSTER_EXAMPLE}
              className="font-mono text-xs"
              required
            />
          </Field>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3 text-sm">
            <label className="cursor-pointer rounded-md border border-input px-3 py-2 hover:bg-accent">
              Upload CSV
              <input
                type="file"
                accept=".csv,text/csv,.txt"
                className="sr-only"
                onChange={(e) => loadCsv(e.target.files?.[0])}
              />
            </label>
            {rosterFile && <span className="text-muted-foreground">Loaded {rosterFile}</span>}
          </div>
        </Section>

        <Section title="Anything else">
          <Field
            label="Notes"
            hint="Players in a different number this game, what you most want to see, etc."
            wide
          >
            <TextArea name="notes" rows={4} />
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
          Send request
        </button>
      </form>
    </SiteShell>
  );
}
