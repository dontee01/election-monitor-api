import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePollingUnitDto } from './dto/create-polling-unit.dto';

@Injectable()
export class PollingUnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreatePollingUnitDto,
  ) {
    return this.prisma.pollingUnit.create({
      data: dto,
    });
  }

  async search(query: string) {
    return this.prisma.pollingUnit.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },

      take: 20,
    });
  }

  async findOne(id: string) {
    return this.prisma.pollingUnit.findUnique({
      where: { id },

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
  }
}
