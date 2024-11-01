import { Prisma } from '@prisma/client';
import { has } from 'es-toolkit/compat';
import { DELETEDAT } from '../constants';

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

          if (has(context, ['fields', DELETEDAT])) {
            return context.updateMany({
              where: args.where,
              data: {
                [DELETEDAT]: Date.now(),
                deletedBy: args.deletedBy ? args.deletedBy : 'system',
              },
            });
          } else {
            throw new Error('The model does not have a deletedAt field');
          }
        },
      },
    },
  };
}

export type SoftDelete<M, A> = ReturnType<
  typeof createSoftDeleteExtension<M, A>
>['model']['$allModels']['softDelete'];
