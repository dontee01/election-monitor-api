import { Controller, Get, Param } from '@nestjs/common';
import { LgasService } from './lgas.service';

@Controller('lgas')
export class LgasController {
  constructor(private readonly lgasService: LgasService) {}

  @Get('/state/:stateId')
  findByState(
    @Param('stateId')
    stateId: string,
  ) {
    return this.lgasService.findByState(
      stateId,
    );
  }
}
