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

import { WardsService } from './wards.service';

import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { QueryWardDto } from './dto/query-ward.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe';

import { Role } from 'src/generated/prisma/client';
import { WardMessages } from './constants/ward.constants';

@ApiTags('Wards')
@Controller('wards')
export class WardsController {
  constructor(
    private readonly wardsService: WardsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage(WardMessages.CREATED)
  create(@Body() dto: CreateWardDto) {
    return this.wardsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryWardDto) {
    return this.wardsService.findAll(query);
  }

  @Get('/lga/:lgaId')
  findByLga(
    @Param('lgaId', ParseUuidPipe)
    lgaId: string,
  ) {
    return this.wardsService.findByLga(lgaId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUuidPipe)
    id: string,
  ) {
    return this.wardsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage(WardMessages.UPDATED)
  update(
    @Param('id', ParseUuidPipe)
    id: string,
    @Body() dto: UpdateWardDto,
  ) {
    return this.wardsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage(WardMessages.DELETED)
  remove(
    @Param('id', ParseUuidPipe)
    id: string,
  ) {
    return this.wardsService.remove(id);
  }
}