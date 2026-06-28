import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WardsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
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
}
