# BooKeeper

Marketplace de gardiens de but à l'heure. Loisir, compétition, entraînement — tu réserves un keeper dispo près de chez toi.

🌐 **Proto en ligne :** https://superkostia.github.io/bookeeper/
📄 **Spec produit :** [SPEC.md](./SPEC.md)
🤖 **Guide dev (et Claude Code) :** [CLAUDE.md](./CLAUDE.md)

---

## Setup local

```bash
# Requis : Node 22, pnpm 9, Docker
nvm use
pnpm install
cp apps/api/.env.example apps/api/.env
docker compose up -d           # Postgres + Redis locaux (TODO: compose file)
pnpm -F @bookeeper/db migrate:dev --name init
pnpm dev
```

## Structure

```
apps/api       NestJS — API REST
apps/mobile    Expo — app iOS + Android
apps/web       Next.js — marketing + admin
packages/db    Prisma schema + client singleton
packages/types Zod schemas partagés
packages/ui-tokens Tokens design (couleurs, typos)
```

Voir [CLAUDE.md](./CLAUDE.md) pour les conventions et commandes.

## Licence

Propriétaire — © 2026 BooKeeper SAS.
