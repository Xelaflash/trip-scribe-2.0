# Frontend Agent Guidance

Use this file when editing React, Next.js, TypeScript, styling, validation, or client/server data flow.

## React And Next.js

- Follow the user's requirements exactly. Ask for clarification when requirements are ambiguous, and do not guess when the answer is unknown.
- Prefer simple, complete, working solutions over clever abstractions. Apply DRY, KISS, YAGNI, and clean-code principles pragmatically.
- Keep Client Components as small as possible. Do not pass unnecessary data from Server Components to Client Components.
- Fetch data on the server when possible. Avoid request waterfalls by starting independent async work early and using `Promise.all` for independent requests.
- Use local shadcn/Radix UI primitives from `src/components/ui` before adding UI dependencies.
- Define React components as arrow functions assigned to `const`; avoid `function` declarations for components.
- Keep components small and focused. Favor composition over abstraction and use descriptive prop names.
- Use early returns for invalid, loading, and empty states.
- Avoid unnecessary state. Derive values when possible, and do not use `useEffect` for derived state.
- Use `useEffect` only to synchronize with external systems. Do not overuse `useMemo` or `useCallback`; use them only for real stability or performance needs.

## TypeScript

- Preserve strict TypeScript. Replace `any` with schema-derived or Prisma-backed types.
- Prefer explicit types at public boundaries.
- Prefer `interface` for object shapes and `type` for unions, primitives, utility types, and mapped types.
- Avoid TypeScript enums; prefer literal unions or const maps.
- Import React types directly with `import type`.

## Styling

- Use Tailwind utilities for app styling. Do not add CSS modules or component-scoped stylesheet files; keep shared theme tokens in `src/app/globals.css`.
- Use mobile-first responsive Tailwind classes.
- Use `cn` from `src/lib/utils.ts` for conditional class names.
- Avoid inline styles unless a runtime dynamic value requires them.

## State And Data

- Prefer Zod validation at request and form boundaries before passing data to Prisma.
- Treat route params, search params, cookies, headers, form data, and API responses as untrusted external input.
- Infer TypeScript types from Zod schemas when useful.
- Validate form mutations on the server. Add client-side validation for user experience, and show field-level errors where possible.
- For TanStack Query, keep query keys stable and include route/user identifiers when data is scoped.
- Avoid adding new state to Zustand unless it is truly shared client state; prefer server state through TanStack Query.
- Prefer URL state for shareable filters, tabs, search params, and pagination.

## Accessibility

- Use semantic HTML first.
- Use buttons for actions and links for navigation.
- Provide accessible names for icon-only buttons.
- Keep focus states visible.
- Associate labels with form controls.
- Do not add ARIA attributes when native HTML already provides the behavior.

## Security And Errors

- Handle invalid, empty, loading, and error states explicitly.
- Avoid exposing sensitive details to users.
- Never expose secrets to the client. Server-only secrets must not use `NEXT_PUBLIC_`; public client variables must use `NEXT_PUBLIC_`.
- Avoid `dangerouslySetInnerHTML`; sanitize first if it is truly required.

## Performance

- Optimize performance only when it provides clear value.
- Prioritize avoiding unnecessary Client Components, reducing bundle size, lazy-loading heavy non-critical UI, optimizing images/fonts, and keeping expensive work out of render paths.
- Avoid barrel imports when they increase bundle size. Import only what is needed.
- Use `Map` or `Set` for repeated lookups, and use pagination or virtualization for large lists when needed.

## Naming And Style

- Components and interfaces use `PascalCase`.
- Variables, functions, and handlers use `camelCase`.
- Boolean values use prefixes such as `is`, `has`, or `can`.
- Files and directories use `kebab-case`.
- Use `UPPER_SNAKE_CASE` only for true constants.
- Remove temporary `console.log` calls when editing nearby code.
- Add comments only for non-obvious decisions or constraints.

## Official Documentation

- React: https://react.dev/
- Next.js: https://nextjs.org/docs
- TypeScript: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://zustand.docs.pmnd.rs
- Zod: https://zod.dev
- TanStack Query: https://tanstack.com/query/latest/docs/framework/react/overview
