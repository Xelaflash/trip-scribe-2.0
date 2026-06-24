# Agent Instructions

## App Summary

Trip Scribe 2.0 is a core travel-planning MVP. The main flow is: sign in, create trips, manage itinerary items, keep notes, save places, and publish read-only public pages for trips that are ready to share.

The implemented app has a public landing page, authentication, an authenticated trip workspace at `src/app/trips/page.tsx`, owner trip detail pages at `src/app/trips/[slug]/page.tsx`, and public read-only pages at `src/app/share/[slug]/page.tsx`.

## Current Development Status

- Dependencies were upgraded to the latest stable compatible baseline: Next.js 16, React 19, TypeScript 6, Prisma 7, Zod 4, and current Radix/TanStack/Tailwind packages.
- Prisma 7 uses `prisma.config.ts`, `@prisma/adapter-pg`, and generated output at `generated/prisma`.
- The schema supports `Trip.description`, `ItineraryItem`, `TripNote`, and `TripPlace`.
- Trip write APIs are owner-protected and use Zod validation.
- Public sharing is read-only and only available for `Visibility.PUBLIC` trips.
- ESLint flat config, Prettier, Husky, and lint-staged are configured.
- Pre-commit runs staged formatting/linting plus full `pnpm typecheck`.
- Playwright is installed for smoke tests, but smoke test files are not implemented yet.

## Stack

- Next.js 16 App Router with TypeScript strict mode.
- React 19.
- Prisma 7 with PostgreSQL and `@prisma/adapter-pg`.
- NextAuth 4 with `@auth/prisma-adapter`.
- TanStack Query 5 and React Query Devtools.
- Tailwind CSS 4, Radix UI primitives, and shadcn/ui-style local components.
- React Hook Form, Zod 4, date-fns, React Day Picker, Framer Motion, Lucide React, Sonner.
- pnpm is enforced by the `preinstall` script.

## Repository Map

- `src/app`: App Router pages, layouts, and API routes.
- `src/app/api/auth/[...nextauth]/route.ts`: NextAuth configuration.
- `src/app/api/trips`: Trip and nested content API routes.
- `src/app/trips`: Authenticated trip workspace and owner trip detail pages.
- `src/app/share`: Public read-only trip pages.
- `src/components`: Shared components and local UI primitives.
- `src/lib`: Providers, Prisma client, validation, server helpers, and shared utilities.
- `src/queries`: Fetch wrappers used by client hooks/components.
- `src/hooks`: Client hooks.
- `src/store`: Zustand state.
- `src/types`: App-specific TypeScript types and NextAuth augmentation.
- `prisma/schema.prisma`: Database schema.
- `prisma.config.ts`: Prisma 7 CLI config.
- `docs/mvp-plan.md`: MVP implementation plan.

## Working Rules

- Use pnpm for all package operations.
- Prefer Server Components in `src/app`; add `"use client"` only for hooks, browser APIs, local state, or event handlers.
- Keep auth-sensitive server mutations protected with `getServerSession(authOptions)`.
- Do not trust client-submitted user IDs for ownership; derive ownership from the session.
- Keep Prisma schema changes paired with migrations and seed updates when relevant.
- Import Prisma runtime/types from `@prisma/generated`, not `@prisma/client`.
- Use the existing `@/*` import alias.
- Use local shadcn/Radix UI primitives from `src/components/ui` before adding new UI dependencies.
- Use Tailwind utilities for app styling. Do not add CSS modules or component-scoped stylesheet files; keep shared theme tokens in `src/app/globals.css`.
- Define React components as arrow functions assigned to `const`; avoid `function` declarations for components.
- Preserve strict TypeScript. Replace `any` with schema-derived or Prisma-backed types.
- Prefer Zod validation at request and form boundaries before passing data to Prisma.
- For TanStack Query, keep query keys stable and include route/user identifiers when data is scoped.
- Avoid adding new state to Zustand unless it is truly shared client state; prefer server state through TanStack Query.
- Remove temporary `console.log` calls when editing nearby code.
- Do not commit generated `.next` output. Treat `generated/prisma` as Prisma client output and avoid manual edits there.

## Common Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm format:check
pnpm typecheck
pnpm prisma generate
pnpm prisma db seed
```

## Environment

The app expects these variables based on the current code:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_SECRET_ID`
- `SMTP_HOST`
- `SMTP_PORT`
- `EMAIL_USER`
- `EMAIL_API_KEY`
- `EMAIL_FROM`
