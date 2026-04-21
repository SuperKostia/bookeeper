import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

interface KeeperSeed {
  phone: string;
  firstName: string;
  displayName: string;
  age: number;
  bio: string;
  hourlyRateCents: number;
  levels: string[];
  badges: string[];
  verified: boolean;
  travelRadiusKm: number;
  // Paris + banlieue points (lng, lat)
  lng: number;
  lat: number;
  zoneLabel: string;
  reviews: { author: string; rating: number; comment: string }[];
}

const KEEPERS: KeeperSeed[] = [
  {
    phone: '+33601010101',
    firstName: 'Yanis',
    displayName: 'Yanis Bourel',
    age: 27,
    bio: '8 ans en R1 avec le CS Ternes, gaucher, spécialiste des penos. Je viens équipé.',
    hourlyRateCents: 1800,
    levels: ['regional', 'departemental', 'honneur'],
    badges: ['verified'],
    verified: true,
    travelRadiusKm: 15,
    lng: 2.3755,
    lat: 48.8606,
    zoneLabel: 'Paris 11e',
    reviews: [
      { author: 'Karim M.', rating: 5, comment: 'Sauvetage sur coup franc à la 89e. Super pro.' },
      { author: 'Amélie D.', rating: 5, comment: 'S\'adapte au niveau sans condescendance. À reprendre.' },
      { author: 'Thibault R.', rating: 4, comment: 'Techniquement très bon. Un poil juste sur l\'horaire.' },
    ],
  },
  {
    phone: '+33602020202',
    firstName: 'Fatim',
    displayName: 'Fatim Ouedraogo',
    age: 31,
    bio: 'D1 Fém, 10 ans de poste, coach agréée FFF. Je prends les échauffements si besoin.',
    hourlyRateCents: 2200,
    levels: ['regional', 'loisir'],
    badges: ['verified', 'top5'],
    verified: true,
    travelRadiusKm: 20,
    lng: 2.4415,
    lat: 48.8637,
    zoneLabel: 'Montreuil',
    reviews: [
      { author: 'Julie V.', rating: 5, comment: 'Pro jusqu\'au bout. On prend à chaque fois.' },
      { author: 'Marc L.', rating: 5, comment: 'Dominante sur ses sorties. Classe au dessus.' },
    ],
  },
  {
    phone: '+33603030303',
    firstName: 'Luka',
    displayName: 'Luka Kovač',
    age: 24,
    bio: 'N3 + futsal. Rapide sur la ligne, bon relanceur. Dispo weekend surtout.',
    hourlyRateCents: 2000,
    levels: ['national', 'regional'],
    badges: ['verified'],
    verified: true,
    travelRadiusKm: 12,
    lng: 2.4033,
    lat: 48.8636,
    zoneLabel: 'Paris 20e',
    reviews: [
      { author: 'Sam P.', rating: 5, comment: 'Instinct folie. 4 arrêts décisifs.' },
    ],
  },
  {
    phone: '+33604040404',
    firstName: 'Léo',
    displayName: 'Léo Martin',
    age: 19,
    bio: 'U19 National, en reconversion amateur. Cherche à prendre du temps de jeu.',
    hourlyRateCents: 1200,
    levels: ['loisir', 'departemental'],
    badges: [],
    verified: false,
    travelRadiusKm: 10,
    lng: 2.4417,
    lat: 48.8486,
    zoneLabel: 'Vincennes',
    reviews: [
      { author: 'Hugo T.', rating: 4, comment: 'Jeune mais solide. Bon pour le loisir.' },
    ],
  },
  {
    phone: '+33605050505',
    firstName: 'Diego',
    displayName: 'Diego Silva',
    age: 38,
    bio: 'Ex-pro Nacional D3 Portugal. Coach GK depuis 8 ans. Je viens avec un vrai regard tactique.',
    hourlyRateCents: 3500,
    levels: ['national', 'regional', 'honneur'],
    badges: ['verified', 'veteran', 'top5'],
    verified: true,
    travelRadiusKm: 25,
    lng: 2.2390,
    lat: 48.8414,
    zoneLabel: 'Boulogne',
    reviews: [
      { author: 'Nicolas F.', rating: 5, comment: 'Tout simplement d\'un autre niveau. On apprend.' },
      { author: 'Ivan G.', rating: 5, comment: 'Recruté pour un match R1, impact immédiat.' },
      { author: 'Karim T.', rating: 5, comment: 'Cher mais justifié. Classe mondiale.' },
    ],
  },
  {
    phone: '+33606060606',
    firstName: 'Inès',
    displayName: 'Inès Rousseau',
    age: 22,
    bio: 'R2 + futsal féminin. Je joue au feeling, communicante avec la défense.',
    hourlyRateCents: 1500,
    levels: ['regional', 'loisir'],
    badges: ['verified'],
    verified: true,
    travelRadiusKm: 15,
    lng: 2.3380,
    lat: 48.9051,
    zoneLabel: 'Saint-Ouen',
    reviews: [
      { author: 'Paul R.', rating: 5, comment: 'Ambiance top, 2 arrêts à gagner le match.' },
      { author: 'Jade M.', rating: 4, comment: 'Sympa, parfaite pour du loisir.' },
    ],
  },
  {
    phone: '+33607070707',
    firstName: 'Thomas',
    displayName: 'Thomas Girard',
    age: 29,
    bio: 'R1 + coach adjoint. Bon sur les ballons aériens, 1m94.',
    hourlyRateCents: 2500,
    levels: ['regional', 'honneur'],
    badges: ['verified'],
    verified: true,
    travelRadiusKm: 18,
    lng: 2.3522,
    lat: 48.8738,
    zoneLabel: 'Paris 9e',
    reviews: [
      { author: 'Élodie P.', rating: 5, comment: 'Massif sur les corners. Top.' },
    ],
  },
  {
    phone: '+33608080808',
    firstName: 'Aïcha',
    displayName: 'Aïcha Diop',
    age: 26,
    bio: 'R3 + beach soccer l\'été. Dispo last minute 80 % du temps.',
    hourlyRateCents: 1600,
    levels: ['departemental', 'loisir'],
    badges: [],
    verified: false,
    travelRadiusKm: 20,
    lng: 2.3105,
    lat: 48.8924,
    zoneLabel: 'Clichy',
    reviews: [
      { author: 'Rachid B.', rating: 4, comment: 'Dispo en last-minute, a sauvé le match.' },
    ],
  },
];

async function main() {
  console.log('Seeding…');

  for (const k of KEEPERS) {
    const user = await prisma.user.upsert({
      where: { phone: k.phone },
      update: {},
      create: { phone: k.phone, firstName: k.firstName, role: UserRole.keeper },
    });

    await prisma.keeperProfile.upsert({
      where: { userId: user.id },
      update: {
        displayName: k.displayName,
        bio: k.bio,
        hourlyRateCents: k.hourlyRateCents,
        levels: k.levels,
        badges: k.badges,
        verifiedAt: k.verified ? new Date() : null,
        travelRadiusKm: k.travelRadiusKm,
      },
      create: {
        userId: user.id,
        displayName: k.displayName,
        bio: k.bio,
        hourlyRateCents: k.hourlyRateCents,
        levels: k.levels,
        badges: k.badges,
        verifiedAt: k.verified ? new Date() : null,
        travelRadiusKm: k.travelRadiusKm,
      },
    });

    // Geo point via raw SQL (PostGIS Unsupported in Prisma types).
    await prisma.$executeRawUnsafe(
      `UPDATE keeper_profiles SET "homePoint" = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE "userId" = $3::uuid`,
      k.lng,
      k.lat,
      user.id,
    );

    // Drop and recreate reviews idempotently
    await prisma.review.deleteMany({ where: { targetId: user.id } });
    for (const r of k.reviews) {
      // Create a dummy booking + review pair. Booking points to an anonymous
      // "client" seed user so foreign keys hold.
      const clientPhone = `+3399${Math.floor(Math.random() * 1_000_000)
        .toString()
        .padStart(6, '0')}`;
      const client = await prisma.user.create({
        data: { phone: clientPhone, firstName: r.author.split(' ')[0] ?? r.author, role: UserRole.client },
      });

      const booking = await prisma.$queryRawUnsafe<{ id: string }[]>(
        `INSERT INTO bookings (
           id, "clientId", "keeperId", "startsAt", "durationMinutes",
           "locationPoint", "locationText", context, level,
           "hourlyRateCents", "serviceFeeCents", "totalCents",
           status, "createdAt", "completedAt"
         ) VALUES (
           gen_random_uuid(), $1::uuid, $2::uuid,
           NOW() - INTERVAL '20 days', 120,
           ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography,
           $5, 'competition'::"BookingContext", 'regional',
           $6, 150, $7, 'completed'::"BookingStatus", NOW() - INTERVAL '21 days', NOW() - INTERVAL '20 days'
         ) RETURNING id`,
        client.id,
        user.id,
        k.lng,
        k.lat,
        k.zoneLabel,
        k.hourlyRateCents,
        k.hourlyRateCents * 2 + 150,
      );

      const bookingId = booking[0]?.id;
      if (!bookingId) continue;

      await prisma.review.create({
        data: {
          bookingId,
          authorId: client.id,
          targetId: user.id,
          rating: r.rating,
          comment: r.comment,
        },
      });
    }
  }

  console.log(`Seeded ${KEEPERS.length} keepers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
