import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** A searchable keeper, enriched with avg rating and review count. */
export interface KeeperCard {
  id: string;
  firstName: string | null;
  displayName: string;
  photoUrl: string | null;
  bio: string | null;
  hourlyRateCents: number;
  levels: string[];
  badges: string[];
  verified: boolean;
  travelRadiusKm: number;
  zoneLabel: string | null;
  ratingAvg: number | null;
  reviewsCount: number;
}

@Injectable()
export class KeepersService {
  constructor(private readonly prisma: PrismaService) {}

  async search(params: { context?: string; level?: string }): Promise<KeeperCard[]> {
    const rows = await this.prisma.$queryRawUnsafe<
      Array<{
        id: string;
        firstName: string | null;
        displayName: string;
        photoUrl: string | null;
        bio: string | null;
        hourlyRateCents: number;
        levels: string[];
        badges: string[];
        verifiedAt: Date | null;
        travelRadiusKm: number;
        zoneLabel: string | null;
        ratingAvg: number | null;
        reviewsCount: bigint;
      }>
    >(
      `
      SELECT
        u.id,
        u."firstName"                           AS "firstName",
        kp."displayName"                        AS "displayName",
        kp."photoUrl"                           AS "photoUrl",
        kp.bio                                  AS bio,
        kp."hourlyRateCents"                    AS "hourlyRateCents",
        kp.levels                               AS levels,
        kp.badges                               AS badges,
        kp."verifiedAt"                         AS "verifiedAt",
        kp."travelRadiusKm"                     AS "travelRadiusKm",
        (
          SELECT b."locationText"
          FROM bookings b
          WHERE b."keeperId" = u.id
          ORDER BY b."createdAt" DESC
          LIMIT 1
        )                                       AS "zoneLabel",
        COALESCE(AVG(r.rating)::float, NULL)    AS "ratingAvg",
        COUNT(r.id)                             AS "reviewsCount"
      FROM users u
      JOIN keeper_profiles kp ON kp."userId" = u.id
      LEFT JOIN reviews r ON r."targetId" = u.id
      WHERE u."bannedAt" IS NULL
      GROUP BY u.id, kp."userId"
      ORDER BY "ratingAvg" DESC NULLS LAST, "hourlyRateCents" ASC
      LIMIT 50
      `,
    );

    return rows.map((r) => ({
      id: r.id,
      firstName: r.firstName,
      displayName: r.displayName,
      photoUrl: r.photoUrl,
      bio: r.bio,
      hourlyRateCents: r.hourlyRateCents,
      levels: r.levels,
      badges: r.badges,
      verified: r.verifiedAt !== null,
      travelRadiusKm: r.travelRadiusKm,
      zoneLabel: r.zoneLabel,
      ratingAvg: r.ratingAvg,
      reviewsCount: Number(r.reviewsCount),
    }));
  }

  async getById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, keeperProfile: { isNot: null } },
      include: {
        keeperProfile: true,
        reviewsReceived: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            author: { select: { firstName: true } },
            booking: { select: { context: true, level: true, startsAt: true, durationMinutes: true } },
          },
        },
      },
    });
    if (!user || !user.keeperProfile) throw new NotFoundException('Keeper not found');

    const agg = await this.prisma.review.aggregate({
      where: { targetId: id },
      _avg: { rating: true },
      _count: { id: true },
    });

    const p = user.keeperProfile;
    return {
      id: user.id,
      firstName: user.firstName,
      displayName: p.displayName,
      photoUrl: p.photoUrl,
      bio: p.bio,
      hourlyRateCents: p.hourlyRateCents,
      levels: p.levels,
      badges: p.badges,
      verified: p.verifiedAt !== null,
      travelRadiusKm: p.travelRadiusKm,
      ratingAvg: agg._avg.rating,
      reviewsCount: agg._count.id,
      reviews: user.reviewsReceived.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        authorName: r.author.firstName,
        context: r.booking.context,
        level: r.booking.level,
        bookingDate: r.booking.startsAt,
        durationMinutes: r.booking.durationMinutes,
      })),
    };
  }
}
