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
- Redux Toolkit saved-opportunities UI state with authenticated PostgreSQL-backed saves and a complete Saved page for USER accounts.
- Neon PostgreSQL migration and seed with Prisma-backed reads for Home, Opportunities, and Opportunity Details.
- Prisma-backed CRUD Route Handlers for opportunities with shared Zod validation. Mutation endpoints are unprotected until authentication is added in a later phase.
- Shared React Hook Form opportunity form connected to Add and Edit pages through the existing CRUD API.
- Prisma-backed dashboard with opportunity statistics, category distribution, upcoming deadlines, and delete management.
- Auth.js credentials authentication with Prisma-backed users, role-based authorization, and admin-only opportunity management.
- Role-specific navigation and controls for anonymous visitors, USER accounts, and ADMIN accounts.
- Cookie-backed multilingual UI for English, Dari, Pashto, and German with server-rendered language, direction, translated static UI, localized validation messages, and localized seeded demo records.
- Production-readiness documentation, sitemap, robots configuration, Vercel Prisma generation workflow, and Neon SSL-mode normalization for the Node PostgreSQL adapter.

## Remaining Implementation Order

1. Review all multilingual copy with fluent Dari, Pashto, and German speakers before production launch.
2. Add route loading, empty, error, and not-found states where still missing.
3. Add focused browser-level tests for authenticated form flows, saved-opportunity flows, dashboard interactions, and locale switching.
4. Deploy to Vercel with production environment variables after final manual QA.

## Continuous Requirements

- Keep changes small and reviewable; use Conventional Commit messages when committing.
- Preserve Server Components by default and keep Client Component boundaries small.
- Maintain responsive mobile, tablet, and desktop layouts.
- Support light, dark, and system themes for every new interface.
- Use semantic HTML, accessible labels, keyboard-friendly controls, and visible focus states.
- Keep demo data clearly labeled until real database-backed records are introduced.
- Run tests, lint, type-checking, and production build before handoff.
