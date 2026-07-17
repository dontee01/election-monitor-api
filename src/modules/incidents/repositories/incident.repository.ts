import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from 'src/common/database/base.repository';

@Injectable()
export class IncidentRepository extends BaseRepository {

    constructor(
        prisma: PrismaService,
    ) {
        super(prisma);
    }

    async create(
        tx: Prisma.TransactionClient,
        data: Prisma.IncidentCreateInput,
    ) {
        return tx.incident.create({
            data,
        });
    }

    async findById(id: string) {
        return this.prisma.incident.findUnique({
            where: { id },
        });
    }

    async findByReference(reference: string) {
        return this.prisma.incident.findUnique({
            where: {
                reference,
            },
        });
    }

    async update(
        tx: Prisma.TransactionClient,
        id: string,
        data: Prisma.IncidentUpdateInput,
    ) {
        return tx.incident.update({
            where: { id },
            data,
        });
    }

  async findMany(
    where: Prisma.IncidentWhereInput,
    skip: number,
    take: number,
  ) {
    return this.prisma.incident.findMany({

        where,

        skip,

        take,

        orderBy: {
            createdAt: 'desc',
        },

        include: {

            election: true,

            pollingUnit: {
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
            },

            reporter: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },

        },

    });

  }

  async count(
      where: Prisma.IncidentWhereInput,
  ) {

      return this.prisma.incident.count({
          where,
      });

  }

  async findByIdWithRelations(id: string) {

    return this.prisma.incident.findUnique({

        where: {
            id,
        },

        include: {

            election: true,

            reporter: true,

            pollingUnit: {
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
            },

        },

    });

}
}