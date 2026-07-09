import { IsOptional } from "class-validator";
import { PaginationDto } from "./pagination.dto";

export class QueryDto extends PaginationDto {

    @IsOptional()
    search?: string;

    @IsOptional()
    sortBy?: string;

    @IsOptional()
    order?: 'asc' | 'desc';

}