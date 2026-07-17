import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { QueryIncidentDto } from '../dto/query-incident.dto';
import { IncidentRepository } from '../repositories/incident.repository';
import { QueryMode } from 'generated/prisma/internal/prismaNamespace';
import { IncidentMessages } from '../constants/incident.constants';
import { buildPaginationMeta } from 'src/common/pagination/pagination.util';

@Injectable()
export class IncidentQueryService {
  constructor(
      private readonly repository: IncidentRepository,
  ) {}

  async findAll(dto: QueryIncidentDto) {
    const page = dto.page ?? 1;

    const limit = dto.limit ?? 20;

    const skip = (page - 1) * limit;

    const where: Prisma.IncidentWhereInput = {};

    if (dto.status) {
        where.status = dto.status;
    }

    if (dto.category) {
        where.category = dto.category;
    }

    if (dto.severity) {
        where.severity = dto.severity;
    }

    if (dto.electionId) {
        where.electionId = dto.electionId;
    }

    if (dto.pollingUnitId) {
        where.pollingUnitId = dto.pollingUnitId;
    }

    if (dto.search) {
        where.OR = [
            {
                title: {
                    contains: dto.search,
                    mode: QueryMode.insensitive,
                },
            },

            {
                description: {
                    contains: dto.search,
                    mode: QueryMode.insensitive,
                },
            },

            {
                reference: {
                    contains: dto.search,
                    mode: QueryMode.insensitive,
                },
            },

        ];

    }

    // if (dto.dateFrom && dto.dateTo) {
    //     where.occurredAt = {
    //         gte: dto.dateFrom,
    //         lte: dto.dateTo,
    //     };
    // }
    const [rows, total] = await Promise.all([
        this.repository.findMany(
            where,
            skip,
            limit,
        ),
        this.repository.count(where),

    ]);
    return {
      data: rows,
      meta: buildPaginationMeta(page, limit, total),
    };
    // return {
    //   data: rows,
    //   meta: {
    //     page,
    //     limit,
    //     total,
    //     totalPages: Math.ceil(total / limit),
    //   },
    // };

  }

  async findOne(id: string) {
    const incident =
      await this.repository.findByIdWithRelations(id);

    if (!incident) {
      throw new NotFoundException(
          IncidentMessages.NOT_FOUND,
      );
    }

    return incident;

  }

}