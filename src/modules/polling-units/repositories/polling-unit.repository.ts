import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from 'generated/prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from 'src/common/database/base.repository';

@Injectable()
export class PollingUnitRepository extends BaseRepository {

    constructor(
        prisma: PrismaService,
    ) {
        super(prisma);
    }

    async create(
        tx: Prisma.TransactionClient,
        data: Prisma.PollingUnitCreateInput,
    ) {
        return tx.pollingUnit.create({
            data,
        });
    }

    async findById(id: string) {
        return this.prisma.pollingUnit.findUnique({
            where: { id },
        });
    }

    async findByReference(reference: string) {
        return this.prisma.pollingUnit.findUnique({
            where: {
                code: reference,
            },
        });
    }

    async update(
        tx: Prisma.TransactionClient,
        id: string,
        data: Prisma.ElectionUpdateInput,
    ) {
        return tx.election.update({
            where: { id },
            data,
        });
    }
}