import { PartialType } from '@nestjs/mapped-types';
import { CreatePollingUnitDto } from './create-polling-unit.dto';

export class UpdatePollingUnitDto extends PartialType(CreatePollingUnitDto) {}