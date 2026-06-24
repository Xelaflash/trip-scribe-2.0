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
- Follow the user's requirements exactly. Ask for clarification when requirements are ambiguous, and do not guess when the answer is unknown.
- Prefer simple, complete, working solutions over clever abstractions. Apply DRY, KISS, YAGNI, and clean-code principles pragmatically.
- When the global `/vercel-react-best-practices` skill is available, apply it for React/Next.js components, pages, data fetching, performance review, and refactors. Do not vendor that global skill into this repo.
- Prefer Server Components in `src/app`; add `"use client"` only for hooks, browser APIs, local state, or event handlers.
- Keep Client Components as small as possible. Do not pass unnecessary data from Server Components to Client Components.
- Fetch data on the server when possible. Avoid request waterfalls by starting independent async work early and using `Promise.all` for independent requests.
- Keep auth-sensitive server mutations protected with `getServerSession(authOptions)`.
- Do not trust client-submitted user IDs for ownership; derive ownership from the session.
- Keep Prisma schema changes paired with migrations and seed updates when relevant.
- Import Prisma runtime/types from `@prisma/generated`, not `@prisma/client`.
- Use the existing `@/*` import alias.
- Use local shadcn/Radix UI primitives from `src/components/ui` before adding new UI dependencies.
- Do not add new libraries unless requested or clearly justified by the existing project shape.
- Use Tailwind utilities for app styling. Do not add CSS modules or component-scoped stylesheet files; keep shared theme tokens in `src/app/globals.css`.
- Use mobile-first responsive Tailwind classes. Use `cn` from `src/lib/utils.ts` for conditional class names.
- Avoid inline styles unless a runtime dynamic value requires them.
- Define React components as arrow functions assigned to `const`; avoid `function` declarations for components.
- Keep components small and focused. Favor composition over abstraction and use descriptive prop names.
- Use early returns for invalid, loading, and empty states.
- Avoid unnecessary state. Derive values when possible, and do not use `useEffect` for derived state.
- Use `useEffect` only to synchronize with external systems. Do not overuse `useMemo` or `useCallback`; use them only for real stability or performance needs.
- Preserve strict TypeScript. Replace `any` with schema-derived or Prisma-backed types.
- Prefer explicit types at public boundaries. Prefer `interface` for object shapes and `type` for unions, primitives, utility types, and mapped types.
- Avoid TypeScript enums; prefer literal unions or const maps.
- Import React types directly with `import type`.
- Prefer Zod validation at request and form boundaries before passing data to Prisma.
- Treat route params, search params, cookies, headers, form data, and API responses as untrusted external input.
- Infer TypeScript types from Zod schemas when useful.
- Validate form mutations on the server. Add client-side validation for user experience, and show field-level errors where possible.
- For TanStack Query, keep query keys stable and include route/user identifiers when data is scoped.
- Avoid adding new state to Zustand unless it is truly shared client state; prefer server state through TanStack Query.
- Prefer URL state for shareable filters, tabs, search params, and pagination.
- Use semantic HTML first. Use buttons for actions and links for navigation.
- Provide accessible names for icon-only buttons, keep focus states visible, and associate labels with form controls.
- Do not add ARIA attributes when native HTML already provides the behavior.
- Handle invalid, empty, loading, and error states explicitly. Avoid exposing sensitive details to users.
- Never expose secrets to the client. Server-only secrets must not use `NEXT_PUBLIC_`; public client variables must use `NEXT_PUBLIC_`.
- Avoid `dangerouslySetInnerHTML`; sanitize first if it is truly required.
- Optimize performance only when it provides clear value: avoid unnecessary Client Components, reduce bundle size, lazy-load heavy non-critical UI, optimize images/fonts, and keep expensive work out of render paths.
- Avoid barrel imports when they increase bundle size. Import only what is needed.
- Use `Map` or `Set` for repeated lookups, and use pagination or virtualization for large lists when needed.
- Naming conventions: components and interfaces use `PascalCase`; variables, functions, and handlers use `camelCase`; booleans use prefixes such as `is`, `has`, or `can`; files and directories use `kebab-case`; use `UPPER_SNAKE_CASE` only for true constants.
- Remove temporary `console.log` calls when editing nearby code.
- Add comments only for non-obvious decisions or constraints.
- Do not commit generated `.next` output. Treat `generated/prisma` as Prisma client output and avoid manual edits there.
- Do not claim checks or tests were run unless they were actually run.

## Official Documentation

- React: https://react.dev/
- Next.js: https://nextjs.org/docs
- TypeScript: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://zustand.docs.pmnd.rs
- Zod: https://zod.dev
- TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview

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
