# KaarYab Afghanistan

KaarYab Afghanistan is a capstone project foundation for an opportunity finder
serving Afghan youth. The application will eventually support browsing,
searching, filtering, saving, creating, editing, and deleting jobs,
internships, scholarships, online courses, remote work, training programs, and
volunteer opportunities.

Phase 1 intentionally contains only the project foundation, route placeholders,
theme support, Prisma schema, and fictional seed data.

## Technology Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Next.js Route Handlers for future API routes
- React Hook Form and Zod for future forms
- React Context with `localStorage` for saved opportunities
- `next-themes` for light and dark mode

## Local Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a local `.env` from `.env.example` and replace the placeholder with your
own PostgreSQL connection string:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Never commit real credentials.

## Prisma Commands

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

The seed script creates 12 clearly fictional demo opportunities with future
deadlines.

## Development Commands

```bash
npm run dev
npm run lint
npm run build
```

## Current Routes

- `/`
- `/opportunities`
- `/opportunities/[id]`
- `/opportunities/[id]/edit`
- `/add-opportunity`
- `/saved`
- `/dashboard`
- `/about`
- `/contact`
