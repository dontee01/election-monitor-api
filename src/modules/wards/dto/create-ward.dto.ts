import {
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateWardDto {
  @IsString()
  name: string;

  @IsUUID()
  lgaId: string;
}