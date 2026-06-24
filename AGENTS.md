# Agent Instructions

Trip Scribe 2.0 is a Next.js travel-planning MVP for authenticated trip planning, itinerary/notes/places management, and read-only public trip sharing.

## Essentials

- Use `pnpm` for all package operations.
- Use Next.js App Router, React 19, strict TypeScript, Prisma 7, NextAuth 4, TanStack Query, Tailwind CSS 4, Radix/shadcn-style local components, React Hook Form, and Zod 4.
- Prefer Server Components in `src/app`; add `"use client"` only for hooks, browser APIs, local state, event handlers, or client-only libraries.
- Keep auth-sensitive server mutations protected with `getServerSession(authOptions)` and derive ownership from the session.
- Import Prisma runtime/types from `@prisma/generated`, not `@prisma/client`.
- Do not add new libraries unless requested or clearly justified by the existing project shape.
- Do not commit generated `.next` output. Treat `generated/prisma` as Prisma client output and avoid manual edits there.
- Do not claim checks or tests were run unless they were actually run.

## Project Guidance

- Frontend, TypeScript, accessibility, styling, state, validation, and performance conventions live in [docs/agent-guidance/frontend.md](docs/agent-guidance/frontend.md).
- MVP scope and phase plan live in [docs/mvp-plan.md](docs/mvp-plan.md).
- When the global `/vercel-react-best-practices` skill is available, apply it for React/Next.js components, pages, data fetching, performance review, and refactors. Do not vendor that global skill into this repo.

## Useful Commands

```bash
pnpm dev
pnpm lint
pnpm format:check
pnpm typecheck
pnpm prisma generate
pnpm prisma db seed
```

Run `pnpm build` only when explicitly requested.

## Environment

The app expects `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, Google OAuth variables, and SMTP/email variables.
