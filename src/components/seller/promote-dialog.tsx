"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Product } from "@/types";
import { CloseIcon, MegaphoneIcon, TrendingUpIcon } from "@/components/icons";
import { logPromoteEvent } from "@/lib/promote-analytics";

interface PromoteDialogProps {
  offer: Product;
  sellerId: string;
  onClose: () => void;
}

const DURATIONS = [3, 7, 14] as const;
const MIN_BUDGET = 20;
const MAX_BUDGET = 500;
const DEFAULT_BUDGET = 100;
const DEFAULT_DURATION = 7;

// Deterministic, credible-looking reach estimate (no real auction behind it).
function estimateReach(budget: number, duration: number) {
  const reach = Math.round(budget * duration * 12);
  const clicks = Math.round(reach * 0.03);
  return { reach, clicks };
}

export function PromoteDialog({ offer, sellerId, onClose }: PromoteDialogProps) {
  const [step, setStep] = useState<"config" | "soon">("config");
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [duration, setDuration] = useState<number>(DEFAULT_DURATION);
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const budgetTouched = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const { reach, clicks } = estimateReach(budget, duration);

  useEffect(() => {
    // Wejście w konfigurację
    logPromoteEvent("promote_config_entered", {
      seller_id: sellerId,
      offer_id: offer.id,
      offer_name: offer.name,
    });

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleBudgetChange(value: number) {
    setBudget(value);
    // Ustawienie budżetu — logujemy raz na otwarcie konfiguracji.
    if (!budgetTouched.current) {
      budgetTouched.current = true;
    }
  }

  function handleBudgetCommit(value: number) {
    logPromoteEvent("promote_budget_set", {
      seller_id: sellerId,
      offer_id: offer.id,
      offer_name: offer.name,
      set_budget: value,
      duration,
    });
  }

  function handlePromote() {
    // Kluczowe zdarzenie lejka — bez płatności i bez zmiany oferty.
    logPromoteEvent("promote_clicked_promote", {
      seller_id: sellerId,
      offer_id: offer.id,
      offer_name: offer.name,
      set_budget: budget,
      duration,
      clicked_promote: true,
    });
    setStep("soon");
  }

  function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    logPromoteEvent("promote_email_saved", {
      seller_id: sellerId,
      offer_id: offer.id,
      offer_name: offer.name,
      email,
    });
    setEmailSaved(true);
  }

  const thumb = offer.images[0];
  const showImage = thumb?.startsWith("/images/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl outline-none"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-warm-gray transition-opacity hover:opacity-60"
          aria-label="Zamknij"
        >
          <CloseIcon />
        </button>

        {step === "config" ? (
          <div className="p-6">
            <div className="mb-5 flex items-center gap-2 text-charcoal">
              <MegaphoneIcon className="h-5 w-5" />
              <h2 className="text-lg font-medium">Promuj tę ofertę</h2>
            </div>

            {/* Oferta */}
            <div className="mb-6 flex items-center gap-3 rounded-md border border-border bg-secondary/60 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-cream">
                {showImage && (
                  <Image src={thumb} alt={offer.name} fill className="object-cover" sizes="56px" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-charcoal">{offer.name}</p>
                <p className="text-[13px] text-warm-gray">{offer.price} zł</p>
              </div>
            </div>

            {/* Budżet */}
            <div className="mb-6">
              <div className="mb-2 flex items-baseline justify-between">
                <label htmlFor="promote-budget" className="text-label">
                  Budżet kampanii
                </label>
                <span className="text-base font-medium text-charcoal">{budget} zł</span>
              </div>
              <input
                id="promote-budget"
                type="range"
                min={MIN_BUDGET}
                max={MAX_BUDGET}
                step={10}
                value={budget}
                onChange={(e) => handleBudgetChange(Number(e.target.value))}
                onMouseUp={(e) => handleBudgetCommit(Number((e.target as HTMLInputElement).value))}
                onTouchEnd={(e) => handleBudgetCommit(Number((e.target as HTMLInputElement).value))}
                onKeyUp={(e) => handleBudgetCommit(Number((e.target as HTMLInputElement).value))}
                className="w-full accent-charcoal"
              />
              <div className="mt-1 flex justify-between text-[11px] text-warm-gray">
                <span>{MIN_BUDGET} zł</span>
                <span>{MAX_BUDGET} zł</span>
              </div>
            </div>

            {/* Czas trwania */}
            <div className="mb-6">
              <label className="text-label mb-2 block">Czas trwania</label>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${
                      duration === d
                        ? "border-charcoal bg-charcoal text-white"
                        : "border-border bg-white text-charcoal hover:bg-secondary"
                    }`}
                  >
                    {d} dni
                  </button>
                ))}
              </div>
            </div>

            {/* Podgląd zasięgu */}
            <div className="mb-6 rounded-md border border-border bg-secondary/60 p-4">
              <div className="mb-3 flex items-center gap-1.5 text-charcoal">
                <TrendingUpIcon className="h-4 w-4" />
                <span className="text-label !text-charcoal">Szacowany zasięg</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-medium text-charcoal">
                    {reach.toLocaleString("pl-PL")}
                  </p>
                  <p className="text-[12px] text-warm-gray">wyświetleń oferty</p>
                </div>
                <div>
                  <p className="text-xl font-medium text-charcoal">
                    {clicks.toLocaleString("pl-PL")}
                  </p>
                  <p className="text-[12px] text-warm-gray">kliknięć w ofertę</p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-warm-gray">
                Szacunki na podstawie podobnych ofert w Twojej kategorii.
              </p>
            </div>

            <button
              onClick={handlePromote}
              className="w-full rounded-full bg-charcoal py-3.5 text-[12px] font-medium uppercase tracking-[0.6px] text-white transition-colors hover:bg-charcoal-light"
            >
              Promuj za {budget} zł
            </button>
            <p className="mt-3 text-center text-[11px] text-warm-gray">
              Płatność pobierana dopiero po uruchomieniu kampanii.
            </p>
          </div>
        ) : (
          <div className="p-6">
            {!emailSaved ? (
              <>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-charcoal">
                  <MegaphoneIcon className="h-6 w-6" />
                </div>
                <h2 className="mb-2 text-lg font-medium text-charcoal">
                  Wkrótce — early access
                </h2>
                <p className="mb-5 text-[14px] leading-relaxed text-warm-gray">
                  Płatna promocja ofert jest w przygotowaniu. Zostaw e-mail, a damy Ci znać jako
                  jednemu z pierwszych, gdy ruszymy — i przygotujemy dla Ciebie wczesny dostęp.
                </p>
                <form onSubmit={handleSaveEmail} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@email.pl"
                    className="w-full rounded-md border border-border bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-charcoal"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-charcoal py-3.5 text-[12px] font-medium uppercase tracking-[0.6px] text-white transition-colors hover:bg-charcoal-light"
                  >
                    Powiadom mnie
                  </button>
                </form>
              </>
            ) : (
              <div className="py-4 text-center">
                <h2 className="mb-2 text-lg font-medium text-charcoal">Dziękujemy!</h2>
                <p className="mb-6 text-[14px] leading-relaxed text-warm-gray">
                  Damy Ci znać na <span className="text-charcoal">{email}</span>, gdy promocja ofert
                  będzie dostępna.
                </p>
                <button
                  onClick={onClose}
                  className="rounded-full border border-charcoal px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.6px] text-charcoal transition-colors hover:bg-charcoal hover:text-white"
                >
                  Zamknij
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
