import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from 'src/common/database/base.repository';

@Injectable()
export class MediaRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  create(tx: Prisma.TransactionClient, data: Prisma.MediaCreateInput) {
    return tx.media.create({
        data,
    });
  }

  findById(id: string) {
    return this.prisma.media.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
        incident: {
          select: {
            id: true,
            reference: true,
            title: true,
          },
        },
      },
    });
  }

  findMany(
    where: Prisma.MediaWhereInput,
    skip: number,
    take: number,
  ) {
    return this.prisma.media.findMany({
      where,
      skip,
      take,
      orderBy: {
        uploadedAt: 'desc',
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
        incident: {
          select: {
            id: true,
            reference: true,
            title: true,
          },
        },
      },
    });
  }

  count(where: Prisma.MediaWhereInput) {
    return this.prisma.media.count({
      where,
    });
  }

  delete(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.media.delete({
      where: { id },
    });
  }

}