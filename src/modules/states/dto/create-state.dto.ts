import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateStateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(2, 5)
  code: string;
}