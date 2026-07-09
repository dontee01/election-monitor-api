export function paginate(
    page: number,
    limit: number,
    total: number,
) {
    return {

        page,

        limit,

        total,

        lastPage: Math.ceil(total / limit),

    };
}