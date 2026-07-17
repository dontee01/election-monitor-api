import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';
import { QueryElectionDto } from './dto/query-election.dto';

import { paginate } from '../../common/pagination/pagination.helper';

import { ElectionMessages } from './constants/election.constants';
import { Prisma } from 'generated/prisma/client'; // ✅ Fixed Import

@Injectable()
export class ElectionsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateElectionDto) {
    // Unique check works perfectly since reference is unique
    const exists = await this.prisma.election.findUnique({
      where: {
        reference: dto.reference,
      },
    });

    if (exists) {
      throw new ConflictException(ElectionMessages.EXISTS);
    }

    return this.prisma.election.create({
      data: dto,
    });
  }

  async search(query: string) {
    const limit = 20; 
    return this.prisma.election.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive', // ✅ Fixed QueryMode type
            },
          },
          {
            reference: {
              contains: query,
              mode: 'insensitive', // ✅ Fixed QueryMode type
            },
          },
        ],
      },
      take: limit,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAll(query: QueryElectionDto) {
    // Ensure numerical fallbacks in case DTO validation lets strings pass or values are undefined
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const { search } = query;

    const skip = (page - 1) * limit;

    // ✅ Replaced "any" with proper typed Prisma conditions safely
    const where: Prisma.ElectionWhereInput = {};
    // const where: any = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive', // ✅ Fixed QueryMode type
          },
        },
        {
          reference: {
            contains: search,
            mode: 'insensitive', // ✅ Fixed QueryMode type
          },
        },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.election.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.election.count({
        where,
      }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const election = await this.prisma.election.findUnique({
      where: {
        id,
      },
    });

    if (!election) {
      throw new NotFoundException(ElectionMessages.NOT_FOUND);
    }

    return election;
  }

  async update(id: string, dto: UpdateElectionDto) {
    // 1. Verify existence
    await this.findOne(id);

    // 2. ⚠️ Handle unique reference constraint payload changes safely
    if (dto.reference) {
      const conflictCheck = await this.prisma.election.findFirst({
        where: {
          reference: dto.reference,
          id: { not: id }, // Exclude the current record
        },
      });

      if (conflictCheck) {
        throw new ConflictException(ElectionMessages.EXISTS);
      }
    }

    return this.prisma.election.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.election.delete({
      where: {
        id,
      },
    });

    return {
      message: ElectionMessages.DELETED,
    };
  }
}
