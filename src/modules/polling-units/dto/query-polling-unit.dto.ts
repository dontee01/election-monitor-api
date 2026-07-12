import { IsOptional } from "class-validator";
import { QueryDto } from "src/common/dto/query.dto";

export class QueryPollingUnitDto extends QueryDto {

    @IsOptional()
    wardId?: string;

}