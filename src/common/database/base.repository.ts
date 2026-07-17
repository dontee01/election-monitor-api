import { PrismaService } from 'src/prisma/prisma.service';

export abstract class BaseRepository {
    constructor(
        protected readonly prisma: PrismaService,
    ) {}
}