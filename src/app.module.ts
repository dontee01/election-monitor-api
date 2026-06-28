import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { IncidentsService } from './modules/incidents/incidents.service';
import { ResultsService } from './modules/results/results.service';
import { PollingUnitsService } from './modules/polling-units/polling-units.service';
import { IncidentsController } from './modules/incidents/incidents.controller';
import { ResultsController } from './modules/results/results.controller';
import { PollingUnitsController } from './modules/polling-units/polling-units.controller';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { PollingUnitsModule } from './modules/polling-units/polling-units.module';
import { ResultsModule } from './modules/results/results.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { StatesModule } from './modules/states/states.module';
import { LgasModule } from './modules/lgas/lgas.module';
import { WardsModule } from './modules/wards/wards.module';
import { StatesController } from './modules/geography/states/states.controller';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    IncidentsModule, 
    PollingUnitsModule, 
    ResultsModule, 
    PrismaModule, 
    ConfigModule.forRoot({ isGlobal: true }), 
    StatesModule, 
    LgasModule, 
    WardsModule
  ],
  controllers: [
    AppController, 
    IncidentsController, 
    ResultsController, 
    PollingUnitsController, 
    StatesController
  ],
  providers: [
    AppService, 
    IncidentsService, 
    ResultsService, 
    PollingUnitsService
  ],
})
export class AppModule {}
