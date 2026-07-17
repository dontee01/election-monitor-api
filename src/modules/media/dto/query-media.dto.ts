import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  MediaType,
} from 'generated/prisma/enums';

import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class QueryMediaDto {

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit = 20;

  @ApiPropertyOptional({ enum: MediaType })
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174',
    description: 'The ID of the incident to which the media belongs',
  })
  @IsOptional()
  @IsUUID()
  incidentId?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174',
    description: 'The ID of the user who uploaded the media',
  })
  @IsOptional()
  @IsUUID()
  uploadedById?: string;
}