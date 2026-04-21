import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateBookingSchema, type CreateBookingInput } from '@bookeeper/types';
import { CurrentUser, type AuthContext } from '../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(
    @CurrentUser() ctx: AuthContext,
    @Body(new ZodValidationPipe(CreateBookingSchema)) body: CreateBookingInput,
  ) {
    return this.bookings.create(ctx.userId, body);
  }

  @Get('mine')
  mine(@CurrentUser() ctx: AuthContext) {
    return this.bookings.listForUser(ctx.userId);
  }
}
