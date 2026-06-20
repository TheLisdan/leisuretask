# LeisureTask

LeisureTask is a time-budget task manager. It combines a focused todo list,
deadlines, task rewards and a countdown timer: finish work, earn minutes, then
spend that time intentionally.

The repository contains the original full-stack application and a static demo
mode that runs entirely in the browser.

## What It Does

- Create, edit, delete, complete, fail and reorder tasks.
- Assign each task a time reward.
- Track available leisure time as tasks are completed.
- Spend the earned balance with a countdown timer.
- Work with deadlines and overdue task states.
- Run a polished frontend-only demo without a database or backend services.

## Demo Mode

Demo mode is the fastest way to run the product locally. It uses mock data and
`localStorage`, so it does not need Postgres, Cloudinary, Sentry, Mixpanel,
Brevo or the backend server.

```bash
pnpm install
pnpm demo
```

Open:

```text
http://localhost:8000/demo
```

Build the static demo:

```bash
pnpm demo:build
```

Preview the static build:

```bash
pnpm demo:preview
```

## Deploy The Static App

Cloudflare Pages works well for the static Vite build.

```text
Build command: pnpm install --frozen-lockfile && pnpm demo:build
Build output directory: webapp/dist
Environment variable: VITE_APP_MODE=demo
```

SPA routing is handled by `webapp/public/_redirects`, so routes such as `/demo`
resolve to the client app.

## Full-Stack Mode

The full-stack app keeps the original architecture: React/Vite on the frontend,
Express/tRPC on the backend, Prisma/PostgreSQL for persistence, JWT auth, cron
jobs for deadlines, email templates and optional upload/analytics integrations.

### Requirements

- Node.js 22+
- pnpm 11+
- Docker or a local PostgreSQL instance

### Local Setup

```bash
pnpm install
cp backend/env.example backend/.env
cp webapp/env.example webapp/.env
```

Start PostgreSQL with Docker:

```bash
docker run --name leisuretask-postgres \
  -e POSTGRES_USER=leisuretask \
  -e POSTGRES_PASSWORD=leisuretask \
  -e POSTGRES_DB=leisuretask \
  -p 5432:5432 \
  -d postgres:16
```

Apply Prisma migrations:

```bash
pnpm b pmd
```

Start the full application:

```bash
pnpm dev
```

Local URLs:

- Frontend: `http://localhost:8000`
- Backend healthcheck: `http://localhost:3000/ping`
- tRPC playground: `http://localhost:3000/trpc-playground`

## Environment Modes

`VITE_APP_MODE` controls how the frontend boots.

```env
VITE_APP_MODE=demo
```

Demo mode keeps the landing page and `/demo` route fully static.

```env
VITE_APP_MODE=fullstack
VITE_BACKEND_TRPC_URL=http://localhost:3000/trpc
```

Full-stack mode routes authenticated app screens through tRPC and the backend
auth provider.

Optional integrations can stay empty during local development. Email delivery,
Sentry, Mixpanel and Cloudinary are only used when their corresponding keys are
configured.

## Architecture

```text
.
├── backend/   Express, tRPC, Prisma, auth, cron jobs, emails, uploads
├── shared/    Shared validation and utility helpers
└── webapp/    React, Vite, SCSS modules, tRPC client, static demo mode
```

The backend is organized around typed tRPC route modules instead of classic REST
controllers. Zod schemas live near their route handlers, while Prisma maps the
task and user domain to PostgreSQL.

The frontend has two paths:

- Public/demo routes that do not require backend access.
- Authenticated full-stack routes that use React Query and tRPC.

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `pnpm demo`         | Run the frontend-only demo locally |
| `pnpm demo:build`   | Build the static demo              |
| `pnpm demo:preview` | Preview the static build           |
| `pnpm dev`          | Run backend and frontend together  |
| `pnpm lint`         | Run ESLint across the workspace    |
| `pnpm typecheck`    | Run TypeScript checks              |
| `pnpm test`         | Run workspace tests                |
| `pnpm dcu`          | Run the Docker Compose environment |

Package aliases are available for focused work:

```bash
pnpm b <script>   # backend
pnpm w <script>   # webapp
pnpm sh <script>  # shared
```

## Quality Checks

Useful checks before publishing changes:

```bash
pnpm --filter @leisuretask/webapp lint
pnpm --filter @leisuretask/webapp stylelint
pnpm demo:build
```

For full-stack changes, also run:

```bash
pnpm typecheck
pnpm test
```

## Tech Stack

- React 18, Vite, TypeScript
- SCSS Modules
- Framer Motion
- React DnD
- tRPC, React Query, Zod
- Express, Passport JWT
- Prisma, PostgreSQL
- MJML email templates
- Cloudinary-ready upload flow
