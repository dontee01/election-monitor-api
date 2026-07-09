import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateStateDto {
  @ApiProperty({
    example: 'Lagos'
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Length(2, 5)
  code: string;
}