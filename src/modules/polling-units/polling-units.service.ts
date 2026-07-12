import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePollingUnitDto } from './dto/create-polling-unit.dto';
import { UpdatePollingUnitDto } from './dto/update-polling-unit.dto';
import { QueryPollingUnitDto } from './dto/query-polling-unit.dto';

import { Prisma } from '@prisma/client';

import { paginate } from '../../common/pagination/pagination.helper';

import { PollingUnitMessages } from './constants/polling-unit.constants';
import { QueryMode } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class PollingUnitsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreatePollingUnitDto) {
    const pollingUnit = await this.prisma.ward.findUnique({
      where: {
        id: dto.wardId,
      },
    });

    if (!pollingUnit) {
      throw new NotFoundException(
        PollingUnitMessages.WARD_NOT_FOUND,
      );
    }

    const exists =
      await this.prisma.pollingUnit.findFirst({
        where: {
          name: dto.name,
          wardId: dto.wardId,
        },
      });

    if (exists) {
      throw new ConflictException(
        PollingUnitMessages.EXISTS,
      );
    }

    return this.prisma.pollingUnit.create({
      data: dto,
    });
  }

  async search(query: string) {
    const limit = 20; // Default limit for search results
    return this.prisma.pollingUnit.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: QueryMode.insensitive,
            },
          },
          {
            code: {
              contains: query,
              mode: QueryMode.insensitive,
            },
          },
        ],
      },
      take: limit,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAll(query: QueryPollingUnitDto) {
    const { page, limit, search, wardId } = query;

    const skip = (page - 1) * limit;

    // const where: Prisma.PollingUnitWhereInput = {};
    const where: any = {};

    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                    mode: QueryMode.insensitive,
                },
            },
            {
                code: {
                    contains: search,
                    mode: QueryMode.insensitive,
                },
            },

        ];

    }

    if (wardId) {

        where.wardId = wardId;

    }

    const [data, total] =
      await this.prisma.$transaction([
        this.prisma.pollingUnit.findMany({
          where,
          skip,
          take: limit,
          include: {
            ward: {
              include: {
                lga: {
                  include: {
                    state: true,
                  },
                },
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        }),

        this.prisma.pollingUnit.count({
          where,
        }),
      ]);

    return paginate(
      data,
      total,
      page,
      limit,
    );
  }

  async findOne(id: string) {
    const pollingUnit =
      await this.prisma.pollingUnit.findUnique({
        where: {
          id,
        },
        include: {
          ward: {
            include: {
              lga: {
                include: {
                  state: true,
                },
              },
            },
          },
        },
      });

    if (!pollingUnit) {
      throw new NotFoundException(
        PollingUnitMessages.NOT_FOUND,
      );
    }

    return pollingUnit;
  }

  async findByWard(wardId: string) {
    return this.prisma.pollingUnit.findMany({
      where: {
        wardId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(
    id: string,
    dto: UpdatePollingUnitDto,
  ) {
    await this.findOne(id);

    return this.prisma.pollingUnit.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.pollingUnit.delete({
      where: {
        id,
      },
    });

    return {
      message: PollingUnitMessages.DELETED,
    };
  }
}