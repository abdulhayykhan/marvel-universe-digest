# Marvel Character Encyclopedia — Build Plan

A static, neobrutalist Marvel database with 40 characters, browse/detail pages, favorites, comparison tool, and random hero button.

## Stack
React + TanStack Router (the project's stack) + Tailwind v4. No backend, no API. Anton + Inter loaded via Google Fonts `<link>` in the root head.

## Design tokens (`src/styles.css`)
- Colors as Tailwind theme vars: `marvel-black #0D0D0D`, `marvel-red #ED1D24`, `marvel-white #FFFFFF`, `marvel-yellow #F5C518`, `marvel-bone #F4F1EA` (page bg).
- Fonts: `--font-display: Anton`, `--font-sans: Inter`.
- Utilities (`@utility`): `brutal-border` (3px), `brutal-border-4` (4px), `brutal-shadow` (6/6/0 black, no blur), `brutal-shadow-sm` (4/4/0), `brutal-shadow-lg` (10/10/0), `brutal-hover` (tilt + shadow shift on hover), `route-fade` (fade+slide-up keyframe for transitions).
- No gradients, no rounded corners.

## Routes
- `/` (`src/routes/index.tsx`) — Browse page: red hero block, sticky search/filter bar, category chips (All, Avengers, X-Men, Villains, Guardians, Defenders, Cosmic, Street-Level), random button (navigates to a random character), responsive grid (1/2/3/4 cols), "NO HEROES FOUND" brutalist empty state.
- `/characters/$characterId` — Detail page: back button strip, full-width red hero banner with massive uppercase alias + portrait, Bio card, Abilities card (yellow PowerBadges on black), MCU Appearances table (title/year/role with colored role chip/actor), Allies + Enemies grids of linked cards. Loader throws `notFound()` for unknown ids, per-route head() pulls title/description from character data.
- `/favorites` — Grid of bookmarked characters from localStorage; empty state with CTA.
- `/compare` — Two-slot side-by-side comparison (category/affiliation/allies count/enemies count/MCU film count/abilities) sourced from localStorage; clear button.
- 404 — Brutalist not-found in `__root.tsx`.

## Components (`src/components/`)
- `SiteNav.tsx` — sticky top nav: red MARVEL wordmark logo, links to Browse / Favorites (count) / Compare (count/2); compact icon buttons on mobile.
- `CharacterCard.tsx` — black bg, 4px border, hard shadow, hover tilt; portrait + alias + real name + category chips + "View Profile" + favorite star + "VS" toggle.
- `CharacterPortrait.tsx` — deterministic palette (red/black/yellow rotation by id hash), initials, halftone dot pattern overlay, accent geometric shapes. Sizes: `card`, `hero`, `sm`. No external images.
- `PowerBadge.tsx` — yellow chip, black border, hard shadow, Anton uppercase.
- `CategoryFilter.tsx` — chip row, All + 7 categories; red when active.
- `RelatedCharacterCard.tsx` — compact linked card for allies/enemies; gracefully handles ids not in the dataset (shows a "profile soon" stub).

## Data (`src/data/characters.ts`)
Typed array of all 40 characters with real bios, accurate MCU appearance lists with actor names and years (Iron Man → Endgame, Loki series, Hawkeye, Moon Knight, She-Hulk, Ms. Marvel, The Marvels, Guardians Vol. 3, Deadpool & Wolverine, Daredevil: Born Again, Doomsday, etc.), cross-linked allies/enemies by id. Exports `characters`, `charactersById`, `getCharacter(id)`, `CATEGORIES`.

## Extras
- `src/lib/favorites.ts` — `useFavorites` and `useCompare` hooks backed by localStorage with a CustomEvent sync so nav counts update across components. Compare capped at 2.
- Per-route `head()` metadata (title + description + og tags); favicon = inline red SVG with white "M".
- `.route-fade` class wraps page content for smooth fade+slide on route change.
- Mobile responsive: nav collapses to icon buttons on small screens, grid stacks, hero banner stacks portrait below title at `md`.

## Files to create / modify
- Modify: `src/styles.css`, `src/routes/__root.tsx`, `src/routes/index.tsx`
- Create: `src/data/characters.ts`, `src/lib/favorites.ts`, `src/components/{SiteNav,CharacterCard,CharacterPortrait,PowerBadge,CategoryFilter,RelatedCharacterCard}.tsx`, `src/routes/characters.$characterId.tsx`, `src/routes/favorites.tsx`, `src/routes/compare.tsx`

## Out of scope
No backend, no real Marvel images (styled initials portraits instead — keeps it fully static, avoids broken/copyrighted URLs), no auth.
