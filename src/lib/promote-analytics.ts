import posthog from "posthog-js";

// Painted-door funnel "Promuj tę ofertę" (AT-1).
// Every step is logged to PostHog AND mirrored to localStorage so the prototype
// can offer a simple events view + CSV export without dashboard access.

const STORAGE_KEY = "fashionhero_promote_events";

export type PromoteEventName =
  | "promote_button_viewed" // wyświetlenie przycisku
  | "promote_clicked" // klik „Promuj tę ofertę"
  | "promote_config_entered" // wejście w konfigurację
  | "promote_budget_set" // ustawienie budżetu
  | "promote_clicked_promote" // klik „Promuj za X zł" (kluczowe zdarzenie)
  | "promote_email_saved"; // zapis e-mail

type EventProps = Record<string, string | number | boolean>;

export interface PromoteEvent {
  event: PromoteEventName;
  timestamp: string;
  seller_id: string;
  [key: string]: string | number | boolean;
}

// Stable CSV column order — extra props are appended after these.
const CSV_COLUMNS = [
  "timestamp",
  "event",
  "seller_id",
  "offer_id",
  "offer_name",
  "set_budget",
  "duration",
  "clicked_promote",
  "email",
] as const;

function loadEvents(): PromoteEvent[] {
  try {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as PromoteEvent[]) : [];
  } catch {
    return [];
  }
}

function saveEvents(events: PromoteEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // localStorage unavailable
  }
}

/**
 * Log a single funnel step. `seller_id` is required on every event; any
 * additional funnel properties (offer_id, set_budget, duration, …) are passed
 * through to both PostHog and the local CSV store.
 */
export function logPromoteEvent(
  event: PromoteEventName,
  properties: { seller_id: string } & EventProps,
) {
  posthog.capture(event, properties);

  const record: PromoteEvent = {
    event,
    timestamp: new Date().toISOString(),
    ...properties,
  };
  const events = loadEvents();
  events.push(record);
  saveEvents(events);
}

export function getPromoteEvents(): PromoteEvent[] {
  return loadEvents();
}

export function clearPromoteEvents() {
  saveEvents([]);
}

function escapeCsv(value: string | number | boolean | undefined): string {
  if (value === undefined) return "";
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function eventsToCsv(events: PromoteEvent[]): string {
  // Collect any extra keys beyond the fixed columns so nothing is dropped.
  const extraKeys = Array.from(
    new Set(
      events.flatMap((e) =>
        Object.keys(e).filter((k) => !CSV_COLUMNS.includes(k as (typeof CSV_COLUMNS)[number])),
      ),
    ),
  );
  const columns = [...CSV_COLUMNS, ...extraKeys];

  const header = columns.join(",");
  const rows = events.map((e) => columns.map((col) => escapeCsv(e[col])).join(","));
  return [header, ...rows].join("\n");
}

export function downloadEventsCsv(events: PromoteEvent[]) {
  const csv = eventsToCsv(events);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "promuj-oferte-zdarzenia.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
