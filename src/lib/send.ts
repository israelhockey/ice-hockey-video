import { CONTACT_EMAIL } from "./site";

// Beta: requests and feedback go out as a pre-filled email. When the site gets a database (Lovable Cloud),
// only this file needs to change.
export function formatFields(fields: [string, string][]) {
  return fields
    .filter(([, v]) => v.trim())
    .map(([k, v]) => (v.includes("\n") ? `${k}:\n${v.trim()}` : `${k}: ${v.trim()}`))
    .join("\n\n");
}

export function openEmail(subject: string, body: string) {
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
