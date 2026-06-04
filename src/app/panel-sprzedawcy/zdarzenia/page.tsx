"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getPromoteEvents,
  clearPromoteEvents,
  downloadEventsCsv,
  type PromoteEvent,
} from "@/lib/promote-analytics";
import { DownloadIcon, ChevronLeftIcon } from "@/components/icons";

const EVENT_LABELS: Record<string, string> = {
  promote_button_viewed: "Wyświetlenie przycisku",
  promote_clicked: "Klik „Promuj tę ofertę”",
  promote_config_entered: "Wejście w konfigurację",
  promote_budget_set: "Ustawienie budżetu",
  promote_clicked_promote: "Klik „Promuj za X zł”",
  promote_email_saved: "Zapis e-mail",
};

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pl-PL");
  } catch {
    return iso;
  }
}

export default function PromoteEventsPage() {
  const [events, setEvents] = useState<PromoteEvent[]>([]);

  useEffect(() => {
    setEvents(getPromoteEvents());
  }, []);

  function handleClear() {
    clearPromoteEvents();
    setEvents([]);
  }

  return (
    <div className="min-h-screen bg-cream-light px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/panel-sprzedawcy"
          className="mb-4 inline-flex items-center gap-1 text-[12px] text-warm-gray transition-colors hover:text-charcoal"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Wróć do panelu
        </Link>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-medium text-charcoal">Zdarzenia lejka promocji</h1>
            <p className="text-[13px] text-warm-gray">
              Zapisane lokalnie zdarzenia painted-door „Promuj tę ofertę” ({events.length}).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadEventsCsv(events)}
              disabled={events.length === 0}
              className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 text-[12px] font-medium uppercase tracking-[0.6px] text-white transition-colors hover:bg-charcoal-light disabled:opacity-40"
            >
              <DownloadIcon className="h-4 w-4" />
              Pobierz CSV
            </button>
            <button
              onClick={handleClear}
              disabled={events.length === 0}
              className="rounded-full border border-border px-4 py-2 text-[12px] font-medium uppercase tracking-[0.6px] text-warm-gray transition-colors hover:text-charcoal disabled:opacity-40"
            >
              Wyczyść
            </button>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-lg border border-border bg-white p-10 text-center">
            <p className="text-[14px] text-warm-gray">
              Brak zapisanych zdarzeń. Wróć do{" "}
              <Link href="/panel-sprzedawcy" className="underline hover:text-charcoal">
                panelu
              </Link>{" "}
              i kliknij „Promuj tę ofertę”.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-border text-warm-gray">
                  <th className="px-4 py-3 font-medium">Czas</th>
                  <th className="px-4 py-3 font-medium">Zdarzenie</th>
                  <th className="px-4 py-3 font-medium">Sprzedawca</th>
                  <th className="px-4 py-3 font-medium">Oferta</th>
                  <th className="px-4 py-3 font-medium">Budżet</th>
                  <th className="px-4 py-3 font-medium">Czas (dni)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events
                  .slice()
                  .reverse()
                  .map((e, i) => (
                    <tr key={i} className="text-charcoal">
                      <td className="whitespace-nowrap px-4 py-3 text-warm-gray">
                        {formatTimestamp(e.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {EVENT_LABELS[e.event] ?? e.event}
                      </td>
                      <td className="px-4 py-3">{String(e.seller_id ?? "")}</td>
                      <td className="px-4 py-3">{String(e.offer_name ?? "—")}</td>
                      <td className="px-4 py-3">
                        {e.set_budget !== undefined ? `${e.set_budget} zł` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {e.duration !== undefined ? String(e.duration) : "—"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
