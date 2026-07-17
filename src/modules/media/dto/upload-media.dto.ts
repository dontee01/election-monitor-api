import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { MediaType } from "generated/prisma/enums";

export class UploadMediaDto {

  @ApiProperty({
    enum: MediaType,
    example: MediaType.IMAGE,
    description: 'The type of media being uploaded',
  })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({
    description: 'The ID of the incident associated with the media',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  incidentId?: string;

}