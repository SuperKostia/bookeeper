import { Controller, Get, Param, Query } from '@nestjs/common';
import { KeepersService } from './keepers.service';

@Controller('keepers')
export class KeepersController {
  constructor(private readonly keepers: KeepersService) {}

  @Get('search')
  search(@Query('context') context?: string, @Query('level') level?: string) {
    return this.keepers.search({ context, level });
  }

  @Get(':id')
  byId(@Param('id') id: string) {
    return this.keepers.getById(id);
  }
}
