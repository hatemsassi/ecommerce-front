# Storefront

## Stack
- Next.js (latest, App Router) — routes live in `app/`
- TypeScript
- Tailwind CSS
- Native `fetch` for API calls (no axios or other HTTP clients)

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Conventions

### API client
- Typed API client lives in `lib/api/`, one module per resource (e.g. `lib/api/products.ts`, `lib/api/orders.ts`).
- Each module exports typed functions and the resource's types; callers never call `fetch` directly.
- Base URL comes from `process.env.NEXT_PUBLIC_API_URL` — never hardcode it.

### Components
- Fetch data in Server Components; add `"use client"` only when interactivity requires it.
- Keep components thin: rendering only, no business logic. Put logic in `lib/`.

### Money
- Format all monetary values with `Intl.NumberFormat` (`style: "currency"`); never build price strings by hand.
