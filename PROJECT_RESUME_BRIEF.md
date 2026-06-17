# LeisureTask: project brief for resume/case generation

## 1. Short product description

LeisureTask is a full-stack task and leisure-time management application. The product combines a todo list, task deadlines, task rewards in time, and a timer that spends the earned time. Users can register, sign in, create and reorder tasks, mark tasks as completed or failed, earn available leisure time for completed tasks, start/stop a countdown timer, update profile data, upload avatars, and receive email reminders.

The project is organized as a pnpm workspace with separate backend, frontend, and shared packages:

- `backend`: Node.js/Express API, tRPC router, Prisma/PostgreSQL data layer, auth, cron jobs, email integration, Cloudinary upload signing.
- `webapp`: React/Vite frontend, routing, pages, reusable UI components, tRPC client, React Query cache, SCSS modules.
- `shared`: common utilities and validation helpers reused by both backend and frontend.

## 2. Project tree

```text
.
├── backend/
│   ├── package.json
│   └── src/
│       ├── index.ts                     # Express app entry point
│       ├── emails/                      # MJML email templates
│       │   ├── _footer.mjml
│       │   ├── _head.mjml
│       │   ├── _header.mjml
│       │   ├── tasksReminder.mjml
│       │   └── welcome.mjml
│       ├── lib/                         # Backend infrastructure
│       │   ├── brevo.ts                 # Brevo email API client
│       │   ├── cron.ts                  # Cron job registration
│       │   ├── ctx.ts                   # App context factory
│       │   ├── emails/                  # Email rendering/sending helpers
│       │   ├── env.ts                   # Zod env validation
│       │   ├── logger.ts                # Winston logger
│       │   ├── models.ts                # DB-to-client DTO mapping
│       │   ├── password.ts              # Passport JWT middleware
│       │   ├── prisma.ts                # Prisma client + query logging extension
│       │   ├── sentry.ts                # Sentry setup
│       │   ├── serveWebApp.ts           # Serving built frontend from Express
│       │   └── trpc.ts                  # tRPC init, context, middleware, playground
│       ├── prisma/
│       │   ├── schema.prisma            # PostgreSQL schema: User, Task, TaskStatus
│       │   └── migrations/              # Prisma migrations
│       ├── router/                      # tRPC route handlers instead of classic controllers
│       │   ├── index.ts                 # Root tRPC router
│       │   ├── auth/                    # Auth/profile routes
│       │   │   ├── signIn/
│       │   │   ├── signUp/
│       │   │   ├── getMe/
│       │   │   ├── changePassword/
│       │   │   ├── updateAvatar/
│       │   │   ├── updateEmail/
│       │   │   └── updateUserName/
│       │   ├── tasks/                   # Task CRUD, ordering, status changes
│       │   │   ├── createTask/
│       │   │   ├── deleteTask/
│       │   │   ├── getTasks/
│       │   │   ├── orderTasks/
│       │   │   ├── setTaskStatus/
│       │   │   └── updateTask/
│       │   ├── timer/                   # Timer persistence and activation
│       │   │   ├── saveTime/
│       │   │   └── toggleTimer/
│       │   ├── upload/
│       │   │   └── prepareCloudinaryUpload/
│       │   └── other/
│       │       └── getUser/
│       ├── scripts/
│       │   ├── checkDeadlines.ts        # Marks expired tasks as FAILED
│       │   └── remindTasks.ts           # Sends daily task reminder emails
│       ├── test/
│       └── utils/                       # JWT signing, password hashing, misc utilities
├── webapp/
│   ├── package.json
│   ├── assets/
│   ├── public/
│   └── src/
│       ├── main.tsx                     # React entry point
│       ├── App.tsx                      # Providers and React Router routes
│       ├── components/
│       │   ├── Avatar/
│       │   ├── Calendar/
│       │   ├── Checkbox/
│       │   ├── Dropdown/
│       │   ├── Form/                    # Formik-based forms and Cloudinary upload field
│       │   ├── Layout/
│       │   ├── Loader/
│       │   ├── Logo/
│       │   ├── Modal/
│       │   ├── PersistentSidebar/
│       │   ├── Timer/
│       │   └── TodoList/                # Task list, task cards, DnD wrapper, modal, sidebar
│       ├── i18n/
│       │   └── config.ts                # i18next setup
│       ├── lib/
│       │   ├── ctx.tsx                  # React context for current user
│       │   ├── env.ts                   # Public env validation
│       │   ├── mixpanel.tsx             # Analytics user tracking
│       │   ├── routes.ts                # Route builders
│       │   ├── sentry.tsx               # Frontend Sentry integration
│       │   ├── trpc.tsx                 # tRPC + React Query client
│       │   └── trpcTypes.ts             # Inferred tRPC types
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── SignInPage/
│       │   │   ├── SignOutPage/
│       │   │   └── SignUpPage/
│       │   ├── other/
│       │   │   ├── LandingPage/
│       │   │   └── NotFoundPage/
│       │   └── todolist/
│       │       └── TodoListPage/
│       └── styles/
│           ├── _mixins.scss
│           ├── _vars.scss
│           └── global.scss
├── shared/
│   ├── package.json
│   └── src/
│       ├── cloudinary.ts                # Shared Cloudinary upload presets/URL helpers
│       ├── env.ts
│       ├── getKeysAsArray.ts
│       ├── omit.ts
│       ├── pick.ts
│       └── zod.ts                       # Shared Zod validators
├── docker-compose.yml
├── Dockerfile
├── package.json                         # Root workspace scripts
├── pnpm-lock.yaml
└── README.md
```

There are no classic REST controllers in this codebase. Backend request handling is implemented as typed tRPC route modules under `backend/src/router/**/index.ts`, with each route colocated with its Zod input schema.

## 3. Dependencies

### Root `package.json`

Dependencies:

- `dotenv-cli`: `^8.0.0`
- `cross-env`: `^7.0.3`

Dev dependencies:

- `@types/jest`: `^29.5.14`
- `@types/node`: `^22.10.2`
- `@typescript-eslint/eslint-plugin`: `^8.19.0`
- `@typescript-eslint/parser`: `^8.19.0`
- `concurrently`: `^9.1.2`
- `copyfiles`: `^2.4.1`
- `eslint`: `^9.17.0`
- `eslint-plugin-import`: `^2.31.0`
- `eslint-plugin-jest`: `^28.11.0`
- `eslint-plugin-node`: `^11.1.0`
- `husky`: `^9.1.7`
- `jest`: `^29.7.0`
- `lint-staged`: `^15.3.0`
- `prettier`: `^3.4.2`
- `rimraf`: `^6.0.1`
- `ts-jest`: `^29.3.4`
- `ts-node`: `^10.9.2`
- `ts-node-dev`: `^2.0.0`
- `ts-patch`: `^3.3.0`
- `tsx`: `^4.19.2`
- `typescript`: `^5.7.2`
- `typescript-transform-paths`: `^3.5.5`

### Backend `backend/package.json`

Dependencies:

- `@leisuretask/shared`: `workspace:*`
- `@leisuretask/webapp`: `workspace:*`
- `@prisma/client`: `^6.6.0`
- `@sentry/node`: `^9.19.0`
- `@trpc/server`: `^10.45.2`
- `axios`: `^1.9.0`
- `cloudinary`: `^2.6.1`
- `cors`: `^2.8.5`
- `cron`: `^4.3.0`
- `debug`: `^4.4.0`
- `dotenv`: `^16.4.7`
- `express`: `^4.21.2`
- `fast-glob`: `^3.3.3`
- `handlebars`: `^4.7.8`
- `jsonwebtoken`: `^9.0.2`
- `lodash`: `^4.17.21`
- `mjml`: `^4.15.3`
- `passport`: `^0.7.0`
- `passport-jwt`: `^4.0.1`
- `picocolors`: `^1.1.1`
- `prisma`: `^6.7.0`
- `serialize-error`: `8.1.0`
- `superjson`: `^2.2.2`
- `triple-beam`: `^1.4.1`
- `trpc-playground`: `^1.0.4`
- `winston`: `^3.17.0`
- `yaml`: `^2.7.1`
- `zod`: `^3.24.1`

Dev dependencies:

- `@sentry/cli`: `^2.45.0`
- `@types/cors`: `^2.8.17`
- `@types/cron`: `^2.4.3`
- `@types/debug`: `^4.1.12`
- `@types/express`: `^5.0.0`
- `@types/jsonwebtoken`: `^9.0.9`
- `@types/lodash`: `^4.17.14`
- `@types/passport`: `^1.0.17`
- `@types/passport-jwt`: `^4.0.1`
- `@types/triple-beam`: `^1.3.5`
- `chokidar`: `^4.0.3`
- `shx`: `^0.4.0`
- `tsx`: `^3.0.0`

### Frontend `webapp/package.json`

Dependencies:

- `@leisuretask/backend`: `workspace:*`
- `@leisuretask/shared`: `workspace:*`
- `@radix-ui/react-dropdown-menu`: `^2.1.6`
- `@sentry/react`: `^9.19.0`
- `@tanstack/react-query`: `^4.35.3`
- `@trpc/client`: `^10.45.2`
- `@trpc/react-query`: `^10.45.2`
- `@trpc/server`: `^10.45.2`
- `classnames`: `^2.5.1`
- `date-fns`: `^4.1.0`
- `formik`: `^2.4.6`
- `formik-validator-zod`: `^2.0.1`
- `framer-motion`: `^12.4.7`
- `i18next`: `^25.2.1`
- `i18next-browser-languagedetector`: `^8.1.0`
- `i18next-http-backend`: `^3.0.2`
- `include-media`: `^2.0.0`
- `js-cookie`: `^3.0.5`
- `lodash`: `^4.17.21`
- `mixpanel-browser`: `^2.65.0`
- `react`: `^18.3.1`
- `react-dnd`: `^16.0.1`
- `react-dnd-html5-backend`: `^16.0.1`
- `react-dom`: `^18.3.1`
- `react-i18next`: `^15.5.2`
- `react-modal`: `^3.16.3`
- `react-router-dom`: `^7.1.1`
- `reset-css`: `^5.0.2`
- `sass`: `^1.83.1`
- `superjson`: `^2.2.2`
- `zod`: `^3.24.1`

Dev dependencies:

- `@sentry/vite-plugin`: `^3.4.0`
- `@types/js-cookie`: `^3.0.6`
- `@types/lodash`: `^4.17.14`
- `@types/mixpanel-browser`: `^2.60.0`
- `@types/react`: `^18.3.18`
- `@types/react-dom`: `^18.3.5`
- `@types/react-modal`: `^3.16.3`
- `@vitejs/plugin-legacy`: `^6.1.1`
- `@vitejs/plugin-react`: `^4.3.4`
- `autoprefixer`: `^10.4.21`
- `dotenv-cli`: `^8.0.0`
- `prettier`: `^3.4.2`
- `rollup-plugin-visualizer`: `^6.0.1`
- `stylelint`: `^16.13.2`
- `stylelint-config-prettier-scss`: `^1.0.0`
- `stylelint-config-standard-scss`: `^14.0.0`
- `typescript`: `^5.7.2`
- `vite`: `^6.0.5`

### Shared `shared/package.json`

Dependencies:

- `lodash`: `^4.17.21`
- `zod`: `^3.24.1`

Dev dependencies:

- `@types/lodash`: `^4.17.14`
- `@types/node`: `^22.10.3`

## 4. Backend architecture

The backend starts in `backend/src/index.ts`. It creates an Express application, enables CORS, exposes a `/ping` healthcheck, attaches JWT auth middleware, mounts the tRPC API at `/trpc`, enables `trpc-playground` at `/trpc-playground`, serves the built frontend in production, registers cron jobs, and adds centralized Express error logging.

The API layer uses tRPC rather than REST controllers. The root router is `backend/src/router/index.ts`; it composes route modules such as `signIn`, `signUp`, `getTasks`, `createTask`, `setTaskStatus`, `saveTime`, and `prepareCloudinaryUpload`. Each route is implemented as a tRPC procedure and most inputs are validated with Zod schemas stored next to the route in `input.ts` files.

`backend/src/lib/trpc.ts` creates the tRPC context. It injects the app context and the authenticated user into each procedure as `ctx.prisma` and `ctx.me`. It also adds request logging through `trpcLoggedProcedure`, serializes data with `superjson`, and marks expected domain errors through a custom error formatter.

## 5. Authentication

Authentication is JWT-based.

Main files:

- `backend/src/router/auth/signUp/index.ts`
- `backend/src/router/auth/signIn/index.ts`
- `backend/src/lib/password.ts`
- `backend/src/utils/signJWT.ts`
- `backend/src/utils/getPasswordHash.ts`
- `webapp/src/pages/auth/SignInPage/index.tsx`
- `webapp/src/pages/auth/SignUpPage/index.tsx`
- `webapp/src/pages/auth/SignOutPage/index.tsx`
- `webapp/src/lib/trpc.tsx`

Flow:

1. User signs up or signs in from the React app.
2. Frontend sends credentials through tRPC mutations `signUp` or `signIn`.
3. Backend validates input with Zod.
4. Passwords are hashed with SHA-256 plus `PASSWORD_SALT` in `getPasswordHash`.
5. On successful auth, backend signs a JWT with `jsonwebtoken`. The token payload is the user id, signed with `JWT_SECRET`.
6. Frontend stores the token in a browser cookie named `token` using `js-cookie`.
7. tRPC client reads `Cookies.get('token')` and sends it on every request as `Authorization: Bearer <token>`.
8. Backend middleware in `password.ts` uses `passport-jwt` with `ExtractJwt.fromAuthHeaderWithScheme('Bearer')`.
9. If the token is valid, Passport loads the user through Prisma and attaches it to `req.user`.
10. tRPC context exposes this authenticated user as `ctx.me`.

There are no server-side sessions. `passport.authenticate('jwt', { session: false })` is used, so the backend is stateless with respect to auth sessions. Logout is implemented on the frontend by removing the `token` cookie and invalidating the tRPC/React Query cache.

## 6. Database and ORM

The backend communicates with PostgreSQL through Prisma.

Main files:

- `backend/src/prisma/schema.prisma`
- `backend/src/lib/prisma.ts`
- `backend/src/lib/ctx.ts`
- `backend/src/router/**`

Database provider:

- `provider = "postgresql"`
- Connection URL comes from `DATABASE_URL`.

Data models:

- `User`
  - `id`, `name`, `email`, `passwordHash`, `avatar`, `createdAt`
  - timer fields: `avaiableTime`, `timerActive`, `lastTimerUpdate`
  - relation: `tasks`
- `Task`
  - `id`, `serialNumber`, `title`, `status`, `createdAt`, `userId`, `order`, `award`, `deadline`, `statusChangeAt`
  - relation: `user`
- `TaskStatus`
  - `IN_PROGRESS`
  - `COMPLETED`
  - `FAILED`

`backend/src/lib/prisma.ts` creates a Prisma Client and extends it with query-level logging. It logs low-level Prisma query events and high-level model operations with duration, args, model name, and operation name. Multi-step task operations use Prisma transactions, for example:

- completing a task and incrementing the user's available time;
- reordering multiple tasks after drag-and-drop.

## 7. Key backend modules

### Auth and profile

Routes under `backend/src/router/auth` handle registration, login, current user lookup, password change, email update, username update, and avatar update. `getMe` returns a safe DTO through `toClientMe`, exposing only fields needed by the frontend.

### Tasks

Routes under `backend/src/router/tasks` implement:

- `getTasks`: cursor-based pagination using `serialNumber` as cursor, sorted by `order` and `serialNumber`.
- `createTask`: creates an `IN_PROGRESS` task for the current user and stores reward time as seconds.
- `updateTask`: edits title, reward, and deadline, checking ownership.
- `deleteTask`: removes a user-owned task.
- `orderTasks`: updates task order after drag-and-drop using a Prisma transaction.
- `setTaskStatus`: marks a task as `COMPLETED`, `FAILED`, or `IN_PROGRESS`; on first completion it increments the user's available time by the task reward.

### Timer

Routes under `backend/src/router/timer` persist the leisure-time timer:

- `toggleTimer`: stores whether the timer is active and updates `lastTimerUpdate`.
- `saveTime`: persists remaining available time.

The frontend timer decrements locally every second while active and periodically persists the remaining time through the backend.

### Cron jobs

`backend/src/lib/cron.ts` registers two scheduled jobs:

- every minute: `checkDeadlines` finds overdue `IN_PROGRESS` tasks and marks them as `FAILED`;
- every day at 07:00: `remindTasks` sends reminder emails to users who still have in-progress tasks.

### Emails

Emails are written as MJML templates in `backend/src/emails`. Backend builds them to HTML and sends via Brevo. Implemented emails include:

- welcome email after signup;
- daily task reminder email.

### Cloudinary upload

Avatar uploads use a signed upload flow:

- backend route `prepareCloudinaryUpload` signs upload params with Cloudinary API secret;
- shared package defines upload type presets in `shared/src/cloudinary.ts`;
- frontend upload field requests prepared data, uploads image directly to Cloudinary, stores the returned public id, and then updates user avatar.

### Observability and production support

The project includes:

- Sentry integration for backend and frontend;
- Winston backend logging;
- Mixpanel frontend analytics;
- Docker and Docker Compose scripts;
- serving the built frontend through the Express backend in production;
- typed and validated environment variables through Zod.

## 8. Frontend architecture

The frontend starts in `webapp/src/main.tsx` and `webapp/src/App.tsx`.

Top-level providers:

- `TrpcProvider`: tRPC client and React Query `QueryClientProvider`;
- `AppContextProvider`: loads current user with `getMe` and exposes `me` through React Context;
- `BrowserRouter`: client-side routing;
- Sentry and Mixpanel user tracking components.

Routes:

- `/`: landing page;
- `/sign-up`: registration;
- `/sign-in`: login;
- `/sign-out`: logout;
- `/app/home`: authenticated main todo/timer page;
- `*`: not found.

UI is split into reusable components under `webapp/src/components`, page-level screens under `webapp/src/pages`, and styles as SCSS modules plus global SCSS variables/mixins.

## 9. Frontend state management

There is no Redux/MobX/Zustand store. State management is implemented with:

- React Query through `@tanstack/react-query`, integrated with tRPC;
- React Context for the current user;
- local React state through `useState`, `useEffect`, and custom hooks.

Main files:

- `webapp/src/lib/trpc.tsx`
- `webapp/src/lib/ctx.tsx`
- `webapp/src/components/TodoList/useTodoList.ts`
- `webapp/src/components/Timer/index.tsx`
- `webapp/src/components/TodoList/Task/index.tsx`

Server state:

- tRPC queries and mutations are cached by React Query.
- `getMe` stores the current user state in React Query cache and then exposes it through `AppContextProvider`.
- `getTasks` uses `useInfiniteQuery` for paginated task loading.
- Mutations invalidate related queries after changes, for example `getTasks.invalidate()` and `getMe.invalidate()`.

Local UI state:

- selected task;
- modal open/closed states;
- temporary task array for drag-and-drop ordering;
- form state through Formik;
- timer active/remaining-time state in the Timer component;
- sidebar widths and responsive UI flags.

Optimistic updates:

- task status changes use an optimistic React Query cache update in `Task/index.tsx`;
- on error, the previous `getTasks` infinite-query data is restored.

## 10. Important user flows

### Registration/login

The user fills a Formik form. Zod schemas imported from backend/shared code validate the form. The frontend calls a tRPC auth mutation, receives a JWT, stores it in the `token` cookie, invalidates the tRPC cache, identifies the user in Mixpanel, and navigates to `/app/home`.

### Creating and managing tasks

The main todo page loads tasks with `getTasks.useInfiniteQuery`. Users can create tasks with a title, reward time, and optional deadline. Tasks are displayed by status: in progress, completed, failed. Drag-and-drop uses `react-dnd`; after reordering, the frontend sends the new task id order to `orderTasks`.

### Completing tasks and earning time

When a user checks a task, frontend calls `setTaskStatus`. If the task has passed its deadline, it is marked as failed. Otherwise it can become completed. On the backend, the first completion increments the user's `avaiableTime` by the task reward. The frontend invalidates `getMe` so the Timer reflects the updated available time.

### Spending leisure time

The Timer component reads `avaiableTime` and `timerActive` from the current user. When started, it decrements locally once per second and periodically persists the remaining time through `saveTime`. `toggleTimer` persists whether the timer is active.

## 11. Resume/case highlights

Potential resume bullets generated from this project:

- Built a full-stack TypeScript productivity app with React, Vite, Express, tRPC, Prisma, and PostgreSQL in a pnpm monorepo.
- Designed a type-safe API layer with tRPC, shared Zod validation, inferred frontend types, and React Query caching.
- Implemented stateless JWT authentication with Passport-JWT, cookie-based token storage on the client, and authenticated tRPC context on the backend.
- Modeled users, tasks, task statuses, deadlines, task rewards, and timer state in PostgreSQL using Prisma migrations and Prisma Client.
- Implemented task CRUD, cursor pagination, drag-and-drop ordering, optimistic task status updates, and transactional reward-time updates.
- Built a time-reward mechanic where users earn leisure time for completed tasks and spend it through a persistent countdown timer.
- Added scheduled backend jobs for overdue deadline processing and daily task reminder emails.
- Integrated Cloudinary signed uploads for avatars, Brevo transactional emails, Sentry monitoring, Winston logging, and Mixpanel analytics.
- Structured the frontend into reusable React components, page modules, SCSS modules, i18next localization, and form validation with Formik/Zod.

## 12. Notes for the resume-writing model

This is a practical full-stack project rather than a simple CRUD demo. The strongest case-study angles are:

- type-safe full-stack architecture with tRPC and shared schemas;
- backend ownership checks and transactional task/time updates;
- product mechanic: completing tasks grants limited leisure time;
- React Query server-state management with optimistic updates;
- production-oriented integrations: Sentry, logging, email templates, Cloudinary, Docker.

