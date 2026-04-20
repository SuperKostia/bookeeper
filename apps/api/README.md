# @bookeeper/api

NestJS + Fastify REST API. Runs on port 3001 by default.

## Dev

```bash
cp .env.example .env
pnpm -F @bookeeper/db generate    # generate Prisma client
pnpm -F @bookeeper/api dev
```

Health check: `curl http://localhost:3001/health`

## Structure

```
src/
├── main.ts            # bootstrap
├── app.module.ts      # root module
└── health/            # /health liveness endpoint
```

Modules to add (see [CLAUDE.md](../../CLAUDE.md) current state):
- `auth/` — Twilio Verify OTP + JWT
- `users/`, `keepers/`
- `bookings/` — create, accept, decline, cancel, complete
- `payments/` — Stripe Connect, payment intents, webhooks
- `reviews/`, `messages/`
