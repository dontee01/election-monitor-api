import { QueryDto } from "src/common/dto/query.dto";

// export class QueryElectionDto extends QueryDto {
    
// }

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ElectionType } from 'src/generated/prisma/enums';

export class QueryElectionDto extends QueryDto {
  @ApiPropertyOptional({
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
    description: 'The number of elections to return per page (default is 20)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @ApiPropertyOptional({
    enum: ElectionType,
    example: ElectionType.PRESIDENTIAL,
    description: 'Filter elections by type',
  })
  @IsOptional()
  @IsEnum(ElectionType)
  type?: ElectionType;

  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Filter elections taking place on or after this date',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
    description: 'Filter elections taking place on or before this date',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter elections by active status',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
