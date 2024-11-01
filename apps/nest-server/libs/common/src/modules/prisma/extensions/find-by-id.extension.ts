import { Prisma } from '@prisma/client';

/**
 * 根据Id查询
 */
export function createFindByIdExtenstion<TModel = any, TArgs = any>() {
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

          return context.findFirst({
            where: { id, deletedAt: 0 },
            ...((args ?? {}) as any),
          });
        },
      },
    },
  };
}

export type FindById<TModel, TArgs> = ReturnType<
  typeof createFindByIdExtenstion<TModel, TArgs>
>['model']['$allModels']['findById'];
