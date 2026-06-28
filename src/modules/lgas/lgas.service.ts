import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLgaDto } from './dto/lga-create.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LgasService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  async create(dto: CreateLgaDto) {
    const state =
      await this.prisma.state.findUnique({
        where: {
          id: dto.stateId,
        },
      });

    if (!state) {
      throw new NotFoundException(
        'State not found',
      );
    }

    return this.prisma.lga.create({
      data: dto,
    });
  }

  async findByState(stateId: string) {
    return this.prisma.lga.findMany({
      where: {
        stateId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
