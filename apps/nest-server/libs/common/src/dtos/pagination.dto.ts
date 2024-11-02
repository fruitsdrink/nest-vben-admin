export interface PaginationDto {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  orderType?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  list: T[];
  total: number;
  pageNumber: number;
  pageSize: number;
  pageTotal: number;
  orderBy?: string;
  orderType?: 'asc' | 'desc';
}
