import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { LgasService } from './lgas.service';

import { CreateLgaDto } from './dto/create-lga.dto';
import { UpdateLgaDto } from './dto/update-lga.dto';
import { QueryLgaDto } from './dto/query-lga.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe';

import { Role } from 'generated/prisma/client';
import { LgaMessages } from './constants/lga.constants';

@ApiTags('LGAs')
@Controller('lgas')
export class LgasController {
  constructor(
    private readonly lgasService: LgasService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage(LgaMessages.CREATED)
  create(@Body() dto: CreateLgaDto) {
    return this.lgasService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryLgaDto) {
    return this.lgasService.findAll(query);
  }

  @Get('/state/:stateId')
  findByState(
    @Param('stateId', ParseUuidPipe)
    stateId: string,
  ) {
    return this.lgasService.findByState(stateId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUuidPipe)
    id: string,
  ) {
    return this.lgasService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage(LgaMessages.UPDATED)
  update(
    @Param('id', ParseUuidPipe)
    id: string,
    @Body() dto: UpdateLgaDto,
  ) {
    return this.lgasService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage(LgaMessages.DELETED)
  remove(
    @Param('id', ParseUuidPipe)
    id: string,
  ) {
    return this.lgasService.remove(id);
  }
}