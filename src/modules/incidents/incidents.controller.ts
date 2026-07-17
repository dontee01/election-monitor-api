import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IncidentCommandService } from './commands/incident-command.service';
import type { JwtUser } from 'src/common/types/jwt-user.type';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { QueryIncidentDto } from './dto/query-incident.dto';
import { IncidentQueryService } from './queries/incident-query.service';


@ApiBearerAuth()
@ApiTags('Incidents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly commandService: IncidentCommandService,
    private readonly queryService: IncidentQueryService,
  ) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  // create(@Body() dto: CreateIncidentDto, @CurrentUser() user: JwtUser,) {
  create(@Body() dto: CreateIncidentDto, @CurrentUser() user: any,) {
    console.log('Current User:', user.id); // Log the current user for debugging
    return this.commandService.create(dto, user.id,);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() dto: QueryIncidentDto) {
    return this.queryService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.queryService.findOne(id);
  }
}
