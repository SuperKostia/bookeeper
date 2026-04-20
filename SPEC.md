# BooKeeper — Cahier des charges

**Version :** 1.0
**Date :** avril 2026
**Owner :** Kostia (fondateur)
**Statut :** pré-build, décisions arrêtées

---

## 0. TL;DR

BooKeeper est un marketplace à la demande qui met en relation des **gardiens de but amateurs** avec des **équipes / clubs / organisateurs** qui ont besoin d'un gardien pour un match (loisir, compétition, entraînement, tournoi).

- **Modèle économique :** commission marketplace — **15 % prélevés sur le gardien** + **1,50 € de frais fixes côté client** par réservation.
- **Lancement :** Île-de-France (Paris + 92 + 93 + 94), cible 2 500+ clubs amateurs.
- **MVP :** iOS + Android (React Native / Expo) + site web, 12 semaines de dev.
- **Premier objectif :** 500 matches réservés au premier trimestre post-lancement.

---

## 1. Vision & positionnement

### 1.1 Problème résolu
Deux heures avant le coup d'envoi, le gardien titulaire se désiste. Groupes WhatsApp qui s'enflamment, coups de fil, forfait, match perdu 3-0 sur tapis vert. Le marché amateur n'a **aucune solution structurée** pour remplacer un gardien à la dernière minute.

### 1.2 Solution
Une app où :
1. Un organisateur de match cherche un gardien par zone / date / niveau / contexte.
2. Des gardiens vérifiés proposent leur dispo à leur tarif.
3. Réservation en un clic, paiement bloqué, assurance incluse, notation post-match.

### 1.3 Positionnement
**« Le Uber des gardiens de but amateurs. »** On ne fait rien d'autre. Pas de coachs, pas d'autres postes, pas de location de terrain. La focalisation est notre force.

### 1.4 Ce qu'on ne fait pas (explicitement)
- Pas d'organisation de matches (on ne fait pas Footclub, Urban Soccer).
- Pas de location de terrain.
- Pas d'autres postes (joueurs de champ) — peut-être en V2, jamais avant.
- Pas de marché pro (FFF, pros, semi-pros contractualisés).

---

## 2. Business model

### 2.1 Take rate
| Partie | Montant | Exemple (2h × 20€ = 40€) |
|---|---|---|
| Client paie | prix × durée + 1,50 € | 41,50 € |
| Gardien reçoit | prix × durée × 85 % | 34,00 € |
| BooKeeper perçoit | 15 % GMV + 1,50 € | 7,50 € |
| Frais Stripe (~1,6 %) | ~0,65 € | — |
| **Marge nette / booking** | **~6,85 €** | — |

### 2.2 Pas d'abonnement en MVP
Un abonnement freine l'adoption. Zéro frais d'inscription, zéro frais mensuel : le client ne paie **que s'il joue**. C'est notre promesse commerciale principale.

### 2.3 Plan Pro Club (V2 uniquement, pas MVP)
Pour les clubs qui réservent souvent (≥ 4 bookings/mois) :
- 49 €/mois flat.
- 0 % de commission plateforme (reversement intégral au keeper).
- Historique équipe, keepers favoris, facturation centralisée SIRET.
- Lancé seulement une fois qu'on a ≥ 200 clubs actifs récurrents.

### 2.4 Hypothèses financières
- **GMV year 1 :** 300 000 € (5 000 bookings × 60 € moyen)
- **Revenu year 1 :** 45 000 €
- **Marge nette year 1 :** ~35 000 €
- **Break-even opérationnel :** ~2 500 bookings/mois (mois 18 projeté)

---

## 3. Utilisateurs

### 3.1 Personas

**A. Capitaine Karim** — 31 ans, joue en R2 avec son équipe de pote.
- *Pain :* gardien titulaire blessé, 3 matches sur 10 à galérer.
- *Gain :* trouve un keeper en 2h, paie 40 €, équipe joue.
- *Fréquence :* 3-6 bookings / saison.

**B. Coach Thomas** — 42 ans, entraîneur équipe senior D3.
- *Pain :* besoin d'un vrai gardien pour les séances d'entraînement tirs au but.
- *Gain :* réserve un keeper 2h tous les jeudis, budget club.
- *Fréquence :* 10-20 bookings / saison.

**C. Gardien Yanis** — 27 ans, R1, étudiant / salarié.
- *Pain :* veut jouer plus, arrondir ses fins de mois (150-400 €/mois).
- *Gain :* fixe son tarif 20 €/h, accepte ce qu'il veut, touche sous 7j.
- *Fréquence :* 4-12 bookings / mois.

**D. Vétéran Diego** — 38 ans, ex-semi-pro, reconverti.
- *Pain :* kiffe jouer mais plus dans un club régulier.
- *Gain :* joue 1-3 matches par weekend, coach sur le côté, 35 €/h.
- *Fréquence :* 8-15 bookings / mois.

### 3.2 Côté offre (keepers) — segmentation
- **Tier 1 : Juniors (18-25)** → tarifs 10-15 €/h, volume, disponibilité forte.
- **Tier 2 : Adultes niveau amateur confirmé (R1-R2)** → 15-25 €/h, cœur de marché.
- **Tier 3 : Vétérans / ex-pros** → 25-50 €/h, premium, badge « Expert ».

### 3.3 Côté demande — segmentation
- **Clubs amateurs compétition** (60 % du GMV visé) — R1 à D5, panier moyen 40-60 €.
- **Foot loisir / entreprise** (25 %) — panier 20-30 €.
- **Tournois & événements** (10 %) — panier 80-200 €.
- **Particuliers / entraînements persos** (5 %) — panier 15-25 €.

---

## 4. Périmètre fonctionnel

### 4.1 MVP (lancement mois 3-4)

**Onboarding & auth**
- Création compte par **OTP SMS** (Twilio Verify).
- Choix du rôle : « Je cherche un gardien » / « Je suis gardien ».
- Un même user peut avoir les deux rôles.

**Côté client (cherche un keeper)**
- Recherche par : zone (adresse / GPS), date, créneau horaire, durée, contexte (Loisir / Compétition / Entraînement / Tournoi), niveau (Loisir / Départemental / Régional / National).
- Liste triée par distance, note, tarif.
- Profil keeper : photo, bio, stats, tarif/h, zones, avis, badges (Vérifié, Vétéran, Top 5%).
- Demande de réservation avec message libre (100 chars).
- Paiement bloqué (pre-auth Stripe).
- Notification push + SMS quand keeper accepte / refuse / délai expire.
- Chat 1-1 débloqué après acceptation.
- Notation + commentaire post-match (obligatoire sous 48h).

**Côté keeper**
- Profil : photo, bio, tarif/h, zones de déplacement (max 3), niveaux acceptés, jours/créneaux dispos récurrents.
- Vérification d'identité via Stripe Connect KYC.
- Vérification photo/vidéo manuelle (1 arrêt vidéo sur terrain) pour badge « Vérifié ».
- Liste des demandes entrantes (notification push).
- Boutons Accepter / Refuser (délai 2h sinon auto-refus).
- Agenda des matches confirmés.
- Revenus : balance courante, historique, virement hebdo automatique (Stripe Connect Express).

**Admin (back-office interne)**
- Dashboard bookings live + alertes (no-show, litiges).
- Modération profils keepers (validation manuelle badge Vérifié).
- Gestion remboursements, litiges, bannissements.
- Export comptable mensuel.

### 4.2 V1.5 (mois 6-9)
- Disponibilités récurrentes côté keeper (calendrier hebdo).
- « Keepers favoris » sauvegardés par équipe.
- Historique équipe (rebook en 1 tap).
- Demandes groupées (plusieurs matches d'un tournoi en un coup).
- Parrainage : 10 € de crédit pour chaque nouveau keeper/client parrainé.

### 4.3 V2 (mois 12+)
- Plan Pro Club (voir §2.3).
- Vidéos highlights dans les profils keepers.
- Étapes additionnelles : coachs spécifiques gardien.
- Expansion internationale (Belgique, Suisse francophones d'abord).

### 4.4 Explicitement **hors scope** MVP
- Paiement en espèces (jamais).
- Bookings sans paiement en amont (jamais).
- Matching automatique (on laisse le client choisir).
- Messagerie riche (photos, fichiers). Texte uniquement en MVP.
- Application desktop complète (le back office admin suffit en MVP).

---

## 5. Parcours utilisateur clés

### 5.1 Réservation (chemin heureux)
```
Client → recherche (zone + date) → liste 5 keepers → choisit Yanis
     → message + confirmation → Stripe pré-autorise 40 € sur CB
     → notif push à Yanis « Nouvelle demande, 36 €, 2h samedi »
     → Yanis clique Accepter → chat 1-1 débloqué
     → samedi 18h30 match joué
     → client note Yanis 5★ dans l'app
     → Stripe capture les 40 €, verse 34 € à Yanis (batch hebdo)
     → BooKeeper conserve 6 € + 1,50 € frais fixes
```

### 5.2 Edge cases critiques
- **Keeper ne répond pas sous 2h** → auto-refus, client peut relancer un autre keeper sans re-payer.
- **Keeper no-show le jour J** → client déclenche « pas venu » dans l'app, remboursement full + 10 € de crédit, 1er strike pour le keeper.
- **2e no-show keeper** → compte banni, virement des gains en attente annulé.
- **Client annule > 12h avant** → remboursement 100 %, keeper touche 0.
- **Client annule < 12h avant** → 50 % pour le keeper (compensation), 50 % remboursé.
- **Client annule le jour J < 2h** → keeper touche 100 %.
- **Litige sur la qualité / comportement** → ticket ops, humain tranche sous 48h.

---

## 6. Architecture technique

### 6.1 Stack choisie

| Couche | Techno | Pourquoi |
|---|---|---|
| Mobile | **React Native + Expo SDK 52** | Un seul codebase iOS/Android, OTA updates, EAS Build |
| UI kit mobile | **Tamagui** | Perfs natives, theming, accessible |
| Web (landing + admin) | **Next.js 15** (App Router) | SSR pour SEO, même éco-système React |
| API | **NestJS** (Node 22 LTS, TypeScript) | Modulaire, DI, bien cadré équipe |
| Auth | **Phone OTP via Twilio Verify** + JWT maison | Pas de mot de passe, anti-fraude |
| DB | **PostgreSQL 16** + **PostGIS** | Geo-queries natives (rayons km) |
| ORM | **Prisma** | DX, migrations, type-safe |
| Cache / queue | **Redis** + **BullMQ** | Notifications async, rate limit |
| Search | **PostGIS + tsvector** en MVP ; Typesense en V1.5 si besoin | Éviter un service externe tôt |
| Paiement | **Stripe Connect** (Express) | KYC, split, virements automatiques |
| Notifs push | **Expo Push Notifications** | Free, intégré Expo |
| SMS | **Twilio** | Verify + transactionnel |
| Maps | **Mapbox GL** | Moins cher que Google Maps, plus joli |
| Storage fichiers | **Cloudflare R2** | S3-compatible, 10× moins cher |
| Analytics produit | **PostHog Cloud EU** | Open-source, RGPD, funnels |
| Error tracking | **Sentry** | Standard |
| Logs / metrics | **Better Stack** | Simple, cheap |
| Infra API | **Railway** (MVP) → **Fly.io** (scale) | Déploiement git-push, DB managed |
| Infra web | **Vercel** | Next.js natif |
| CI/CD | **GitHub Actions** + **EAS Submit** | Builds mobile auto |

### 6.2 Architecture logique
```
                     ┌──────────────┐
                     │   Mobile     │ React Native / Expo
                     │ (iOS + And)  │
                     └──────┬───────┘
                            │ REST + WebSocket
                  ┌─────────┴──────────┐
                  │    API NestJS      │ ── Sentry, PostHog
                  │   (monorepo core)  │
                  └─┬──────┬──────┬────┘
                    │      │      │
           ┌────────┘      │      └─────────┐
           │               │                │
      ┌────▼────┐   ┌──────▼──────┐   ┌────▼──────┐
      │Postgres │   │    Redis    │   │  Stripe   │
      │+PostGIS │   │  + BullMQ   │   │  Connect  │
      └─────────┘   └─────────────┘   └───────────┘

      Services externes : Twilio (SMS), Mapbox, Cloudflare R2, Expo Push
```

### 6.3 Data model principal (simplifié)

```sql
users (
  id uuid pk, phone varchar unique, email varchar,
  role enum('client','keeper','both'), created_at, banned_at
)

keeper_profiles (
  user_id uuid pk/fk → users,
  display_name, photo_url, bio,
  hourly_rate_cents int,
  levels text[], -- ['R1','R2','National']
  verified_at timestamptz, badges text[],
  home_point geography(POINT),  -- PostGIS
  travel_radius_km int default 15,
  stripe_account_id varchar
)

availabilities (
  id, keeper_id fk,
  kind enum('recurring','one_off'),
  day_of_week int nullable, -- si recurring
  date_start timestamptz, date_end timestamptz, -- si one_off
  created_at
)

bookings (
  id uuid pk, client_id fk, keeper_id fk,
  starts_at timestamptz, duration_minutes int,
  location_point geography(POINT), location_text,
  context enum('loisir','competition','training','tournament'),
  level varchar,
  hourly_rate_cents int, service_fee_cents int, total_cents int,
  status enum('pending','accepted','declined','expired',
              'cancelled_client','cancelled_keeper',
              'completed','disputed'),
  stripe_payment_intent_id varchar,
  created_at, accepted_at, completed_at
)

reviews (
  id, booking_id unique fk, author_id fk, target_id fk,
  rating int (1-5), comment text, created_at
)

messages (
  id, booking_id fk, sender_id fk, body text, created_at
)

payouts (
  id, keeper_id fk, amount_cents int,
  stripe_transfer_id varchar, status, paid_at
)

disputes (
  id, booking_id fk, opened_by fk, reason, resolution, resolved_at
)
```

### 6.4 APIs clés (REST / tRPC)
- `POST /auth/send-otp`, `POST /auth/verify-otp`
- `GET /keepers/search?lat&lng&date&duration&context&level`
- `GET /keepers/:id`
- `POST /bookings` (crée + pre-auth Stripe)
- `POST /bookings/:id/accept` / `/decline`
- `POST /bookings/:id/cancel`
- `POST /bookings/:id/complete` (client confirme que le match a eu lieu)
- `POST /reviews`
- `GET /me/bookings`, `GET /me/earnings` (keeper)
- `POST /webhooks/stripe`

### 6.5 Sécurité
- **HTTPS partout**, HSTS.
- **Rate limiting** par IP et par user (Redis).
- **OTP SMS** anti-brute-force (3 tentatives / 15 min).
- **Chiffrement au repos** (Postgres TDE chez l'hébergeur).
- **PII** : chiffrement appli-niveau des téléphones en DB (utilisateurs bannis).
- **Secrets** : Railway / Vercel secrets, pas de .env committé.
- **Stripe** : PCI-DSS géré par Stripe, on ne touche jamais aux numéros CB.
- **OWASP Top 10** audit avant lancement public.

### 6.6 Observabilité
- **Sentry** : erreurs front + back.
- **PostHog** : funnels produits (signup → 1ère recherche → 1er booking → 1er match joué).
- **Better Stack** : uptime, latence API, alertes Slack en cas de p95 > 500ms.
- **Logs Stripe** : webhooks monitored, retry automatique si échec.

---

## 7. Design system & DA

Cf. prototype HTML. Résumé pour build mobile/web :

- **Palette** : `cream #ECE4D0` · `pitch #0E2B1A` · `volt #D4FF00` · `clay #DB5D2A` · `ink #0A0A0A`
- **Typo** : Anton (display jersey) × Instrument Serif italic (éditorial) × Onest (UI) × JetBrains Mono (data/stats)
- **Signatures visuelles** :
  - Dos de maillot (N° + nom stencil) comme identité forte gardien
  - Lignes de craie / chalk pour marquer le terrain
  - Grain papier crème sur tous les fonds clairs
  - Jaune volt réservé aux CTAs et aux highlights (jamais fond large)
- **Tokens design** : exportés en Tamagui theme (mobile) + CSS custom properties (web) depuis une même source JSON.

---

## 8. Flux financier & paiements

### 8.1 Flow détaillé (Stripe Connect Express)
```
1. Client crée booking → PaymentIntent.create avec transfer_group
   → capture_method: 'manual' (autorisation seulement)
2. Keeper accepte → rien côté Stripe, just état DB
3. Client ou keeper marque match « joué » → BooKeeper capture le PI
4. Batch quotidien 2h du matin :
   - Pour chaque booking « completed » depuis la veille :
     - Transfer de (total - commission) au compte keeper (Express)
   - Virement auto de Stripe vers IBAN keeper chaque lundi
5. BooKeeper récupère sa commission au 15 du mois suivant (Stripe Payout)
```

### 8.2 TVA & fiscalité
- **Plateforme (SASU) :** TVA 20 % sur les 7,50 € de commission. Déclaration mensuelle.
- **Keepers** : auto-entrepreneurs, exonérés TVA sous 36 800 € CA. La plateforme **ne collecte pas** la TVA des keepers pour eux (chacun son statut).
- **Facture plateforme → keeper** : note de commission chaque mois.
- **Reporting URSSAF** : obligation DAC7 (déclaration annuelle des revenus des vendeurs) depuis 2024 → Stripe Connect le gère en natif.

### 8.3 Remboursements
- Remboursement automatique déclenché par l'app sur les edge cases §5.2.
- Temps de réapparition sur le CB client : 5-7 jours ouvrés.

---

## 9. Legal & conformité

### 9.1 Structure juridique
- **BooKeeper SAS** au capital de 1 000 € (fondateur + options pour CTO futur).
- Siège : domicilié chez le fondateur la 1ère année.
- SIRET → ouverture compte Qonto → accès Stripe France.

### 9.2 Statut des keepers
- **Auto-entrepreneurs (micro-BIC prestations de services).**
- Onboarding : au moment de la 1ère accept, la plateforme envoie un mail type « tu dois être auto-entrepreneur ; voici comment en 5 min ».
- Seuil CA micro 2026 : 77 700 €. Au-dessus → on demande passage en SASU ou autre.
- **La plateforme n'est pas l'employeur.** Les keepers fixent prix, dispo, refusent librement. Argument juridique standard marketplace (cf. Deliveroo mais *pas* Uber en France — analyse à faire par avocat).

### 9.3 Assurance
- **Contrat collectif responsabilité civile terrain + dommages corporels keeper** avec MAIF ou Hiscox.
- Coût estimé : **2,50 €/booking**, absorbé par la commission plateforme.
- Couverture : blessure keeper en match, dommages infligés par le keeper (sur but, supporter, etc.).
- Exclusions : comportements intentionnels, matchs officiels FFF (la FFF couvre ses licenciés).

### 9.4 Docs juridiques obligatoires
- **CGU** (utilisateurs)
- **CGV** (contractuel : comment se déroule un booking, annulation, remboursement)
- **Politique de confidentialité** (RGPD)
- **Charte modération** (ce qu'on supprime : avis injurieux, photos inappropriées)
- **Mentions légales**

**Budget legal :** avocat spécialisé marketplace/digital → **2 500-4 000 € forfait**.

### 9.5 RGPD
- Base légale de traitement : exécution du contrat + intérêt légitime (fraude).
- Hébergement UE (Railway offre Frankfurt ; Cloudflare R2 EU ; PostHog EU).
- Droits RGPD : export + suppression compte en 1 clic dans l'app.
- DPO externe à la demande (pas nécessaire en MVP, seuil à 250+ employés ou fichier sensible ; on est en dessous).

### 9.6 CNIL
- Pas de déclaration préalable nécessaire depuis 2018. Tenue d'un **registre des traitements** obligatoire. Template CNIL.

### 9.7 Conditions de modération
- Bannissement immédiat pour : no-show 2×, propos injurieux en chat, faux profil, signalé pour violence.
- Appel possible sous 14 jours, revue humaine.

---

## 10. Go-to-market

### 10.1 Acquisition pré-lancement (mois 0-3)
**Objectif : 200 keepers inscrits IDF avant le D-day.**
- Partenariats avec **5 clubs amateurs phares** Paris/93 : ils relaient dans leur club.
- **Posts groupes Facebook** : « Gardiens Île-de-France », « Foot amateur Paris ».
- **Instagram organique** : compte @bookeeper.fr, reels « le gardien qui change tout » avec vrais gardiens test.
- **Affiches terrains municipaux** : stickers QR code.
- **Bounty keepers early** : 50 € de bonus à chaque keeper qui fait 3 bookings dans les 2 premiers mois après lancement.

### 10.2 Lancement (mois 4)
- **Soft launch** : closed beta 50 clubs, 3 semaines, feedback loop serré.
- **Open launch** : article presse (L'Équipe, 20 Minutes, Foot Amateur), event IRL dans un stade / complexe Urban.
- **Google Ads** : « remplaçant gardien de but » + géo IDF, budget 2 000 €/mois.
- **Meta Ads** : lookalike sur audience captains de clubs amateurs, budget 3 000 €/mois.
- **Partenariat gros médias foot amateur** (Foot-National, Foot Amateur FFF) : contenus sponsorisés.

### 10.3 Croissance (mois 5-12)
- **Référencement SEO** : 100 pages « gardien de but [ville] » pour chaque commune IDF → capte le search.
- **Programme parrainage** : voir §4.2.
- **Expansion géographique** : Lyon mois 9, Marseille & Lille mois 12. Play IDF encore à 80 % du GMV à ce stade.

### 10.4 CAC cible
- Acquisition payante : **25 € / client actif**.
- Breakeven sur le 4ᵉ booking du client.
- LTV 3 ans estimée : 90 €. **LTV/CAC = 3.6** → sain.

---

## 11. Roadmap & phasing

| Phase | Mois | Livrable | Budget |
|---|---|---|---|
| 0 — Setup | M0 | SAS créée, stack bootstrap, design system, maquettes Figma complètes | 5 k€ |
| 1 — MVP | M1-M3 | Mobile + API + admin, Stripe Connect en sandbox, 10 keepers test | 60 k€ |
| 2 — Closed beta | M4 | Lancement 50 clubs, 100 keepers, vrai Stripe, premières reviews | 10 k€ |
| 3 — Open launch IDF | M5-M6 | Ads, presse, assurance active, objectif 500 bookings / mois | 25 k€ |
| 4 — V1.5 | M7-M9 | Dispos récurrentes, keepers favoris, parrainage, 1500 bookings/mois | 30 k€ |
| 5 — Expansion Lyon | M10 | Onboarding 300 keepers Rhône, launch régional | 15 k€ |
| 6 — V2 Pro Club | M12 | Offre B2B clubs, facturation centralisée | 20 k€ |

**Budget MVP jusqu'au launch ouvert :** **~100 000 €** si le fondateur est dev + un freelance, **~180 000 €** si full externalisé.

---

## 12. Équipe minimale

### Pré-lancement
- **Fondateur / CEO** (Kostia) — produit, business, GTM, partenariats.
- **CTO / lead dev** (à recruter, equity + petit salaire) — mobile + API.
- **Freelance designer** (1 mois, 8 k€) — refine design system.
- **Avocat** (forfait ponctuel).

### Post-lancement (mois 6)
- **1 dev full-stack** supplémentaire.
- **1 ops community manager** mi-temps (modération, support, acquisition keepers).

---

## 13. KPIs & metrics

### 13.1 North Star Metric
**Nombre de matches joués par semaine.** (Pas le nombre de signups, pas le GMV — les matches *effectivement joués* sont ce qui crée la valeur.)

### 13.2 Funnels suivis
```
Signup client → 1ère recherche → 1ère demande → acceptée → match joué → 2ᵉ booking
```
Target cumulatif : 40 % signup → match joué, 35 % rebook sous 90 jours.

### 13.3 Dashboard hebdo
- GMV
- Matches joués
- Nouveaux keepers validés
- Taux d'acceptation keeper (cible > 70 %)
- Note moyenne bookings (cible > 4.7★)
- No-shows (cible < 1 %)
- NPS client mensuel (cible > 40)

---

## 14. Risques & mitigations

| Risque | Prob. | Impact | Mitigation |
|---|---|---|---|
| Liquidité marché (pas assez keepers) | Haute | Critique | Bounty keepers, partenariats clubs pré-lancement |
| No-show keeper le jour J | Moyenne | Haute | Caution, 2-strikes, remplacement urgent via alerte push large |
| Requalification keeper → salarié (URSSAF) | Faible | Critique | Architecture juridique stricte (keepers fixent tout), avocat |
| Blessure keeper en match loisir | Moyenne | Haute | Assurance collective obligatoire, inclue dans le prix |
| Fraude (faux profils) | Moyenne | Moyenne | KYC Stripe + vérif manuelle photo/ID pour badge Vérifié |
| Concurrence (Decathlon, FFF) | Faible court, moyenne long | Haute | Brand fort, communauté, focus monomaniaque gardiens |
| Saisonnalité (juillet-août creux) | Haute | Moyenne | Lancer en septembre (début saison), pas en été |
| Coût Stripe qui grignote la marge | Certaine | Moyenne | Volume → négo Stripe à 1 M€ GMV |

---

## 15. Décisions arrêtées (non-négociables MVP)

1. **Commission 15 % keeper + 1,50 € fixes client.** Pas d'abonnement.
2. **Paiement dans l'app uniquement.** Pas de cash, pas de chèque, pas de virement hors-plateforme (risque de *déplateformisation*).
3. **Assurance obligatoire incluse** — pas d'option.
4. **Pas de matching auto.** Le client choisit son keeper. Différenciation humaine.
5. **Keepers vérifiés manuellement** pour le badge Vérifié. Pas de shortcut algorithmique.
6. **Lancement IDF uniquement.** Tant qu'on n'a pas 80 % de taux d'acceptation à J+1 et NPS > 40, on n'expand pas.
7. **Mobile-first.** Le site web = landing + dashboard admin. Les users font tout dans l'app.
8. **No-show = remboursement immédiat full + 10 € crédit + 1 strike.** Règle stricte, non-négociable, communiquée clairement.

---

## 16. Annexes

### 16.1 Exemple calcul booking
Match R2 — 2h × 20 €/h :
- Client paie : **41,50 €** (40 € + 1,50 € frais)
- Keeper touche : **34,00 €** (85 % de 40 €)
- BooKeeper perçoit : **7,50 €** (6 € + 1,50 €)
- Moins frais Stripe ~0,65 € → marge nette **~6,85 €**

### 16.2 Scénario sensibilité — year 1
| Hypothèse | Matches/sem | GMV an | Revenu an | Marge brute |
|---|---|---|---|---|
| Pessimiste | 40 | 125 k€ | 18,7 k€ | 14 k€ |
| Réaliste | 100 | 312 k€ | 46,8 k€ | 35 k€ |
| Optimiste | 200 | 624 k€ | 93,6 k€ | 70 k€ |

### 16.3 Point ouvert — à trancher
- **Nom définitif :** BooKeeper vs. GoalKeapr. *Décision actuelle : BooKeeper (meilleur jeu de mots booking + keeper, plus mémorisable).*
- **.fr acquisition domaine** : vérifier dispo + racheter si besoin avant communication publique.
- **Marque INPI** : dépôt recommandé avant le soft launch (300 € + 225 € × classes supplémentaires).

---

*Ce document est un plan de travail, pas un contrat. Il sera mis à jour au fil des apprentissages terrain.*
