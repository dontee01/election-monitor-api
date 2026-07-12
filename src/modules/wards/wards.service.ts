import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

import { paginate } from '../../common/pagination/pagination.helper';

import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { QueryWardDto } from './dto/query-ward.dto';

import { WardMessages } from './constants/ward.constants';
import { QueryMode } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class WardsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateWardDto) {
    const lga = await this.prisma.lga.findUnique({
      where: {
        id: dto.lgaId,
      },
    });

    if (!lga) {
      throw new NotFoundException(
        WardMessages.LGA_NOT_FOUND,
      );
    }

    const exists =
      await this.prisma.ward.findFirst({
        where: {
          name: dto.name,
          lgaId: dto.lgaId,
        },
      });

    if (exists) {
      throw new ConflictException(
        WardMessages.EXISTS,
      );
    }

    return this.prisma.ward.create({
      data: dto,
    });
  }

  async findAll(query: QueryWardDto) {
    const { page, limit, search } = query;

    const skip = (page - 1) * limit;

    // const where: Prisma.WardWhereInput = {};
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: QueryMode.insensitive,
      };
    }

    const [data, total] =
      await this.prisma.$transaction([
        this.prisma.ward.findMany({
          where,
          skip,
          take: limit,
          include: {
            lga: {
              include: {
                state: true,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        }),

        this.prisma.ward.count({
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
    const ward =
      await this.prisma.ward.findUnique({
        where: {
          id,
        },
        include: {
          lga: {
            include: {
              state: true,
            },
          },
        },
      });

    if (!ward) {
      throw new NotFoundException(
        WardMessages.NOT_FOUND,
      );
    }

    return ward;
  }

  async findByLga(lgaId: string) {
    return this.prisma.ward.findMany({
      where: {
        lgaId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(
    id: string,
    dto: UpdateWardDto,
  ) {
    await this.findOne(id);

    return this.prisma.ward.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.ward.delete({
      where: {
        id,
      },
    });

    return {
      message: WardMessages.DELETED,
    };
  }
}