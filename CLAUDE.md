# CLAUDE.md

You are working on **BooKeeper** — a marketplace mobile app that lets football teams book a goalkeeper on-demand.

## Before you code

1. Read [`SPEC.md`](./SPEC.md) at the root — it contains every non-negotiable product decision. If a new idea conflicts with it, flag it to the user; don't silently merge.
2. [`index.html`](./index.html) at the root is the **live marketing proto** served via GitHub Pages (https://superkostia.github.io/bookeeper/). It is NOT the web app. The real web app lives in `apps/web` (Next.js). Do not touch the proto unless the user asks — it's the current public landing page.

## Project layout

```
bookeeper/
├── index.html           ← live marketing proto (GitHub Pages), do not touch
├── SPEC.md              ← product spec, source of truth for decisions
├── CLAUDE.md            ← this file
├── apps/
│   ├── api/             ← NestJS + Fastify, REST, Prisma
│   ├── mobile/          ← Expo 52 + expo-router (iOS + Android)
│   └── web/             ← Next.js 15 (marketing + admin)
└── packages/
    ├── db/              ← Prisma schema + singleton client (API + web-admin only)
    ├── types/           ← Zod schemas + shared TS types (safe in any app)
    └── ui-tokens/       ← design tokens (colors, fonts) shared by mobile + web
```

**Import rules:**
- `packages/types` and `packages/ui-tokens` can be imported anywhere.
- `packages/db` must **never** be imported from `apps/mobile`. The mobile app talks to the DB only through the API.
- Always use the workspace name in imports (`@bookeeper/types`), never relative paths across workspaces.

## Tooling

- **Node 22** — pinned in `.nvmrc`. `nvm use` before anything.
- **pnpm 9** — do not use npm/yarn. `pnpm install` at the root.
- **Turborepo 2** — `pnpm dev` runs all dev servers in parallel.
- **TypeScript strict** — no `any`, no untyped imports.
- **Prettier** (100 cols, single quotes, trailing commas) + **ESLint flat config**.

## Commands (run from the repo root)

| Goal | Command |
|---|---|
| Install | `pnpm install` |
| Dev (everything) | `pnpm dev` |
| Dev (one app) | `pnpm dev --filter=@bookeeper/api` |
| Build | `pnpm build` |
| Typecheck | `pnpm typecheck` |
| Lint | `pnpm lint` |
| Format | `pnpm format` |
| DB: generate client | `pnpm -F @bookeeper/db generate` |
| DB: new migration | `pnpm -F @bookeeper/db migrate:dev --name <name>` |
| DB: Prisma Studio | `pnpm -F @bookeeper/db studio` |

## Environment

- API reads `apps/api/.env`. Copy from `.env.example` first. **Never commit `.env*`** (`.gitignore` covers this).
- Local Postgres + Redis: run `docker compose up -d` at the root (TODO: add `docker-compose.yml`).
- Secrets (Stripe, Twilio, JWT, Mapbox) live only in the API's `.env`. Mobile and web get their config at build time and never hold secrets.

## Non-negotiable decisions (from [SPEC.md](./SPEC.md))

Do not change these without explicit user approval:

1. **Commission**: 15 % on the keeper + 1,50 € flat fee on the client. **No subscription in MVP.**
2. **Payments**: Stripe Connect Express only. No cash, no off-platform transfers.
3. **Auth**: phone OTP via Twilio Verify. **No password login.**
4. **Mobile-first**: the user-facing product is the mobile app. `apps/web` is marketing + admin.
5. **IDF-only at launch**: the country/region gate is enforced server-side.
6. **Keepers set their own price, zone, and refusal policy**. This is load-bearing for the legal argument against URSSAF salariat requalification. Never add a feature where the platform imposes a price or forces an accept.
7. **No-show policy**: full refund + 10 € credit for the client; 1 strike for the keeper; 2 strikes = ban. Don't soften it.

## Code conventions

- **Validation**: every API endpoint validates input with Zod schemas from `@bookeeper/types`. Never trust the client.
- **Money**: always in **cents** (int) in DB and over the wire. Format only at the UI edge.
- **Dates**: `timestamptz` in Postgres, ISO-8601 strings on the wire. In code, use `Temporal` polyfill or Luxon — never raw `Date` across module boundaries.
- **Errors**: throw typed NestJS exceptions (`BadRequestException`, `NotFoundException`, …). Never return error strings with 200.
- **Copy**: all user-visible text is in **French**. English is only for code, logs, and commit messages.
- **Commits**: Conventional Commits, 50-char subject max, body wraps at 72. Co-authored-by tag for AI contributions.

## Definition of done (check before handing off)

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] If it touched the DB, a Prisma migration exists and `pnpm -F @bookeeper/db migrate:dev` runs clean
- [ ] If the public API shape changed, `packages/types` is updated
- [ ] If user-visible text was added, it's French and avoids generic AI phrasing

## Current state (2026-04-21)

- [x] Marketing proto live: https://superkostia.github.io/bookeeper/
- [x] Product spec: [SPEC.md](./SPEC.md)
- [x] Monorepo scaffolded (this commit)
- [ ] `docker-compose.yml` for local Postgres + Redis
- [ ] Initial Prisma migration (`init`)
- [ ] Twilio Verify + OTP signup flow (API + mobile)
- [ ] Stripe Connect Express onboarding for keepers
- [ ] Booking request → accept/decline flow end-to-end
- [ ] Replace static `index.html` with real Next.js marketing once `apps/web` is ready, then switch GH Pages off in favour of Vercel
- [ ] CGU/CGV drafted with avocat

## What to do next if the user says "go"

1. `pnpm install`, set up `apps/api/.env`, `docker compose up -d`.
2. Create initial Prisma migration from the schema in `packages/db/prisma/schema.prisma`.
3. Wire phone OTP endpoints in the API (`/auth/send-otp`, `/auth/verify-otp`) against Twilio Verify sandbox.
4. Build the signup/OTP screen in the mobile app hitting those endpoints.
5. Move on to keeper onboarding + Stripe Connect Express account creation.

## Things to explicitly NOT do

- Don't bolt on a new framework (tRPC, GraphQL, Remix, Svelte) without discussion. REST + Zod is enough for MVP.
- Don't add cash payment, p2p transfers, or any flow that moves money outside Stripe.
- Don't put business rules in the mobile app beyond what's needed for UX. The API is the source of truth.
- Don't write additional docs unless asked. SPEC.md + this file are the documentation.
- Don't touch `index.html` at the root unless the user specifically asks — it's publicly deployed.
