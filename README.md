# Issue Tracker

A small organization issue tracker. An admin registers, creates an organization, adds members, and the team tracks issues with status, assignment, and comments.

## Features

- Admin registration with organization creation
- Admin/owner can add members (email + password) so they can sign in
- Organization roles: owner, admin, member
- Create, edit, delete issues
- Assign issues to org members
- Status tracking: Open, In Progress, Closed
- Comments on issues
- Dashboard with counts and charts

## Tech stack

- Next.js 16 App Router
- Better Auth (email/password, admin plugin, organization plugin)
- Prisma 7 + PostgreSQL
- Zod
- Resend (member welcome + password reset emails)
- shadcn/ui (sidebar, charts, table, forms)

## Architecture

```
Browser
  -> proxy.ts (cookie gate)
  -> App layout (validates session + active org)
  -> Server Actions (Zod -> Prisma)
  -> Postgres
Auth requests go to /api/auth/*
```

Issues and comments always belong to the active organization. Members only see data for that org.

## Setup

1. Install dependencies:

```bash
bun install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set `DATABASE_URL` to a Postgres connection string and generate `BETTER_AUTH_SECRET`:

```bash
openssl rand -base64 32
```

4. Generate the Prisma client and apply migrations:

```bash
bunx prisma generate
bunx prisma migrate dev
```

5. Reset the database and load demo users, members, and issues:

```bash
bun run db:reset
```

6. Start the app:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `BETTER_AUTH_SECRET` | Auth signing secret (32+ characters) |
| `BETTER_AUTH_URL` | Public app URL. Local: `http://localhost:3000`. Production: `https://<your-project>.vercel.app` |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM` | Optional. Defaults to `Issue Tracker <onboarding@resend.dev>` (Resend test sender; only delivers to your Resend account email). For real member email, verify a domain and set this to that address. |

## How to use it

Demo accounts (password for all: `Password123!`):

| Email | Role |
| --- | --- |
| `julia.r@example.org` | Owner |
| `marco.r@example.org` | Admin |
| `emma.t@example.net` | Member |
| `james.b@example.com` | Member |
| `oscar.d@example.net` | Member |

1. Sign in as Ava (`julia.r@example.org`) or register a new org.
2. Open **Members** to add more teammates (admins/owners only).
3. Create and manage issues from **Issues**. Dashboard shows counts and charts.

## API

There is no custom REST API for issues. Mutations use Next.js Server Actions.

Auth is handled by Better Auth:

- `GET/POST /api/auth/*`

Server actions:

- `app/actions/auth.ts` — register, login, create organization, password reset
- `app/actions/members.ts` — add/remove members
- `app/actions/issues.ts` — create/update/delete issues and comments

## Deployment

**Host:** [Vercel](https://vercel.com). This is a Next.js App Router app; Vercel detects `bun.lock` and builds with Bun.

**Live URL:** Add your production URL here after the first deploy, e.g. `https://issue-tracker-v1.vercel.app`.

**Approach:** Connect the GitHub repo and deploy from `main`. Each push to `main` creates a production deployment. Other branches get preview URLs. `bun run build` runs `prisma migrate deploy` then `next build`, so schema migrations apply before the app starts serving.

### Required services

| Service | What it is for |
| --- | --- |
| Vercel | Hosting, HTTPS, serverless functions |
| PostgreSQL | App data (Neon, Prisma Postgres, or another Vercel Marketplace Postgres). Use a pooled URL with `sslmode=require` |
| Resend | Member welcome and password-reset emails |

### First deploy

1. Push this repo to GitHub (`SwasthK/issue-tracker-v1` or a new repo).
2. In [Vercel](https://vercel.com/new), import the GitHub project. Framework: Next.js. Install/build commands can stay at the defaults (`bun install` / `bun run build`).
3. Create a Postgres database (Vercel Marketplace → Neon or Prisma Postgres) and copy the connection string.
4. Add environment variables for **Production** (and Preview if you want those deploys to work):

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | Postgres connection string |
   | `BETTER_AUTH_SECRET` | `openssl rand -base64 32` (use a new secret, not the local one) |
   | `BETTER_AUTH_URL` | `https://<your-project>.vercel.app` (no trailing slash) |
   | `RESEND_API_KEY` | Resend API key |
   | `RESEND_FROM` | Optional. Keep the default test sender, or a verified domain address |

5. Deploy. After the first production URL is assigned, set `BETTER_AUTH_URL` to that exact URL and redeploy if it was a placeholder.
6. Open the live URL, register the first admin, and create an organization.

`onboarding@resend.dev` is for testing and typically only delivers to the email on your Resend account. To email real members, add and verify a domain at [resend.com/domains](https://resend.com/domains) and set `RESEND_FROM`.

### Update the app

```bash
git push origin main
```

Vercel rebuilds production. Database changes go out with the same build via `prisma migrate deploy` as long as you committed a Prisma migration (`bunx prisma migrate dev` locally first).

To deploy from the CLI instead of Git:

```bash
npx vercel@latest
npx vercel@latest --prod
```

Set the same env vars with `npx vercel env add` (or the Vercel dashboard) before the first production deploy.
