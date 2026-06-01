import type { Metadata } from "next";
import Link from "next/link";
import { preownedListings } from "@/data/preowned";
import { PreownedCatalog } from "@/components/preowned-catalog";

export const metadata: Metadata = {
  title: "Pre-owned — FashionHero",
  description:
    "Give fashion a second life. Shop pre-loved shoes, apparel and accessories from the FashionHero community — Buyer Protection included.",
};

const trust = [
  {
    title: "Buyer Protection",
    description:
      "Every pre-owned order is covered. If an item doesn't arrive or isn't as described, you get your money back.",
  },
  {
    title: "Secure payments",
    description:
      "Pay safely — your money is only released to the seller once you've confirmed everything's fine.",
  },
  {
    title: "Better for the planet",
    description:
      "Buying second-hand keeps clothes in circulation longer and out of landfill. Good for your wallet, good for the planet.",
  },
];

export default function PreownedPage() {
  const itemCount = preownedListings.length;

  return (
    <div>
      {/* Hero */}
      <section className="bg-cream-light">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[1px] text-warm-gray mb-4">
              PRE-OWNED
            </p>
            <h1 className="text-4xl md:text-5xl font-light leading-tight text-charcoal mb-5">
              Pre-loved fashion,
              <br />
              ready for its next chapter.
            </h1>
            <p className="text-base text-warm-gray leading-relaxed max-w-md mb-8">
              Find unique second-hand pieces from the FashionHero community, or
              clear out your closet and earn from what you no longer wear. Every
              order is covered by Buyer Protection.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#catalog" className="btn-cta">
                Shop pre-owned
              </a>
              <Link href="/account/login" className="btn-cta-outline">
                Sell your items
              </Link>
            </div>
          </div>

          {/* Stats card */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-light text-charcoal">{itemCount}+</p>
                <p className="text-[11px] uppercase tracking-wide text-warm-gray mt-1">
                  Listings
                </p>
              </div>
              <div>
                <p className="text-3xl font-light text-charcoal">0%</p>
                <p className="text-[11px] uppercase tracking-wide text-warm-gray mt-1">
                  Seller fees
                </p>
              </div>
              <div>
                <p className="text-3xl font-light text-charcoal">48h</p>
                <p className="text-[11px] uppercase tracking-wide text-warm-gray mt-1">
                  Avg. shipping
                </p>
              </div>
            </div>
            <div className="border-t border-black/5 mt-6 pt-6">
              <p className="text-sm text-warm-gray leading-relaxed">
                List an item in under 2 minutes — snap a photo, set your price,
                and ship it when it sells. We handle the payments and protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {trust.map((item) => (
            <div key={item.title}>
              <h3 className="text-base font-medium text-charcoal mb-2">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-warm-gray">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="bg-background scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-12 pb-2">
          <h2 className="text-2xl font-light text-charcoal">Browse pre-owned</h2>
          <p className="text-sm text-warm-gray mt-1">
            Hand-picked second-hand pieces from sellers across the marketplace.
          </p>
        </div>
        <PreownedCatalog listings={preownedListings} />
      </section>

      {/* Sell CTA */}
      <section className="bg-charcoal text-white py-20 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[1px] text-white/50 mb-4">
          DECLUTTER &amp; EARN
        </p>
        <h2 className="text-3xl md:text-4xl font-light mb-4">
          Got pieces you no longer wear?
        </h2>
        <p className="text-white/70 text-sm max-w-md mx-auto mb-8">
          List them in minutes and reach thousands of buyers looking for their
          next favourite find. No listing fees, ever.
        </p>
        <Link
          href="/account/login"
          className="btn-cta bg-white text-charcoal hover:bg-white/90"
        >
          Start selling
        </Link>
      </section>
    </div>
  );
}
