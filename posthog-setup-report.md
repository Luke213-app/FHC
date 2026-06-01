<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the FashionHero Next.js 16 App Router project. PostHog is initialized via `instrumentation-client.ts` (Next.js 15.3+ pattern) with a reverse proxy configured in `next.config.ts` to route events through `/ingest/*`. Environment variables are stored in `.env.local`. Fourteen events are captured across eleven files, covering the full purchase funnel, user identity, search, wishlisting, and filtering. Users are identified at login and signup with `posthog.identify()`, and `posthog.reset()` is called on logout.

| Event | Description | File |
|---|---|---|
| `product_viewed` | User views a product detail page — top of conversion funnel | `src/components/product-info.tsx` |
| `product_added_to_cart` | User adds a product to the cart from the product detail page | `src/components/product-info.tsx` |
| `product_added_to_cart` | User adds a product to the cart via the quick view modal | `src/components/quick-view-modal.tsx` |
| `product_removed_from_cart` | User removes a product from the cart | `src/components/cart-provider.tsx` |
| `product_wishlisted` | User saves a product to wishlist | `src/components/wishlist-provider.tsx` |
| `product_unwishlisted` | User removes a product from wishlist | `src/components/wishlist-provider.tsx` |
| `checkout_started` | User clicks the checkout button in the cart drawer | `src/components/cart-drawer.tsx` |
| `order_placed` | User clicks the Place Order button on the checkout page | `src/app/checkout/page.tsx` |
| `user_signed_up` | User successfully creates a new account | `src/app/account/register/page.tsx` |
| `user_logged_in` | User logs in to their account | `src/app/account/login/page.tsx` |
| `user_logged_out` | User logs out of their account | `src/app/account/page.tsx` |
| `product_searched` | User types a search query in the search modal | `src/components/search-modal.tsx` |
| `search_result_clicked` | User clicks on a product in the search results | `src/components/search-modal.tsx` |
| `collection_filtered` | User applies a filter on the collection/product listing page | `src/components/filter-bar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://eu.posthog.com/project/191597/dashboard/717930)
- [Purchase Conversion Funnel](https://eu.posthog.com/project/191597/insights/DSWL3cZC) — 4-step funnel: product viewed → added to cart → checkout started → order placed
- [Shopping Activity Over Time](https://eu.posthog.com/project/191597/insights/3KzPKODL) — Daily trend of cart additions, checkouts started, and orders placed
- [User Signups & Logins](https://eu.posthog.com/project/191597/insights/i6baYLAD) — Daily unique users signing up and logging in
- [Search Engagement](https://eu.posthog.com/project/191597/insights/HSSpc0pQ) — Searches performed vs. result clicks, measuring search effectiveness
- [Wishlist Activity](https://eu.posthog.com/project/191597/insights/cYhbC1Pd) — Products added vs. removed from wishlist, signalling purchase intent

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
