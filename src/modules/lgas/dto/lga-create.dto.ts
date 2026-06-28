import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateLgaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  stateId: string;
}