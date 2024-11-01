import { Prisma } from '@prisma/client';
import { has } from 'es-toolkit/compat';
import { DELETEDAT } from '../constants';

/**
 * 根据Id查询
 */
export function createFindByIdExtension<TModel = any, TArgs = any>() {
  return {
    name: 'findById',
    model: {
      $allModels: {
        async findById(
          this: TModel,
          id: string,
          args?: Prisma.Exact<TArgs, Prisma.Args<TModel, 'findFirst'>>,
        ): Promise<Prisma.Result<TModel, TArgs, 'findFirst'>> {
          const context = Prisma.getExtensionContext(this) as any;

          if (has(context, ['fields', DELETEDAT])) {
            return context.findFirst({
              where: { id, [DELETEDAT]: 0 },
              ...((args ?? {}) as any),
            });
          } else {
            return context.findFirst({
              where: { id },
              ...((args ?? {}) as any),
            });
          }
        },
      },
    },
  };
}

export type FindById<TModel, TArgs> = ReturnType<
  typeof createFindByIdExtension<TModel, TArgs>
>['model']['$allModels']['findById'];
