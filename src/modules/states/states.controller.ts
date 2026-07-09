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

import { StatesService } from './states.service';

import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

import { Roles } from '../../common/decorators/roles.decorator';

import { Role } from '../../common/enums/role.enum';
import { ParseUuidPipe } from 'src/common/pipes/parse-uuid.pipe';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { StateMessages } from './constants/state.constants';
import { QueryStateDto } from './dto/query-state.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('States')
@ApiBearerAuth()
@Controller('states')
export class StatesController {
  constructor(
    private readonly statesService: StatesService,
  ) {}

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN,
    Role.CITIZEN
  )
  @ResponseMessage(StateMessages.CREATED)
  create(
    @Body() dto: CreateStateDto,
  ) {
    return this.statesService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryStateDto) {
    return this.statesService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('State fetched successfully')
  findOne(
    @Param('id', ParseUuidPipe) id: string,
  ) {
    return this.statesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN, Role.CITIZEN)
  update(
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateStateDto,
  ) {
    return this.statesService.update(
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
    return this.statesService.remove(id);
  }
}