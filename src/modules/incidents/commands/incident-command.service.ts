import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateIncidentDto, IncidentDomain } from '../dto/create-incident.dto';
import { IncidentRepository } from '../repositories/incident.repository';
import { ElectionRepository } from '../../elections/repositories/election.repository';
import { PollingUnitRepository } from '../../polling-units/repositories/polling-unit.repository';
// import { WardRepository } from '../../wards/repositories/ward.repository';
import { ReferenceNumberService } from 'src/common/services/reference-number.service';
import { IncidentMapper } from '../mappers/incident.mapper';

@Injectable()
export class IncidentCommandService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly incidentRepository: IncidentRepository,
    private readonly electionRepository: ElectionRepository,
    private readonly pollingUnitRepository: PollingUnitRepository,
    // private readonly wardRepository: WardRepository,
    private readonly referenceNumberService: ReferenceNumberService,
  ) {}

  async create(dto: CreateIncidentDto, reporterId: string) {
    const domain = dto.domain ?? IncidentDomain.COMMUNITY;

    // 1. Validate Election (required if domain is ELECTION)
    if (domain === IncidentDomain.ELECTION) {
      if (!dto.electionId) {
        throw new BadRequestException('electionId is required for election incidents');
      }

      const election = await this.electionRepository.findById(dto.electionId);
      if (!election) {
        throw new NotFoundException(`Election with ID "${dto.electionId}" not found`);
      }
    }

    // 2. Validate Polling Unit if provided
    if (dto.pollingUnitId) {
      const pollingUnit = await this.pollingUnitRepository.findById(dto.pollingUnitId);
      if (!pollingUnit) {
        throw new NotFoundException(`Polling Unit with ID "${dto.pollingUnitId}" not found`);
      }
    }

    // 3. Validate Ward if provided
    if (dto.wardId) {
      // const ward = await this.wardRepository.findById(dto.wardId);
      const ward = await this.prisma.ward.findUnique({
        where: { id: dto.wardId },
      });
      if (!ward) {
        throw new NotFoundException(`Ward with ID "${dto.wardId}" not found`);
      }
    }

    // 4. Generate reference identifier
    const reference = await this.referenceNumberService.generateIncidentReference();

    // 5. Persist inside transaction with conditional relations
    const incident = await this.prisma.$transaction(async (tx) => {
      return this.incidentRepository.create(tx, {
        reference,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        severity: dto.severity,
        domain,
        address: dto.address,
        occurredAt: dto.occurredAt ?? new Date(),
        latitude: dto.latitude,
        longitude: dto.longitude,
        reporter: {
          connect: { id: reporterId },
        },
        ...(dto.electionId && {
          election: {
            connect: { id: dto.electionId },
          },
        }),
        ...(dto.pollingUnitId && {
          pollingUnit: {
            connect: { id: dto.pollingUnitId },
          },
        }),
        ...(dto.wardId && {
          ward: {
            connect: { id: dto.wardId },
          },
        }),
      });
    });

    return IncidentMapper.toResponse(incident);
  }
}






// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';

// import { CreateIncidentDto } from '../dto/create-incident.dto';
// import { IncidentRepository } from '../repositories/incident.repository';
// import { ElectionRepository } from '../../elections/repositories/election.repository';
// import { PollingUnitRepository } from '../../polling-units/repositories/polling-unit.repository';
// import { ReferenceNumberService } from 'src/common/services/reference-number.service';
// import { IncidentMapper } from '../mappers/incident.mapper';

// @Injectable()
// export class IncidentCommandService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly incidentRepository: IncidentRepository,
//     private readonly electionRepository: ElectionRepository,
//     private readonly pollingUnitRepository: PollingUnitRepository,
//     private readonly referenceNumberService: ReferenceNumberService,
//   ) {}

//   async create(
//     dto: CreateIncidentDto,
//     reporterId: string,
//   ) {

//     const election = await this.electionRepository.findById(
//       dto.electionId,
//     );

//     if (!election) {
//       throw new NotFoundException('Election not found');
//     }

//     const pollingUnit =
//       await this.pollingUnitRepository.findById(
//         dto.pollingUnitId,
//       );

//     if (!pollingUnit) {
//       throw new NotFoundException(
//         'Polling Unit not found',
//       );
//     }

//     const reference = await this.referenceNumberService.generateIncidentReference();
//     const incident = await this.prisma.$transaction(async (tx) => {

//       return this.incidentRepository.create(tx, {
//         reference,
//         title: dto.title,
//         description: dto.description,
//         category: dto.category,
//         severity: dto.severity,
//         occurredAt: dto.occurredAt,
//         latitude: dto.latitude,
//         longitude: dto.longitude,
//         election: {
//           connect: {
//             id: dto.electionId,
//           },
//         },

//         pollingUnit: {
//           connect: {
//             id: dto.pollingUnitId,
//           },
//         },

//         reporter: {
//           connect: {
//             id: reporterId,
//           },
//         },
//       });

//     });
//     return IncidentMapper.toResponse(incident);

//   }
// }