import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendOtpSchema, VerifyOtpSchema, type SendOtpInput, type VerifyOtpInput } from '@bookeeper/types';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser, type AuthContext } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Public()
  @Post('send-otp')
  async sendOtp(@Body(new ZodValidationPipe(SendOtpSchema)) body: SendOtpInput) {
    return this.auth.sendOtp(body.phone);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body(new ZodValidationPipe(VerifyOtpSchema)) body: VerifyOtpInput) {
    return this.auth.verifyOtp(body.phone, body.code);
  }

  @Get('me')
  async me(@CurrentUser() ctx: AuthContext) {
    const user = await this.users.findByIdOrThrow(ctx.userId);
    return {
      id: user.id,
      phone: user.phone,
      email: user.email,
      firstName: user.firstName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
