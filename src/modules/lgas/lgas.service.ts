import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { Prisma, QueryMode } from '@prisma/client';
import { Prisma } from 'generated/prisma/client';

import { paginate } from '../../common/pagination/pagination.helper';
import { CreateLgaDto } from './dto/create-lga.dto';
import { UpdateLgaDto } from './dto/update-lga.dto';
import { QueryLgaDto } from './dto/query-lga.dto';
import { LgaMessages } from './constants/lga.constants';
import { QueryMode } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class LgasService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateLgaDto) {
    const state = await this.prisma.state.findUnique({
      where: { id: dto.stateId },
    });

    if (!state) {
      throw new NotFoundException(
        LgaMessages.STATE_NOT_FOUND,
      );
    }

    const exists = await this.prisma.lga.findFirst({
      where: {
        name: dto.name,
        stateId: dto.stateId,
      },
    });

    if (exists) {
      throw new ConflictException(
        LgaMessages.EXISTS,
      );
    }

    return this.prisma.lga.create({
      data: dto,
    });
  }

  async findAll(query: QueryLgaDto) {
    const { page, limit, search } = query;

    const skip = (page - 1) * limit;

    // const where: Prisma.LgaWhereInput = {};
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: QueryMode.insensitive,
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.lga.findMany({
        where,
        skip,
        take: limit,
        include: {
          state: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),

      this.prisma.lga.count({
        where,
      }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const lga = await this.prisma.lga.findUnique({
      where: { id },
      include: {
        state: true,
      },
    });

    if (!lga) {
      throw new NotFoundException(
        LgaMessages.NOT_FOUND,
      );
    }

    return lga;
  }

  async findByState(stateId: string) {
    const state = await this.prisma.state.findUnique({
      where: { id: stateId },
    });

    if (!state) {
      throw new NotFoundException(
        LgaMessages.STATE_NOT_FOUND,
      );
    }

    return this.prisma.lga.findMany({
      where: {
        stateId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(
    id: string,
    dto: UpdateLgaDto,
  ) {
    await this.findOne(id);

    return this.prisma.lga.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.lga.delete({
      where: { id },
    });

    return {
      message: LgaMessages.DELETED,
    };
  }
}