import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

import { Type } from 'class-transformer';

import { IncidentCategory } from 'src/generated/prisma/enums';
// import { IncidentCategory } from 'src/common/enums/incident-category.enum';
import { IncidentSeverity } from 'src/common/enums/incident-severity.enum';

export enum IncidentDomain {
  COMMUNITY = 'COMMUNITY',
  ELECTION = 'ELECTION',
}

export class CreateIncidentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(IncidentCategory)
  category: IncidentCategory;

  @IsNotEmpty()
  @IsEnum(IncidentSeverity)
  severity: IncidentSeverity;

  @IsOptional()
  @IsEnum(IncidentDomain)
  domain?: IncidentDomain;

  /**
   * Required for election incidents.
   */
  @ValidateIf(
    (o) => o.domain === IncidentDomain.ELECTION,
  )
  @IsNotEmpty()
  @IsString()
  electionId?: string;

  /**
   * Optional for community incidents.
   * Required when the election incident is associated
   * with a polling unit.
   */
  @IsOptional()
  @IsString()
  pollingUnitId?: string;

  /**
   * Useful for community incidents where we know
   * the ward but there is no polling unit involved.
   */
  @IsOptional()
  @IsString()
  wardId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  occurredAt?: Date;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsString()
  address?: string;
}