import { Controller, Get, Query } from '@nestjs/common';
import { PollingUnitsService } from './polling-units.service';

@Controller('polling-units')
export class PollingUnitsController {
  constructor(
    private readonly pollingUnitsService: PollingUnitsService,
  ) {}
  @Get('search')
  search(
    @Query('q')
    query: string,
  ) {
    return this.pollingUnitsService.search(
      query,
    );
  }
}
