import { Prisma } from '@prisma/client';

/**
 * 软删除扩展
 * @returns 删除的数据
 */
export function createSoftDeleteExtension<M, A>() {
  return {
    name: 'softDelete',
    model: {
      $allModels: {
        async softDelete(
          this: M,
          args: {
            where: Prisma.Args<M, 'updateMany'>['where'];
            deletedBy?: string;
          },
        ): Promise<Prisma.Result<M, A, 'update'>> {
          const context = Prisma.getExtensionContext(this) as any;

          return context.updateMany({
            where: args.where,
            data: {
              deletedAt: Date.now(),
              deletedBy: args.deletedBy ? args.deletedBy : 'system',
            },
          });
        },
      },
    },
  };
}

export type SoftDelete<M, A> = ReturnType<
  typeof createSoftDeleteExtension<M, A>
>['model']['$allModels']['softDelete'];
