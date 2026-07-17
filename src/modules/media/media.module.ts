import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './media.controller';
import { MediaRepository } from './repositories/media.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IncidentsModule } from '../incidents/incidents.module';
import { MediaCommandService } from './commands/media-command.service';
import { MediaQueryService } from './queries/media-query.service';
import { StorageService } from 'src/common/services/storage.service';

@Module({
  imports: [
    IncidentsModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [MediaController],
  providers: [
    MediaRepository,
    MediaCommandService,
    MediaQueryService,
    StorageService
  ],
  exports: [
    MediaRepository,
    MediaCommandService,
    MediaQueryService,
  ],
})
export class MediaModule {}
