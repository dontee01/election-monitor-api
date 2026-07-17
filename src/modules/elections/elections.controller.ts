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

import { ElectionsService } from './elections.service';

import { CreateElectionDto } from './dto/create-election.dto';
import { UpdateElectionDto } from './dto/update-election.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

import { Roles } from '../../common/decorators/roles.decorator';

import { Role } from '../../common/enums/role.enum';
import { ParseUuidPipe } from 'src/common/pipes/parse-uuid.pipe';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ElectionMessages } from './constants/election.constants';
import { QueryElectionDto } from './dto/query-election.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Elections')
@ApiBearerAuth()
@Controller('elections')
export class ElectionsController {
  constructor(
    private readonly electionsService: ElectionsService,
  ) {}

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN,
    Role.CITIZEN
  )
  @ResponseMessage(ElectionMessages.CREATED)
  create(
    @Body() dto: CreateElectionDto,
  ) {
    return this.electionsService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryElectionDto) {
    return this.electionsService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage(ElectionMessages.FETCHED)
  findOne(
    @Param('id', ParseUuidPipe) id: string,
  ) {
    return this.electionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN, Role.CITIZEN)
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateElectionDto,
  ) {
    return this.electionsService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUuidPipe ) id: string,) {
    return this.electionsService.remove(id);
  }
}