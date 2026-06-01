"use client";

import { useState, useMemo } from "react";
import type { ProductCategory } from "@/types";
import {
  conditionLabels,
  type PreownedCondition,
  type PreownedListing,
} from "@/data/preowned";
import { PreownedCard } from "./preowned-card";
import { ChevronDownIcon } from "./icons";

type SortOption = "recent" | "price-asc" | "price-desc" | "popular";
type PriceRange = "all" | "under-100" | "100-250" | "over-250";

const sortLabels: Record<SortOption, string> = {
  recent: "Newest first",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  popular: "Most loved",
};

const categoryLabels: Record<ProductCategory, string> = {
  shoes: "Shoes",
  socks: "Socks",
  apparel: "Apparel",
  accessories: "Accessories",
};

const conditionOrder: PreownedCondition[] = [
  "new-with-tags",
  "very-good",
  "good",
  "satisfactory",
];

interface PreownedCatalogProps {
  listings: PreownedListing[];
}

export function PreownedCatalog({ listings }: PreownedCatalogProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [conditions, setConditions] = useState<PreownedCondition[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [sortOpen, setSortOpen] = useState(false);

  const availableCategories = useMemo(
    () => Array.from(new Set(listings.map((l) => l.category))),
    [listings]
  );

  const filtered = useMemo(() => {
    let result = listings;

    if (categories.length > 0) {
      result = result.filter((l) => categories.includes(l.category));
    }
    if (conditions.length > 0) {
      result = result.filter((l) => conditions.includes(l.condition));
    }
    if (priceRange === "under-100") {
      result = result.filter((l) => l.price < 100);
    } else if (priceRange === "100-250") {
      result = result.filter((l) => l.price >= 100 && l.price <= 250);
    } else if (priceRange === "over-250") {
      result = result.filter((l) => l.price > 250);
    }

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result = [...result].sort((a, b) => b.favorites - a.favorites);
        break;
      case "recent":
      default:
        result = [...result].sort((a, b) => a.uploadedDaysAgo - b.uploadedDaysAgo);
        break;
    }

    return result;
  }, [listings, categories, conditions, priceRange, sort]);

  function toggleCategory(cat: ProductCategory) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleCondition(cond: PreownedCondition) {
    setConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  }

  const hasActiveFilters =
    categories.length > 0 || conditions.length > 0 || priceRange !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-label">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setCategories([]);
                  setConditions([]);
                  setPriceRange("all");
                }}
                className="text-[11px] text-warm-gray hover:text-charcoal transition-colors underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category */}
          <FilterGroup title="Category">
            {availableCategories.map((cat) => (
              <CheckRow
                key={cat}
                label={categoryLabels[cat]}
                checked={categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
            ))}
          </FilterGroup>

          {/* Condition */}
          <FilterGroup title="Condition">
            {conditionOrder.map((cond) => (
              <CheckRow
                key={cond}
                label={conditionLabels[cond]}
                checked={conditions.includes(cond)}
                onChange={() => toggleCondition(cond)}
              />
            ))}
          </FilterGroup>

          {/* Price */}
          <FilterGroup title="Price">
            {(
              [
                ["all", "Any price"],
                ["under-100", "Under 100 zl"],
                ["100-250", "100 – 250 zl"],
                ["over-250", "Over 250 zl"],
              ] as [PriceRange, string][]
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 py-1 cursor-pointer text-[13px] text-charcoal/80 hover:text-charcoal"
              >
                <input
                  type="radio"
                  name="po-price"
                  checked={priceRange === value}
                  onChange={() => setPriceRange(value)}
                  className="accent-charcoal"
                />
                {label}
              </label>
            ))}
          </FilterGroup>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[13px] text-warm-gray">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </p>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                onBlur={() => setTimeout(() => setSortOpen(false), 150)}
                className="flex items-center gap-1.5 text-[13px] text-charcoal hover:opacity-70 transition-opacity"
              >
                {sortLabels[sort]}
                <ChevronDownIcon className="h-3 w-3" />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-black/5 shadow-lg rounded-md py-1 z-20 min-w-[180px]">
                  {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                    <button
                      key={opt}
                      onMouseDown={() => {
                        setSort(opt);
                        setSortOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-[13px] hover:bg-cream-light ${
                        sort === opt ? "text-charcoal font-medium" : "text-charcoal/70"
                      }`}
                    >
                      {sortLabels[opt]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {filtered.map((listing) => (
                <PreownedCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-warm-gray text-sm">No items match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 border-t border-black/5 pt-4">
      <h3 className="text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-2">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer text-[13px] text-charcoal/80 hover:text-charcoal">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-charcoal"
      />
      {label}
    </label>
  );
}
