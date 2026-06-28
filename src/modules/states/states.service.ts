import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Injectable()
export class StatesService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

  async create(dto: CreateStateDto) {
    const existing =
      await this.prisma.state.findFirst({
        where: {
          OR: [
            { name: dto.name },
            { code: dto.code },
          ],
        },
      });

    if (existing) {
      throw new ConflictException(
        'State already exists',
      );
    }

    return this.prisma.state.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.state.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const state =
      await this.prisma.state.findUnique({
        where: { id },
      });

    if (!state) {
      throw new NotFoundException(
        'State not found',
      );
    }

    return state;
  }

  async update(
    id: string,
    dto: UpdateStateDto,
  ) {
    await this.findOne(id);

    return this.prisma.state.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.state.delete({
      where: { id },
    });

    return {
      message: 'State deleted successfully',
    };
  }
}