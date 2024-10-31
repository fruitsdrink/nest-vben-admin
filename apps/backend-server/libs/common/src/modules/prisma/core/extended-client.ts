import { PrismaClient } from '@prisma/client';

import {
  createPaginationExtension,
  type Pagination,
  createResultTimestampExtension,
  createFindByIdExtenstion,
  type FindById,
  SoftDelete,
  createSoftDeleteExtension,
} from '../extensions';

// 分页扩展类型
type ModelsWithExtensions = {
  [Model in keyof PrismaClient]: PrismaClient[Model] extends {
    findMany: (args: infer TArgs) => Promise<any>;
  }
    ? {
        pagination: Pagination<PrismaClient[Model], TArgs>;
      } & PrismaClient[Model]
    : PrismaClient[Model];
};

// 根据Id查询扩展类型
type ModelsFindIdWithExtensions = {
  [Model in keyof PrismaClient]: PrismaClient[Model] extends {
    findFirst: (args: infer TArgs) => Promise<any>;
  }
    ? {
        findById: FindById<PrismaClient[Model], TArgs>;
      } & PrismaClient[Model]
    : PrismaClient[Model];
};

// 软删除扩展类型
type ModelsSoftDeleteWithExtensions = {
  [Model in keyof PrismaClient]: PrismaClient[Model] extends {
    update: (args: infer TArgs) => Promise<any>;
  }
    ? {
        softDelete: SoftDelete<PrismaClient[Model], TArgs>;
      } & PrismaClient[Model]
    : PrismaClient[Model];
};

class UntypedExtendedClient extends PrismaClient {
  constructor(options?: ConstructorParameters<typeof PrismaClient>[0]) {
    super(options);
    // 注入分页、result处理扩展
    return this.$extends(createPaginationExtension(this))
      .$extends(createFindByIdExtenstion())
      .$extends(createSoftDeleteExtension())
      .$extends({
        query: {
          $allOperations({ args, query, operation }) {
            const matchOperations = [
              'findUnique',
              'findUniqueOrThrow',
              'findFirst',
              'findFirstOrThrow',
              'findMany',
              'count',
              'aggregate',
            ];
            if (matchOperations.includes(operation)) {
              const { where = {} } = args;
              if (!('deletedAt' in where)) {
                where.deletedAt = 0;
              }
              args = {
                ...args,
                where,
              };
            }

            return query(args);
          },
        },
      })
      .$extends(createResultTimestampExtension()) as this;
  }
}

const ExtendedPrismaClient = UntypedExtendedClient as unknown as new (
  options?: ConstructorParameters<typeof PrismaClient>[0],
) => PrismaClient &
  ModelsWithExtensions &
  ModelsFindIdWithExtensions &
  ModelsSoftDeleteWithExtensions;

export { ExtendedPrismaClient };
