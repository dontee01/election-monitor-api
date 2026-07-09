export interface PaginationMeta {

    page: number;

    limit: number;

    total: number;

    lastPage: number;
}

export interface PaginationResponse<T> {

    data: T[];

    meta: PaginationMeta;
}