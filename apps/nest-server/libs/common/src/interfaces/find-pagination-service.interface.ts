import type { PaginationDto, PaginationResult } from '../dtos';

export interface FindPaginationService<
  TQuery extends PaginationDto & { [key: string]: string },
  TResult extends PaginationResult<any>,
> {}
