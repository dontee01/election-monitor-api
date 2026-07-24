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

import { PollingUnitsService } from './polling-units.service';

import { CreatePollingUnitDto } from './dto/create-polling-unit.dto';
import { UpdatePollingUnitDto } from './dto/update-polling-unit.dto';
import { QueryPollingUnitDto } from './dto/query-polling-unit.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

import { ParseUuidPipe } from '../../common/pipes/parse-uuid.pipe';

import { Role } from 'generated/prisma/client';
import { PollingUnitMessages } from './constants/polling-unit.constants';

@ApiTags('Polling Units')
@Controller('polling-units')
export class PollingUnitsController {
  constructor(
    private readonly pollingUnitsService: PollingUnitsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage(PollingUnitMessages.CREATED)
  create(@Body() dto: CreatePollingUnitDto) {
    return this.pollingUnitsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryPollingUnitDto) {
    return this.pollingUnitsService.findAll(query);
  }

  @Get('/search')
  search(@Query('q') query: string) {
    return this.pollingUnitsService.search(query);
  }

  @Get('/ward/:wardId')
  findByWard(
    @Param('wardId', ParseUuidPipe)
    wardId: string,
  ) {
    return this.pollingUnitsService.findByWard(wardId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUuidPipe)
    id: string,
  ) {
    return this.pollingUnitsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage(PollingUnitMessages.UPDATED)
  update(
    @Param('id', ParseUuidPipe)
    id: string,
    @Body() dto: UpdatePollingUnitDto,
  ) {
    return this.pollingUnitsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage(PollingUnitMessages.DELETED)
  remove(
    @Param('id', ParseUuidPipe)
    id: string,
  ) {
    return this.pollingUnitsService.remove(id);
  }
}