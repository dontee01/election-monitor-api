import { Module } from '@nestjs/common';
import { ElectionsController } from './elections.controller';
import { ElectionsService } from './elections.service';
import { ElectionRepository } from './repositories/election.repository';

@Module({
  controllers: [ElectionsController],
  providers: [
    ElectionsService,
    ElectionRepository,
  ],
  exports: [
    ElectionsService,
    ElectionRepository,
  ],
})
export class ElectionsModule {}
