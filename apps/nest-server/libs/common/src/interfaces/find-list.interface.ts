import type { PaginationDto, PaginationResult } from '../dtos';

type FindListQuery<T> = PaginationDto & T;
type FindListResult<T> = PaginationResult<T>;

export interface FindList<TQuery, TResult> {
  findList(query: FindListQuery<TQuery>): Promise<FindListResult<TResult>>;
}
