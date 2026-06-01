import type { ProductCategory } from "@/types";
import { products } from "./products";
import { getSellerById } from "./sellers";

export type PreownedCondition =
  | "new-with-tags"
  | "very-good"
  | "good"
  | "satisfactory";

export interface PreownedListing {
  id: string;
  /** Links through to the underlying product detail page */
  productSlug: string;
  title: string;
  brand: string;
  image: string;
  category: ProductCategory;
  size: string;
  condition: PreownedCondition;
  price: number;
  originalPrice: number;
  favorites: number;
  sellerName: string;
  sellerRating: number;
  uploadedDaysAgo: number;
}

export const conditionLabels: Record<PreownedCondition, string> = {
  "new-with-tags": "New with tags",
  "very-good": "Very good",
  good: "Good",
  satisfactory: "Satisfactory",
};

/** Discount applied to the original price depending on condition */
const conditionFactor: Record<PreownedCondition, number> = {
  "new-with-tags": 0.7,
  "very-good": 0.58,
  good: 0.46,
  satisfactory: 0.36,
};

const conditionOrder: PreownedCondition[] = [
  "new-with-tags",
  "very-good",
  "good",
  "satisfactory",
];

const apparelSizes = ["XS", "S", "M", "L", "XL"];

function sizeLabel(category: ProductCategory, shoeSize: number | undefined, index: number): string {
  if (category === "apparel") return apparelSizes[index % apparelSizes.length];
  if (category === "accessories") return "One size";
  if (category === "socks") return apparelSizes[(index % 3) + 1];
  return `EU ${shoeSize ?? 42}`;
}

/**
 * Pre-owned listings are derived deterministically from the catalogue so the
 * page stays fully static. Each listing reuses a real product's photo + seller
 * but presents it as a second-hand item with a condition, size and lower price.
 */
export const preownedListings: PreownedListing[] = products
  .filter((p) => p.colors[0]?.image.startsWith("/images/"))
  .slice(0, 32)
  .map((product, index) => {
    const condition = conditionOrder[index % conditionOrder.length];
    const seller = getSellerById(product.sellerId);
    const factor = conditionFactor[condition];
    const price = Math.max(19, Math.round((product.price * factor) / 5) * 5);

    return {
      id: `po-${product.id}`,
      productSlug: product.slug,
      title: product.name,
      brand: seller?.name ?? "FashionHero",
      image: product.colors[0].image,
      category: product.productCategory,
      size: sizeLabel(product.productCategory, product.sizes[0], index),
      condition,
      price,
      originalPrice: product.price,
      favorites: ((index * 7 + 11) % 90) + 3,
      sellerName: seller?.name ?? "FashionHero",
      sellerRating: seller?.rating ?? 0,
      uploadedDaysAgo: ((index * 3 + 1) % 27) + 1,
    };
  });

export function getPreownedCategories(): ProductCategory[] {
  return Array.from(new Set(preownedListings.map((l) => l.category)));
}
