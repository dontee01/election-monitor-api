// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { Prisma } from 'src/generated/prisma';
// import { PrismaService } from 'src/prisma/prisma.service';

// import { MediaRepository } from '../repositories/media.repository';
// import { MediaMapper } from '../mappers/media.mapper';
// import { UploadMediaDto } from '../dto/upload-media.dto';
// import { StorageService } from 'src/common/services/storage.service';
// import { ReferenceNumberService } from 'src/common/services/reference-number.service';
// import { IncidentsService } from 'src/modules/incidents/incidents.service';

// @Injectable()
// export class MediaCommandService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly repository: MediaRepository,
//     private readonly incidentsService: IncidentsService,
//     private readonly storageService: StorageService,
//     private readonly referenceNumberService: ReferenceNumberService,
//   ) {}

//   async upload(
//     file: Express.Multer.File,
//     dto: UploadMediaDto,
//     userId: string,
//   ) {
//     if (!file) {
//       throw new BadRequestException('File is required');
//     }

//     // Media can optionally belong to an incident.
//     if (dto.incidentId) {
//       const incident = await this.incidentsService.findById(
//         dto.incidentId,
//       );

//       if (!incident) {
//         throw new NotFoundException('Incident not found');
//       }
//     }

//     const stored = await this.storageService.save(
//       file,
//       dto.type,
//     );

//     try {
//       const media = await this.prisma.$transaction(
//         async (tx) => {
//           return this.repository.create(tx, {
//             reference:
//               await this.referenceNumberService.generateMediaReference(),

//             type: dto.type,

//             url: stored.url,

//             originalName: stored.originalName,

//             mimeType: stored.mimeType,

//             extension: stored.extension,

//             fileSize: stored.fileSize,

//             uploadedBy: {
//               connect: {
//                 id: userId,
//               },
//             },

//             ...(dto.incidentId && {
//               incident: {
//                 connect: {
//                   id: dto.incidentId,
//                 },
//               },
//             }),
//           });
//         },
//       );

//       return {
//         success: true,
//         message: 'Media uploaded successfully',
//         data: MediaMapper.toResponse(media),
//       };
//     } catch (error) {
//       // Database failed after the physical file was saved.
//       // Remove the orphaned file.
//       await this.storageService.delete(stored.url);

//       throw error;
//     }
//   }
// }




import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { ReferenceNumberService } from 'src/common/services/reference-number.service';
import { MediaRepository } from '../repositories/media.repository';
import { IncidentsService } from 'src/modules/incidents/incidents.service';
import { StorageService } from 'src/common/services/storage.service';
import { UploadMediaDto } from '../dto/upload-media.dto';
import { MediaMapper } from '../mappers/media.mapper';
import { IncidentRepository } from 'src/modules/incidents/repositories/incident.repository';

@Injectable()
export class MediaCommandService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: MediaRepository,
    private readonly incidentRepository: IncidentRepository,
    private readonly storageService: StorageService,
    private readonly referenceService: ReferenceNumberService,
  ) {}

  async upload(
    file: Express.Multer.File,
    dto: UploadMediaDto,
    userId: string,
  ) {

    if (dto.incidentId) {

      const incident =
        await this.incidentRepository.findById(
          dto.incidentId,
        );

      if (!incident) {

        throw new NotFoundException(
          'Incident not found',
        );

      }

    }

    const stored =
      await this.storageService.save(
        file,
        dto.type,
      );

    return this.prisma.$transaction(

      async (tx) => {

        const media =
          await this.repository.create(
            tx,
            {

              reference:
                await this.referenceService.generateMediaReference(),

              type: dto.type,

              url: stored.url,

              originalName:
                stored.originalName,

              mimeType:
                stored.mimeType,

              extension:
                stored.extension,

              fileSize:
                stored.fileSize,

              uploadedBy: {

                connect: {
                  id: userId,
                },

              },

              ...(dto.incidentId && {

                incident: {

                  connect: {

                    id: dto.incidentId,

                  },

                },

              }),

            },
          );

        return MediaMapper.toResponse(
          media,
        );

      },

    );

  }

}