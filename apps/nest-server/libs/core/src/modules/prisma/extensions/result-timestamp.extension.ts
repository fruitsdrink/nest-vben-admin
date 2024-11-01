import { has } from 'es-toolkit/compat';

/**
 * 响应创建时间、更新时间转为时间戳
 */
export function createResultTimestampExtension() {
  return {
    name: 'resultTimestamp',
    result: {
      $allModels: {
        createdAt: {
          compute(data: any) {
            if (has(data, 'createdAt')) {
              return new Date(data.createdAt).getTime();
            }
            return 0;
          },
        },
        updatedAt: {
          compute(data: any) {
            if (has(data, 'updatedAt')) {
              return new Date(data.updatedAt).getTime();
            }
            return 0;
          },
        },
      },
    },
  };
}

export type ResultTimestamp = ReturnType<
  typeof createResultTimestampExtension
>['result']['$allModels']['createdAt'] &
  ReturnType<typeof createResultTimestampExtension>['result']['$allModels']['updatedAt'];
