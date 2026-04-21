import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { splitBookingAmounts } from '@bookeeper/types';
import type { CreateBookingInput } from '@bookeeper/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientId: string, input: CreateBookingInput) {
    if (input.keeperId === clientId) {
      throw new BadRequestException('You cannot book yourself');
    }

    const keeper = await this.prisma.user.findFirst({
      where: { id: input.keeperId, keeperProfile: { isNot: null } },
      include: { keeperProfile: true },
    });
    if (!keeper || !keeper.keeperProfile) {
      throw new NotFoundException('Keeper not found');
    }

    const { clientTotalCents, serviceFeeCents } = splitBookingAmounts(
      keeper.keeperProfile.hourlyRateCents,
      input.durationMinutes,
    );

    // Booking uses PostGIS geography; Prisma doesn't model it cleanly so we
    // insert via raw SQL then fetch back via the typed model.
    const rows = await this.prisma.$queryRawUnsafe<{ id: string }[]>(
      `INSERT INTO bookings (
         id, "clientId", "keeperId", "startsAt", "durationMinutes",
         "locationPoint", "locationText", context, level,
         "hourlyRateCents", "serviceFeeCents", "totalCents",
         status, "createdAt"
       ) VALUES (
         gen_random_uuid(), $1::uuid, $2::uuid, $3::timestamptz, $4,
         ST_SetSRID(ST_MakePoint($5, $6), 4326)::geography,
         $7, $8::"BookingContext", $9,
         $10, $11, $12,
         'pending'::"BookingStatus", NOW()
       ) RETURNING id`,
      clientId,
      input.keeperId,
      new Date(input.startsAt),
      input.durationMinutes,
      input.location.point.lng,
      input.location.point.lat,
      input.location.text,
      input.context,
      input.level,
      keeper.keeperProfile.hourlyRateCents,
      serviceFeeCents,
      clientTotalCents,
    );

    const id = rows[0]?.id;
    if (!id) throw new Error('Failed to create booking');

    return this.prisma.booking.findUniqueOrThrow({
      where: { id },
      include: {
        keeper: { include: { keeperProfile: true } },
      },
    });
  }

  async listForUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { OR: [{ clientId: userId }, { keeperId: userId }] },
      orderBy: { startsAt: 'desc' },
      take: 20,
      include: {
        keeper: { include: { keeperProfile: true } },
        client: { select: { firstName: true } },
      },
    });
  }
}
