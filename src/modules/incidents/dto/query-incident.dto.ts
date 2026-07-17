import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IncidentCategory,
  IncidentStatus,
  Severity,
} from 'generated/prisma/enums';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryIncidentDto {

  @ApiProperty({
    example: 1,
    description: 'The page number for pagination (default is 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    example: 20,
    description: 'The number of incidents to return per page (default is 20)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @ApiPropertyOptional({
    example: 'search term',
    description: 'A search term to filter incidents by title or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: IncidentStatus,
    example: IncidentStatus.PENDING,
    description: 'Filter incidents by status',
  })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiPropertyOptional({
    enum: Severity,
    example: Severity.LOW,
    description: 'Filter incidents by severity',
  })
  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @ApiPropertyOptional({
    enum: IncidentCategory,
    example: IncidentCategory.OTHER,
    description: 'Filter incidents by category',
  })
  @IsOptional()
  @IsEnum(IncidentCategory)
  category?: IncidentCategory;

  @ApiPropertyOptional({
    example: 'uuid',
    description: 'Filter incidents by election ID',
  })
  @IsOptional()
  @IsUUID()
  electionId?: string;

  @ApiPropertyOptional({
    example: 'uuid',
    description: 'Filter incidents by polling unit ID',
  })
  @IsOptional()
  @IsUUID()
  pollingUnitId?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filter incidents by reporter ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  reporterId?: number;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'The start date for the date range filter',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateFrom?: Date;

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'The end date for the date range filter',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateTo?: Date;

}