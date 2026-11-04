import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

const box =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30";

export function Field({
  label,
  hint,
  children,
  wide,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${box} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${box} ${props.className ?? ""}`} />;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-border bg-card p-5">
      <legend className="font-display px-1 text-lg font-semibold uppercase">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function Choice({
  name,
  value,
  current,
  onChange,
  children,
}: {
  name: string;
  value: string;
  current: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  const on = current === value;
  return (
    <button
      type="button"
      name={name}
      onClick={() => onChange(value)}
      aria-pressed={on}
      className={`rounded-md border px-3 py-2 text-sm transition-colors ${on ? "border-primary bg-primary/15 text-foreground" : "border-input text-muted-foreground hover:bg-accent"}`}
    >
      {children}
    </button>
  );
}

export function Sent({ onCopy, copied }: { onCopy: () => void; copied: boolean }) {
  return (
    <div className="rounded-xl border border-primary/40 bg-primary/10 p-5 text-sm">
      <p className="font-semibold">
        Your email app should have opened with everything filled in. Just press send.
      </p>
      <p className="mt-1 text-muted-foreground">
        Nothing opened? Copy it and email it to us instead.{" "}
        <button
          type="button"
          onClick={onCopy}
          className="font-semibold text-primary underline-offset-2 hover:underline"
        >
          {copied ? "Copied ✓" : "Copy the details"}
        </button>
      </p>
    </div>
  );
}
