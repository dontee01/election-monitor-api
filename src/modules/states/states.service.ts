import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { ErrorMessages } from 'src/common/constants/error-messages';
import { QueryStateDto } from './dto/query-state.dto';
import { paginate } from 'src/common/pagination/pagination.helper';
import { Prisma } from 'src/generated/prisma/client';
import { StateMessages } from './constants/state.constants';

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

  async findAll(query: QueryStateDto) {
    const { page, limit, search, sortBy, order } = query;

    const skip = (page - 1) * limit;

    console.log('Query:', query);
    const where: Prisma.StateWhereInput = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }
      : {};

    const [data, total] = 
        await this.prisma.$transaction([
            this.prisma.state.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    // [sortBy || 'name']: order || 'asc',
                    name: 'asc',
                },
            }),
            this.prisma.state.count({ where, }),
        ]);
        console.log('Data:', data);

        return paginate(data, total, page, limit);

    // return this.prisma.state.findMany({
    //   where: {
    //     deletedAt: null
    //   },
    //   orderBy: {
    //     name: 'asc',
    //   },
    // });
  }

  async findOne(id: string) {
    // const state =
    //   await this.prisma.state.findUnique({
    //     where: { id },
    //   });

    // if (!state) {
    //   throw new NotFoundException(
    //     'State not found',
    //   );
    // }
    const state = await this.ensureExists(id);

    return state;
  }

  async update(
    id: string,
    dto: UpdateStateDto,
  ) {
    // await this.findOne(id);
    await this.findStateOrThrow(id);

    return this.prisma.state.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    // await this.findOne(id);
    await this.findStateOrThrow(id);

    await this.prisma.state.delete({
      where: { id },
    });

    return {
      message: 'State deleted successfully',
    };
  }

  // private ensureUnique();

  private async ensureExists(id: string) {

    const state =
      await this.prisma.state.findUnique({
        where: { id },
      });

    if (!state)
        throw new NotFoundException(ErrorMessages.STATE_NOT_FOUND);

    return state;
  }

  private async findStateOrThrow(
      id: string,
  ) {

      const state =
          await this.prisma.state.findUnique({
              where: {
                  id,
              },
          });

      if (!state) {

          throw new NotFoundException(
              StateMessages.NOT_FOUND,
          );

      }

      return state;

  }

}