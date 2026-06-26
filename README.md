# Trip Scribe 2.0

Trip Scribe is a core travel-planning MVP. Users can sign in, create trips, manage itinerary items, keep notes, save places, and publish read-only public trip pages.

## Current Status

Implemented:

- Warm travel utility landing page.
- NextAuth authentication with Google and email providers.
- Authenticated trip workspace at `/trips`.
- Owner trip detail pages at `/trips/[slug]`.
- Read-only public sharing at `/share/[slug]` for public trips.
- Trip CRUD with server-side slug generation and Zod validation.
- Itinerary item, note, and place CRUD flows.
- Prisma 7 schema with PostgreSQL driver adapter.
- ESLint, Prettier, Husky, and lint-staged quality gates.

Still outside this MVP:

- Photo gallery.
- Budget tracker.
- Checklist.
- Collaboration or invite editing.
- Full calendar board.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 6 with strict mode
- Prisma 7 with PostgreSQL and `@prisma/adapter-pg`
- NextAuth 4 with Prisma Adapter, Google auth, and email auth
- TanStack Query 5 for client-side server state
- Tailwind CSS 4, Radix UI, and shadcn/ui-style components
- React Hook Form and Zod 4 for forms
- date-fns and React Day Picker for dates
- pnpm for package management

## Development

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm prisma generate
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
```

Run Playwright against a disposable database only:

```bash
E2E_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trip_scribe_e2e" pnpm test:e2e
```

Seed the database:

```bash
pnpm prisma db seed
```

The MVP plan is stored in `docs/mvp-plan.md`.

## Styling

Use Tailwind CSS utilities for application styling.
