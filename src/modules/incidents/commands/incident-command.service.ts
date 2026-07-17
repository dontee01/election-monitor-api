import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateIncidentDto } from '../dto/create-incident.dto';
import { IncidentRepository } from '../repositories/incident.repository';
import { ElectionRepository } from '../../elections/repositories/election.repository';
import { PollingUnitRepository } from '../../polling-units/repositories/polling-unit.repository';
import { ReferenceNumberService } from 'src/common/services/reference-number.service';
import { IncidentMapper } from '../mappers/incident.mapper';

@Injectable()
export class IncidentCommandService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly incidentRepository: IncidentRepository,
    private readonly electionRepository: ElectionRepository,
    private readonly pollingUnitRepository: PollingUnitRepository,
    private readonly referenceNumberService: ReferenceNumberService,
  ) {}

  async create(
    dto: CreateIncidentDto,
    reporterId: string,
  ) {

    const election = await this.electionRepository.findById(
      dto.electionId,
    );

    if (!election) {
      throw new NotFoundException('Election not found');
    }

    const pollingUnit =
      await this.pollingUnitRepository.findById(
        dto.pollingUnitId,
      );

    if (!pollingUnit) {
      throw new NotFoundException(
        'Polling Unit not found',
      );
    }

    const reference = await this.referenceNumberService.generateIncidentReference();
    const incident = await this.prisma.$transaction(async (tx) => {

      return this.incidentRepository.create(tx, {
        reference,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        severity: dto.severity,
        occurredAt: dto.occurredAt,
        latitude: dto.latitude,
        longitude: dto.longitude,
        election: {
          connect: {
            id: dto.electionId,
          },
        },

        pollingUnit: {
          connect: {
            id: dto.pollingUnitId,
          },
        },

        reporter: {
          connect: {
            id: reporterId,
          },
        },
      });

    });
    return IncidentMapper.toResponse(incident);

  }
}