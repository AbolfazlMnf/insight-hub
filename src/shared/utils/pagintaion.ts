export const getPagination = (page: number, limit: number) => {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
};

export function getPaginationMeta(
  page: number,
  limit: number,
  totalCount: number,
) {
  return {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  };
}
