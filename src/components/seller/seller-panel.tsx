"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product, Seller } from "@/types";
import {
  MegaphoneIcon,
  TrendingUpIcon,
  StarIcon,
  DownloadIcon,
} from "@/components/icons";
import { logPromoteEvent } from "@/lib/promote-analytics";
import { PromoteDialog } from "./promote-dialog";

interface SellerPanelProps {
  seller: Seller;
  offers: Product[];
}

const NAV_ITEMS = [
  { label: "Pulpit", active: false },
  { label: "Oferty", active: true },
  { label: "Zamówienia", active: false },
  { label: "Wiadomości", active: false },
  { label: "Wypłaty", active: false },
  { label: "Ustawienia", active: false },
];

export function SellerPanel({ seller, offers }: SellerPanelProps) {
  const [activeOffer, setActiveOffer] = useState<Product | null>(null);
  const viewLogged = useRef(false);

  useEffect(() => {
    // Wyświetlenie przycisku „Promuj tę ofertę" — raz na wejście do panelu.
    if (viewLogged.current) return;
    viewLogged.current = true;
    logPromoteEvent("promote_button_viewed", {
      seller_id: seller.id,
      offers_count: offers.length,
    });
  }, [seller.id, offers.length]);

  function handlePromoteClick(offer: Product) {
    logPromoteEvent("promote_clicked", {
      seller_id: seller.id,
      offer_id: offer.id,
      offer_name: offer.name,
    });
    setActiveOffer(offer);
  }

  const avgRating =
    offers.length > 0
      ? offers.reduce((sum, o) => sum + o.rating, 0) / offers.length
      : 0;
  const totalReviews = offers.reduce((sum, o) => sum + o.reviewCount, 0);

  return (
    <div className="flex min-h-screen bg-cream-light">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-white lg:flex">
        <div className="px-6 py-5">
          <span className="text-base font-semibold italic text-charcoal">FashionHero</span>
          <p className="text-label mt-0.5">Panel sprzedawcy</p>
        </div>
        <nav className="flex flex-col px-3 py-2">
          {NAV_ITEMS.map((item) => (
            <span
              key={item.label}
              aria-current={item.active ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                item.active
                  ? "bg-secondary font-medium text-charcoal"
                  : "cursor-default text-warm-gray hover:bg-secondary/60"
              }`}
            >
              {item.label}
            </span>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-base font-semibold italic text-charcoal">FashionHero</span>
            <span className="text-label">Panel</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-base font-medium text-charcoal">Twoje oferty</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/panel-sprzedawcy/zdarzenia"
              className="text-[11px] text-warm-gray underline underline-offset-2 transition-colors hover:text-charcoal"
            >
              Zdarzenia
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal text-[12px] font-medium text-white">
                {seller.name.charAt(0)}
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-[13px] font-medium leading-tight text-charcoal">{seller.name}</p>
                <p className="text-[11px] leading-tight text-warm-gray">Sprzedawca Premium</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {/* Statystyki */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-white p-4">
              <p className="text-label">Aktywne oferty</p>
              <p className="mt-1 text-2xl font-medium text-charcoal">{offers.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <p className="text-label">Sprzedaż (30 dni)</p>
              <p className="mt-1 text-2xl font-medium text-charcoal">12 980 zł</p>
            </div>
            <div className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-center gap-1.5">
                <p className="text-label">Średnia ocena</p>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-2xl font-medium text-charcoal">
                {avgRating.toFixed(1)}
                <StarIcon filled className="h-4 w-4 text-charcoal" />
                <span className="text-[12px] font-normal text-warm-gray">
                  ({totalReviews} opinii)
                </span>
              </p>
            </div>
          </div>

          {/* Baner promocji */}
          <div className="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-charcoal">
                <MegaphoneIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">
                  Sprzedawaj więcej dzięki promocji ofert
                </p>
                <p className="text-[13px] text-warm-gray">
                  Wypromuj wybrane oferty na górze wyników wyszukiwania i zwiększ ich widoczność.
                </p>
              </div>
            </div>
          </div>

          {/* Lista ofert */}
          <h2 className="text-label mb-3">Twoje oferty ({offers.length})</h2>
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <ul className="divide-y divide-border">
              {offers.map((offer) => {
                const thumb = offer.images[0];
                const showImage = thumb?.startsWith("/images/");
                return (
                  <li
                    key={offer.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-cream">
                        {showImage && (
                          <Image
                            src={thumb}
                            alt={offer.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-charcoal">{offer.name}</p>
                        <div className="flex items-center gap-2 text-[12px] text-warm-gray">
                          <span>{offer.price} zł</span>
                          <span aria-hidden>·</span>
                          <span className="inline-flex items-center gap-0.5">
                            <StarIcon filled className="h-3 w-3" />
                            {offer.rating.toFixed(1)}
                          </span>
                          <span aria-hidden>·</span>
                          <span className="inline-flex items-center gap-1 text-green-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                            Aktywna
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePromoteClick(offer)}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-charcoal px-4 py-2 text-[12px] font-medium uppercase tracking-[0.6px] text-charcoal transition-colors hover:bg-charcoal hover:text-white"
                    >
                      <MegaphoneIcon className="h-4 w-4" />
                      Promuj tę ofertę
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-[11px] text-warm-gray">
            <TrendingUpIcon className="h-3.5 w-3.5" />
            <span>
              Dane lejka promocji zapisują się lokalnie —{" "}
              <Link
                href="/panel-sprzedawcy/zdarzenia"
                className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-charcoal"
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                podgląd i eksport CSV
              </Link>
            </span>
          </div>
        </main>
      </div>

      {activeOffer && (
        <PromoteDialog
          offer={activeOffer}
          sellerId={seller.id}
          onClose={() => setActiveOffer(null)}
        />
      )}
    </div>
  );
}
