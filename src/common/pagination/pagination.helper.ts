import { PaginationResponse } from './pagination-response.interface';

export function paginate<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
): PaginationResponse<T> {

    return {

        data,

        meta: {

            page,

            limit,

            total,

            lastPage: Math.ceil(total / limit),

        },

    };
}