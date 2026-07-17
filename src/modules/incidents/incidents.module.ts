import { Module } from '@nestjs/common';
import { IncidentsController } from './incidents.controller';
import { IncidentRepository } from './repositories/incident.repository';
import { IncidentCommandService } from './commands/incident-command.service';
import { IncidentQueryService } from './queries/incident-query.service';
import { ElectionRepository } from '../elections/repositories/election.repository';
import { PollingUnitRepository } from '../polling-units/repositories/polling-unit.repository';
import { ReferenceNumberService } from 'src/common/services/reference-number.service';
import { PollingUnitsModule } from '../polling-units/polling-units.module';
import { ElectionsModule } from '../elections/elections.module';

@Module({
  imports: [
    ElectionsModule,
    PollingUnitsModule
  ],
  controllers: [
    IncidentsController
  ],
  providers: [
    IncidentCommandService,
    IncidentQueryService,
    IncidentRepository,
    // ElectionRepository,
    // PollingUnitRepository,
    ReferenceNumberService,
  ],
  exports: [
    IncidentCommandService,
    IncidentQueryService,
    IncidentRepository,
    ReferenceNumberService
  ],
})
export class IncidentsModule {}
