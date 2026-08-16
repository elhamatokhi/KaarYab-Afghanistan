# KaarYab Afghanistan

KaarYab Afghanistan is an opportunity finder for Afghan youth. It helps students, graduates, and early-career users discover jobs, internships, scholarships, courses, training programs, remote work, and volunteer opportunities in one place. The project addresses the problem of opportunity information being scattered across many sources. Current opportunities are fictional demonstration records stored in PostgreSQL.

## Homepage Screenshot

![Homepage screenshot placeholder](docs/homepage-screenshot-placeholder.png)

## Live Demo

Live application: [Add deployed URL here]

## Main Features

- Opportunity browsing and Details pages
- Search, filtering, and sorting
- USER and ADMIN authentication
- Role-based authorization
- User-owned saved opportunities
- Admin Dashboard
- Add, Edit, and Delete opportunity management
- PostgreSQL with Prisma
- English, Dari, Pashto, and German interface
- RTL support for Dari and Pashto
- Light and dark themes
- Responsive design
- SEO metadata, sitemap, and robots configuration
- Validation and accessible interfaces

## User Roles

| Role | What the role can do |
| --- | --- |
| Visitor | Browse public pages, search and filter opportunities, view opportunity details, register, and log in. |
| Registered USER | Use public browsing features and save opportunities to their own account. |
| ADMIN | Access the dashboard and manage opportunities by adding, editing, and deleting records. |

## Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL / Neon
- Prisma
- Auth.js
- Redux Toolkit
- React Hook Form
- Zod
- Vitest
- Vercel

## Local Setup

1. Clone the repository.

   ```bash
   git clone <repository-url>
   cd KaarYab-Afghanistan
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Copy the environment template.

   ```bash
   cp .env.example .env
   ```

4. Configure the required environment variables in `.env`.

   Required database and app variables:

   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `AUTH_URL`
   - `NEXT_PUBLIC_SITE_URL`

   Admin and demo-account variables:

   - `INITIAL_ADMIN_NAME`
   - `INITIAL_ADMIN_EMAIL`
   - `INITIAL_ADMIN_PASSWORD`
   - `DEMO_USER_NAME`
   - `DEMO_USER_EMAIL`
   - `DEMO_USER_PASSWORD`
   - `DEMO_ADMIN_NAME`
   - `DEMO_ADMIN_EMAIL`
   - `DEMO_ADMIN_PASSWORD`

5. Generate Prisma Client.

   ```bash
   npm run prisma:generate
   ```

6. Apply migrations.

   ```bash
   npm run prisma:migrate
   ```

7. Seed demonstration opportunities.

   ```bash
   npm run prisma:seed
   ```

8. Provision demo accounts.

   ```bash
   npm run auth:provision-demo
   ```

   To provision a private initial admin account, use:

   ```bash
   npm run auth:provision-admin
   ```

9. Start the development server.

   ```bash
   npm run dev
   ```

## Testing

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

## Deployment

The application is designed to deploy on Vercel, with Neon providing hosted PostgreSQL. Configure the required environment variables in Vercel, keep database credentials private, and apply Prisma migrations before using the production database.

## Limitations

- Opportunity records are fictional demonstration data.
- External application links are disabled.
- Email verification, password reset, and OAuth are not implemented.
- Public demo Admin access is intended only for demonstration.

## Contributor

**Elhama Tokhi**
