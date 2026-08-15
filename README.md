# KaarYab Afghanistan

KaarYab Afghanistan is a capstone opportunity finder for Afghan youth. It
supports public opportunity browsing, search, filters, details, multilingual UI,
authenticated user saves, and admin-only opportunity management.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- PostgreSQL on Neon
- Prisma ORM with generated client in `src/generated/prisma`
- Auth.js credentials authentication with Prisma-backed users
- React Hook Form and Zod
- `next-themes` for light, dark, and system themes

## Local Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run auth:provision-demo
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Use safe placeholders from `.env.example` and never commit `.env`.

Required:

- `DATABASE_URL`: pooled Neon connection for runtime queries.
- `DIRECT_URL`: direct Neon connection for Prisma migrations.
- `AUTH_SECRET`: strong Auth.js secret.
- `AUTH_URL`: local or production app URL.
- `NEXT_PUBLIC_SITE_URL`: canonical public site URL for metadata, sitemap, and robots.

Admin/demo provisioning:

- `INITIAL_ADMIN_NAME`
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `DEMO_USER_NAME`
- `DEMO_USER_EMAIL`
- `DEMO_USER_PASSWORD`
- `DEMO_ADMIN_NAME`
- `DEMO_ADMIN_EMAIL`
- `DEMO_ADMIN_PASSWORD`

For Neon with the Node `pg` adapter, use the pooler host for `DATABASE_URL`,
the direct host for `DIRECT_URL`, and `sslmode=verify-full`.

## Prisma

```bash
npm run prisma:generate
npm run prisma:migrate -- --name migration_name
npm run prisma:seed
npx prisma migrate status
```

The seed creates the fictional demo opportunities. Demo accounts are provisioned
separately:

```bash
npm run auth:provision-demo
npm run auth:provision-admin
```

## Verification

```bash
npm run test
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

## Vercel Deployment

Set all required environment variables in Vercel before building. The
`postinstall` script runs `prisma generate`, and the build runs
`next build --webpack`. Apply migrations from a trusted environment before
production traffic:

```bash
npm run prisma:migrate -- --name migration_name
```

Do not run seed or demo-account provisioning automatically in production unless
the deployment intentionally uses demo data.
