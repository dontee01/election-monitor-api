import { IsNotEmpty, IsString, IsEnum, IsInt, IsOptional, IsDate, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { IncidentCategory } from 'src/common/enums/incident-category.enum';
import { IncidentSeverity } from 'src/common/enums/incident-severity.enum';
// import { IncidentCategory } from 'generated/prisma/enums';

// Optional: Define enums if Category and Severity have fixed values
// export enum IncidentCategory {
//   VANDALISM = 'VANDALISM',
//   VOTE_BUYING = 'VOTE_BUYING',
//   VIOLENCE = 'VIOLENCE',
//   DELAY = 'DELAY',
//   OTHER = 'OTHER',
// }

// export enum IncidentSeverity {
//   LOW = 'LOW',
//   MEDIUM = 'MEDIUM',
//   HIGH = 'HIGH',
//   CRITICAL = 'CRITICAL',
// }

export class CreateIncidentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(IncidentCategory) // Change to @IsString() if not using an enum
  category: IncidentCategory;

  @IsNotEmpty()
  @IsEnum(IncidentSeverity) // Change to @IsString() if not using an enum
  severity: IncidentSeverity;

  @IsNotEmpty()
  @IsString()
  pollingUnitId: string;

  @IsNotEmpty()
  @IsString()
  electionId: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date) // Ensures query/body strings are converted to actual Date objects
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
}
