import { Prisma, PrismaClient } from '@prisma/client';
import { has } from 'es-toolkit/compat';
import { DELETEDAT } from '../constants';

type PaginationRes<T> = {
  code: number;
  message?: string;
  list: T;
  total: number;
  pageSize: number;
  pageNumber: number;
  pageTotal: number;
};

/**
 * 查询并返回列表+总数
 */
export function createPaginationExtension<TModel = any, TArgs = any>(prisma: PrismaClient) {
  return {
    name: 'pagination',
    model: {
      $allModels: {
        async pagination(
          this: TModel,
          args?: Prisma.Exact<TArgs, Prisma.Args<TModel, 'findMany'>>,
          limit?: {
            pageSize?: number;
            pageNumber?: number;
            order?: {
              fieldName?: string;
              direction?: 'asc' | 'desc';
            };
          },
        ): Promise<PaginationRes<Prisma.Result<TModel, TArgs, 'findMany'>>> {
          const context = Prisma.getExtensionContext(this);
          const { pageNumber = 1, pageSize = 10, order } = limit ?? {};
          const { fieldName = 'id', direction = 'asc' } = order ?? {};

          const { where = {}, ...rest } = (args as any) ?? {};

          const [data, total] = await prisma.$transaction([
            (context as any).findMany({
              orderBy: { [fieldName]: direction },
              skip: (pageNumber - 1) * pageSize,
              take: parseInt(pageSize as unknown as string),
              where: has(context, ['fields', DELETEDAT])
                ? { [DELETEDAT]: 0, ...where }
                : { ...where },
              ...((rest ?? {}) as any),
            }),
            (context as any).count({
              where: has(context, ['fields', DELETEDAT])
                ? { [DELETEDAT]: 0, ...(args as any)?.where }
                : { ...(args as any)?.where },
            }),
          ]);

          const pageTotal = Math.ceil(total / pageSize);

          return {
            code: 0,
            message: 'ok',
            list: data ?? [],
            total,
            pageSize,
            pageNumber,
            pageTotal,
          };
        },
      },
    },
  };
}

export type Pagination<TModel, TArgs> = ReturnType<
  typeof createPaginationExtension<TModel, TArgs>
>['model']['$allModels']['pagination'];
