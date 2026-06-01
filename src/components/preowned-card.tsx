import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "./icons";
import { conditionLabels, type PreownedListing } from "@/data/preowned";

interface PreownedCardProps {
  listing: PreownedListing;
}

export function PreownedCard({ listing }: PreownedCardProps) {
  return (
    <div className="group">
      <Link href={`/products/${listing.productSlug}`} className="block">
        {/* Photo */}
        <div className="relative aspect-square overflow-hidden mb-2 bg-cream-light rounded-md">
          <Image
            src={listing.image}
            alt={`${listing.brand} ${listing.title}`}
            width={600}
            height={600}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Condition pill */}
          <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wide bg-white/90 text-charcoal px-2 py-0.5 rounded-full">
            {conditionLabels[listing.condition]}
          </span>

          {/* Favorites */}
          <span className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 text-charcoal text-[11px] px-2 py-0.5 rounded-full">
            <HeartIcon className="h-3 w-3" />
            {listing.favorites}
          </span>
        </div>
      </Link>

      {/* Info */}
      <Link href={`/products/${listing.productSlug}`} className="block">
        <p className="text-[12px] font-medium text-charcoal truncate">{listing.brand}</p>
        <p className="text-[12px] text-warm-gray truncate mb-0.5">{listing.title}</p>
        <p className="text-[11px] text-warm-gray/80 mb-1">Size {listing.size}</p>
      </Link>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-[14px] font-medium text-charcoal">{listing.price} zl</span>
        <span className="text-[12px] text-warm-gray line-through">{listing.originalPrice} zl</span>
      </div>

      {/* Seller */}
      <p className="text-[11px] text-warm-gray/70 mt-0.5 truncate">
        {listing.sellerName}
        {listing.sellerRating >= 4.5 && (
          <span className="inline-block ml-1 text-[9px] bg-charcoal/10 text-charcoal/70 px-1 py-0.5 rounded uppercase tracking-wide">
            Top
          </span>
        )}
      </p>
    </div>
  );
}
