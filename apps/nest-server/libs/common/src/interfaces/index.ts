import type { Create } from './create.interface';
import type { Delete } from './delete.interface';
import type { FindList } from './find-list.interface';
import type { FindMany } from './find-many.interface';
import type { FindOne } from './find-one.interface';
import type { Update } from './update.interface';

export * from './find-one.interface';
export * from './find-many.interface';
export * from './find-list.interface';
export * from './create.interface';
export * from './update.interface';
export * from './delete.interface';

export interface CRUD<TResult, TFindLMany, TFindList, TCreate, TUpdate>
  extends FindOne<TResult>,
    FindMany<TFindLMany, TResult>,
    FindList<TFindList, TResult>,
    Create<TCreate, TResult>,
    Update<TUpdate, TResult>,
    Delete<TResult> {}
