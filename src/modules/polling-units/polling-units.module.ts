import { Module } from '@nestjs/common';
import { PollingUnitsController } from './polling-units.controller';
import { PollingUnitRepository } from './repositories/polling-unit.repository';
import { PollingUnitsService } from './polling-units.service';

@Module({
    controllers: [
        PollingUnitsController
    ],
    providers: [
        PollingUnitRepository,
        PollingUnitsService
    ],
    exports: [
        PollingUnitRepository,
        PollingUnitsService,
    ],
})
export class PollingUnitsModule {}
