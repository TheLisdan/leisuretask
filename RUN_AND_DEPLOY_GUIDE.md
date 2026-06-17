# LeisureTask: run and deploy guide

## Is it resume-ready?

Yes, but only after a live demo link and a small polish pass. The project is stronger than a generic todo app because it has a real full-stack architecture: tRPC, Prisma/Postgres, JWT auth, deadline jobs, emails, Cloudinary uploads, analytics, and a time-reward mechanic.

For a resume, the best version is:

- GitHub repo with a clean README and screenshots.
- Live demo URL.
- Short case description from `PROJECT_RESUME_BRIEF.md`.
- Optional demo account or a note that registration is open.
- A note that optional services like Sentry, Brevo, Cloudinary, and Mixpanel can be disabled for demo deploys.

## Local run

### 1. Requirements

- Node.js 22.x
- pnpm 11.x
- Docker, or a local PostgreSQL instance

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create env files

```bash
cp backend/env.example backend/.env
cp webapp/env.example webapp/.env
```

For a minimal local run, keep these defaults:

`backend/.env`

```env
PORT=3000
HOST_ENV=local
NODE_ENV=development
DATABASE_URL=postgresql://leisuretask:leisuretask@localhost:5432/leisuretask?schema=public
JWT_SECRET=local-jwt-secret
PASSWORD_SALT=local-password-salt
WEBAPP_URL=http://localhost:8000
DEBUG=leisuretask:*,-leisuretask:prisma:*,-leisuretask:trpc:query:success,-leisuretask:trpc:mutation:saveTime:success
```

`webapp/.env`

```env
PORT=8000
HOST_ENV=local
NODE_ENV=development
VITE_BACKEND_TRPC_URL=http://localhost:3000/trpc
VITE_WEBAPP_URL=http://localhost:8000
```

Cloudinary, Sentry, Brevo, and Mixpanel are optional. If Brevo variables are missing, emails are skipped. If Cloudinary variables are missing, avatar upload will not work, but the rest of the app can run.

### 4. Start PostgreSQL with Docker

```bash
docker run --name leisuretask-postgres \
  -e POSTGRES_USER=leisuretask \
  -e POSTGRES_PASSWORD=leisuretask \
  -e POSTGRES_DB=leisuretask \
  -p 5432:5432 \
  -d postgres:16
```

If the container already exists:

```bash
docker start leisuretask-postgres
```

### 5. Apply Prisma migrations

```bash
pnpm b pmd
```

### 6. Start the app

```bash
pnpm dev
```

Local URLs:

- Frontend: `http://localhost:8000`
- Backend healthcheck: `http://localhost:3000/ping`
- tRPC playground: `http://localhost:3000/trpc-playground`

## Free deploy recommendation

Recommended free demo stack:

- Render Free Web Service for the Node/Express app.
- Neon Free Postgres for the database.

Why this stack:

- The app is already built as an Express server that serves the built Vite frontend in production.
- Render can run a Node web service for free, but its free web service sleeps after 15 minutes without traffic.
- Render free Postgres expires after 30 days, so Neon is a better free database choice for a resume demo.
- Vercel Hobby is good for frontend/static apps, but this project needs a persistent Express backend and Prisma migrations.
- Railway is convenient, but long-term zero-cost use is less ideal: their Hobby plan has a $5 minimum usage model, while the free trial is time/credit limited.

Sources checked while preparing this guide:

- Render Free docs: https://render.com/docs/free
- Neon plans docs: https://neon.com/docs/introduction/plans
- Vercel Hobby docs: https://vercel.com/docs/plans/hobby
- Railway pricing: https://railway.com/pricing

## Deploy on Neon + Render

### 1. Create a Neon database

1. Create a free Neon project.
2. Copy the PostgreSQL connection string.
3. Prefer the pooled connection string for serverless-ish/free hosting.
4. Make sure the URL includes SSL, usually `?sslmode=require`.

Example:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require&schema=public
```

### 2. Create a Render web service

Option A: use `render.yaml`.

1. Push the repo to GitHub.
2. In Render, create a Blueprint from the repo.
3. Check `render.yaml`.
4. Fill the secret env vars.

Option B: create a Web Service manually.

Runtime: Node

Build command:

```bash
corepack enable && corepack prepare pnpm@11.5.1 --activate && pnpm install --frozen-lockfile && pnpm b pgc && pnpm b build && pnpm w build
```

Start command:

```bash
pnpm b pmp && pnpm b start
```

Healthcheck path:

```text
/ping
```

### 3. Render env vars

Required:

```env
NODE_ENV=production
HOST_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=generate-a-long-random-string
PASSWORD_SALT=generate-a-long-random-string
WEBAPP_URL=https://YOUR_RENDER_SERVICE.onrender.com
VITE_WEBAPP_URL=https://YOUR_RENDER_SERVICE.onrender.com
VITE_BACKEND_TRPC_URL=https://YOUR_RENDER_SERVICE.onrender.com/trpc
```

Optional:

```env
BREVO_API_KEY=
FROM_EMAIL_NAME=
FROM_EMAIL_ADDRESS=
BACKEND_SENTRY_DSN=
SOURCE_VERSION=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
VITE_WEBAPP_SENTRY_DSN=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_MIXPANEL_API_KEY=
SENTRY_AUTH_TOKEN=
```

If the Render service name is not `leisuretask`, update the three URL env vars and `render.yaml`.

### 4. First deploy checklist

1. Deploy service.
2. Open `/ping`; it should return `pong`.
3. Open `/trpc-playground`.
4. Open the root URL.
5. Register a user.
6. Create a task, complete it, check that available time increases.
7. Add the live URL to README and resume.

## Notes about free tiers

- Render Free Web Services sleep after idle time, so first request can be slow.
- Render Free Postgres is not good for this resume demo because it expires after 30 days.
- Neon Free is enough for a small demo database, but it has storage/compute/egress limits.
- Optional integrations can stay empty for a demo. Avatar upload requires Cloudinary keys.
