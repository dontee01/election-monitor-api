import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { buildPaginationMeta } from 'src/common/pagination/pagination.util';
import { MediaRepository } from '../repositories/media.repository';
import { QueryMediaDto } from '../dto/query-media.dto';

@Injectable()
export class MediaQueryService {
  constructor(
    private readonly repository: MediaRepository,
  ) {}

  async findAll(
    dto: QueryMediaDto,
  ) {

    const page = dto.page;

    const limit = dto.limit;

    const skip =
      (page - 1) * limit;

    const where:
      Prisma.MediaWhereInput = {};

    if (dto.type) {

      where.type = dto.type;

    }

    if (dto.incidentId) {

      where.incidentId =
        dto.incidentId;

    }

    if (dto.uploadedById) {

      where.uploadedById =
        dto.uploadedById;

    }

    const [rows, total] =
      await Promise.all([

        this.repository.findMany(

          where,

          skip,

          limit,

        ),

        this.repository.count(where),

      ]);

    return {

      data: rows,

      meta: {

        page,

        limit,

        total,

        totalPages:
          Math.ceil(
            total / limit,
          ),

      },

    };

  }

  async findOne(
    id: string,
  ) {

    const media =
      await this.repository.findById(
        id,
      );

    if (!media) {

      throw new NotFoundException(
        'Media not found',
      );

    }

    return media;

  }

}