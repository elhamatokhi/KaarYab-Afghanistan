<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# KaarYab Afghanistan Project Conventions

## Purpose

KaarYab Afghanistan is a student capstone project for helping Afghan youth find
fictional demo opportunities during the first MVP phase. Keep the architecture
clear, conventional, and easy to explain.

## Commands

- `npm run dev` starts the local Next.js development server.
- `npm run lint` runs ESLint.
- `npm run build` verifies the production build.
- `npm run prisma:generate` generates the Prisma client.
- `npm run prisma:migrate -- --name init` creates and applies a local migration.
- `npm run prisma:seed` loads fictional demo opportunities.

## Architecture Notes

- Use the Next.js App Router under `src/app`.
- Use route handlers under `src/app/api` when the API is added.
- Use Prisma for PostgreSQL data access. The schema lives in `prisma/schema.prisma`.
- Import the generated Prisma client from `src/generated/prisma/client`.
- Keep UI components in `src/components`.
- Keep React context providers in `src/context`.
- Saved opportunities use browser `localStorage`; do not add authentication in the first MVP.

## Verification

Before handing off changes, run `npm run lint` and `npm run build`. If Prisma
schema changes, run `npm run prisma:generate`. Do not commit real credentials.
