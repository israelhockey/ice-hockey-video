import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

// Requests and feedback are saved to the database. If saving fails, the page offers "copy the details".
export function formatFields(fields: [string, string][]) {
  return fields
    .filter(([, v]) => v.trim())
    .map(([k, v]) => (v.includes("\n") ? `${k}:\n${v.trim()}` : `${k}: ${v.trim()}`))
    .join("\n\n");
}

const clean = <T extends Record<string, unknown>>(row: T) =>
  Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k, typeof v === "string" && !v.trim() ? null : v]),
  ) as T;

export async function uploadRoster(file: File): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${crypto.randomUUID()}/${safe}`;
  const { error } = await supabase.storage
    .from("rosters")
    .upload(path, file, { contentType: file.type || "text/csv" });
  if (error) throw error;
  return path;
}

export async function saveRequest(row: TablesInsert<"breakdown_requests">) {
  const { error } = await supabase.from("breakdown_requests").insert(clean(row));
  if (error) throw error;
}

export async function saveFeedback(row: TablesInsert<"feedback">) {
  const { error } = await supabase.from("feedback").insert(clean(row));
  if (error) throw error;
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
