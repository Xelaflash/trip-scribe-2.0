# Trip Scribe MVP Completion Plan

## Summary

Build the MVP in four ordered phases: latest stable dependency upgrade, code-quality gate setup, warm travel utility redesign, then core trip-planning features. The MVP lets users sign in, manage trips, add itinerary items/notes/places, and publish read-only trip pages by slug.

## Phase 1: Dependency Upgrade

- Upgrade all dependencies to latest stable versions with `pnpm update --latest`, then fix breaking changes before feature work.
- Handle known high-risk migrations explicitly: Next 15 to 16, Prisma 6 to 7, TypeScript 5 to 6, Zod 3 to 4, ESLint 9 to 10, React 19.0 to 19.2, React Day Picker 9 to 10.
- Keep NextAuth on latest stable v4 unless `next-auth@latest` is stable v5 at implementation time; do not use beta auth packages for the MVP.
- Regenerate Prisma and verify `pnpm install`, `pnpm prisma generate`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`.

## Phase 2: Code Quality And Pre-Commit

- Add ESLint flat config inspired by the provided example, adapted for this Next/Tailwind repo.
- Add recommended quality plugins: `typescript-eslint`, `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-import`, `eslint-plugin-tailwindcss`, and `eslint-plugin-react-you-might-not-need-an-effect`.
- Add Prettier config plus scripts for `lint`, `lint:fix`, `format`, `format:check`, and `typecheck`.
- Set up Husky and lint-staged so pre-commit runs staged formatting/linting plus full `pnpm typecheck`.
- Do not run tests in pre-commit until the test runner is added.

## Phase 3: Design System

- Redesign around "warm travel utility": deep teal primary, orange action accents, off-white/neutral surfaces, readable text, and restrained map/travel details.
- Consolidate tokens in `globals.css` and Tailwind so shadcn/Radix components and custom CSS use one system.
- Redesign landing page, authenticated trip dashboard, trip detail page, create/edit dialogs, and public read-only trip page.
- Replace placeholder home content with real MVP copy.
- Use forms + lists for MVP editing.

## Phase 4: MVP Features

- Extend Prisma with `Trip.description`, plus `ItineraryItem`, `TripNote`, and `TripPlace` models owned through `Trip`.
- Add owner-protected trip CRUD with server-side unique slug generation and Zod validation.
- Create `/trips/[slug]` as the owner planning surface with Overview, Itinerary, Notes, and Places sections.
- Add read-only public sharing at `/share/[slug]`; private trips return not found for non-owners.
- Keep Route Handlers and TanStack Query for API/data flow.
- Fix sign-in redirect so authenticated users land on their trip dashboard.
- Replace missing `auto-form` usage with local React Hook Form + Zod forms.
- Remove temporary `any`, `console.log`, placeholder copy, and stale TODOs as nearby code is completed.
- Update `AGENTS.md` and README after the MVP shape changes.

## Test Plan

- Dependency/quality phase: `pnpm install`, `pnpm prisma generate`, `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, `pnpm build`.
- Pre-commit phase: verify Husky hook exists, `lint-staged` runs on staged files, and `pnpm typecheck` blocks bad commits.
- Database phase: create/apply Prisma migration, run seed data, verify generated Prisma types.
- Feature scenarios: owner can create/update/delete trips; non-owner cannot mutate; itinerary/notes/places CRUD works; private share URL is inaccessible; public share URL renders read-only.
- Add Playwright smoke tests for landing page, sign-in page, protected dashboard redirect, owner trip detail, and public trip page.

## Assumptions

- Store this plan at `docs/mvp-plan.md`.
- MVP scope is Core Trips: auth, dashboard, trip CRUD, trip detail, itinerary, notes, places, visibility, and read-only public sharing.
- Latest stable dependency upgrades happen before ESLint/Prettier/Husky setup.
- Every commit should run staged formatting/linting plus full TypeScript checking.
- No photo gallery, budget tracker, checklist, collaboration, invite editing, or full calendar board in this MVP.
- PostgreSQL, Prisma, pnpm, Next.js App Router, Tailwind, Radix/shadcn-style components, and NextAuth remain the foundation.
