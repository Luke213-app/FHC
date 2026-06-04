import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeller } from "@/data/sellers";
import { getProductsBySeller } from "@/data/products";
import { SellerPanel } from "@/components/seller/seller-panel";

// Painted door AT-1: wchodzimy od razu jako zalogowany duży sprzedawca
// z wynegocjowaną stawką (mock — bez logowania).
const CURRENT_SELLER_SLUG = "modna-szafa";

export const metadata: Metadata = {
  title: "Panel sprzedawcy — FashionHero",
};

export default function SellerPanelPage() {
  const seller = getSeller(CURRENT_SELLER_SLUG);
  const offers = getProductsBySeller(CURRENT_SELLER_SLUG);

  if (!seller) notFound();

  return <SellerPanel seller={seller} offers={offers} />;
}
