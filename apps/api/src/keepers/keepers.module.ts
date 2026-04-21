import { Module } from '@nestjs/common';
import { KeepersController } from './keepers.controller';
import { KeepersService } from './keepers.service';

@Module({
  controllers: [KeepersController],
  providers: [KeepersService],
  exports: [KeepersService],
})
export class KeepersModule {}
