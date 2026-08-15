# KaarYab Afghanistan Roadmap

## Completed

- Next.js App Router foundation with TypeScript, Tailwind CSS, ESLint, and `src/`.
- Responsive application shell with navbar, footer, theme support, local fonts, and shared layout primitives.
- Prisma PostgreSQL foundation, schema, safe environment example, and centralized seed source.
- Typed opportunity constants, demo data, domain types, pure utilities, and Vitest tests.
- Reusable opportunity cards, listing grid, deadline status display, and empty state.
- Demo `/opportunities` listing page.
- Dynamic opportunity details page with metadata, not-found handling, requirements, tags, application sidebar, and related listings.
- Complete Home and About pages using existing demo data, constants, cards, and utilities.
- Complete Contact page with a local React Hook Form and Zod validation experience.
- URL-based opportunity search, filtering, sorting, result counts, and no-results states.
- Redux Toolkit saved-opportunities state with localStorage persistence, save buttons, and a complete Saved page.

## Remaining Implementation Order

1. Add React Hook Form and Zod schemas for create and edit forms.
2. Build the dashboard statistics view.
3. Add route loading, empty, error, and not-found states where still missing.
4. Create and verify Prisma migration and seed against PostgreSQL.
5. Add Next.js Route Handlers for opportunity CRUD.
6. Connect listing, detail, create, edit, and delete flows to PostgreSQL.
7. Add focused tests for forms, dashboard calculations, and CRUD boundaries.
8. Complete README deployment notes and deploy to Vercel with a production database.

## Continuous Requirements

- Keep changes small and reviewable; use Conventional Commit messages when committing.
- Preserve Server Components by default and keep Client Component boundaries small.
- Maintain responsive mobile, tablet, and desktop layouts.
- Support light, dark, and system themes for every new interface.
- Use semantic HTML, accessible labels, keyboard-friendly controls, and visible focus states.
- Keep demo data clearly labeled until real database-backed records are introduced.
- Run tests, lint, type-checking, and production build before handoff.
