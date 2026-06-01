# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The import above carries the tech stack, code style, and the **"This is NOT the Next.js you know"** warning (Next.js 16 — read `node_modules/next/dist/docs/` before writing framework code). The notes below describe the *actual* app that has been built on top of this template (a FashionHero marketplace clone of Allbirds), which the template docs do not cover.

## Commands

```bash
npm run dev    # dev server
npm run build  # production build (also the only way to catch type errors — strict mode, no test suite)
npm run lint   # eslint
```

There are no tests. Verify changes with `npm run build` (TypeScript strict) and visual inspection in `npm run dev`.

## Architecture

This is a **fully static ecommerce frontend** — no backend, no database, no API routes. All product data is hardcoded; all "stateful" behavior (cart, wishlist, auth, recently-viewed) is client-only React context persisted to `localStorage`.

### Data layer (`src/data/`)
The single source of truth. `products.ts` is large (~3500 lines of hardcoded `Product` objects) and exports query helpers — use these rather than re-filtering the array yourself:
- `getProduct(slug)`, `getProductsByCollection(slug)`, `getRelatedProducts(product, limit)`, `getProductsBySeller(slug)`, plus `heroSlides`.
- `collections.ts` → `getCollection(slug)`; `sellers.ts` → `getSeller(...)`.

**Marketplace model:** every `Product` has a `sellerId` (joined via `sellers.ts`). Collections are *not* a join table — a product belongs to a collection when that collection's slug appears in its `collections: string[]` array. All shared types live in `src/types/` (`index.ts` re-exports `seller.ts`).

### Routing (`src/app/`, App Router)
- `/` home, `/collections/[slug]` (PLP), `/products/[slug]` (PDP), plus `/about`, `/checkout`, `/wishlist`, `/account` (+ `login`, `register`).
- PLP and PDP are **statically generated** via `generateStaticParams()` over the data arrays. Pages are async Server Components that `await params`/`searchParams`; they fetch data with the helpers and pass it to client components.
- **Filtering & sorting happen client-side**, not in the route. The server route passes the full collection's products (and an optional `?seller=` searchParam) into `collection-view.tsx`, which does all gender/price/type/material/size/seller filtering and sorting in a `useMemo`.

### Client state (`src/components/shell.tsx`)
`Shell` wraps every page (mounted once in `layout.tsx`) and nests the context providers:
`AuthProvider → CartProvider → WishlistProvider → QuickViewProvider`.
Consume state via their hooks (`useCart`, `useWishlist`, etc.). `auth-provider.tsx`, `wishlist-provider.tsx`, and `recently-viewed.tsx` persist to `localStorage`.

### Styling (`src/app/globals.css`)
Tailwind v4 with `@import "shadcn/tailwind.css"`. Design tokens are defined in `@theme inline` — including custom FashionHero colors (`--color-cream`, `--color-charcoal`, `--color-warm-gray`, `--color-footer-bg`) and a `--radius-*` scale derived from `--radius`. Use these token-backed utility classes (e.g. `bg-cream`, `text-charcoal`) rather than hardcoded hex values.

### Components
`src/components/` holds feature components flat; `ui/` holds shadcn primitives; `sections/` holds page sections; `icons.tsx` holds custom SVG icons (prefer these, then `lucide-react`). Path alias: `@/*` → `src/*`.
