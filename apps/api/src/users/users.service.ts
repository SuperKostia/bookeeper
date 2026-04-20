import { Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '@bookeeper/db';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Idempotent: returns the existing user by phone, otherwise creates one
   * with the default `client` role. Called after OTP verification.
   */
  async upsertByPhone(phone: string): Promise<User> {
    return this.prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone },
    });
  }
}
