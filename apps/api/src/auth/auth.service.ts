import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@bookeeper/db';
import { UsersService } from '../users/users.service';
import { OtpService } from './otp.service';

export interface AuthResult {
  token: string;
  user: Pick<User, 'id' | 'phone' | 'email' | 'firstName' | 'role' | 'createdAt'>;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly otp: OtpService,
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  sendOtp(phone: string): Promise<{ devCode: string | null }> {
    return this.otp.send(phone);
  }

  async verifyOtp(phone: string, code: string): Promise<AuthResult> {
    await this.otp.verify(phone, code);
    const user = await this.users.upsertByPhone(phone);
    const token = await this.jwt.signAsync({ sub: user.id });
    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}
