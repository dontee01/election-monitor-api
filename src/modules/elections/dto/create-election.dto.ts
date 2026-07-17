import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ElectionType } from 'generated/prisma/enums'; // Assuming ElectionType is exported from your Prisma client or a shared enum file

// Assuming ElectionType is exported from your Prisma client or a shared enum file
// export enum ElectionType {
//   PRESIDENTIAL = 'PRESIDENTIAL',
//   GUBERNATORIAL = 'GUBERNATORIAL',
//   SENATORIAL = 'SENATORIAL',
//   HOUSE_OF_REPS = 'HOUSE_OF_REPS',
//   HOUSE_OF_ASSEMBLY = 'HOUSE_OF_ASSEMBLY',
//   LOCAL_GOVERNMENT = 'LOCAL_GOVERNMENT',
// }

export class CreateElectionDto {
  @ApiProperty({
    example: '2023 General Elections',
    description: 'The name of the election',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'General elections for the year 2023',
    description: 'A brief description of the election',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'PRESIDENTIAL',
    description: 'The type of the election',
  })
  @IsEnum(ElectionType)
  @IsNotEmpty()
  type: ElectionType;

  @ApiProperty({
    example: '2023-01-01',
    description: 'The date of the election',
  })
  @IsDateString()
  @IsNotEmpty()
  electionDate: string | Date;

  @ApiProperty({
    example: 'ELEC-2023-001',
    description: 'The reference number for the election',
  })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the election is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
