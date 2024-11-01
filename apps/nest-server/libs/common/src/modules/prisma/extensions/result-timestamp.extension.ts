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
            return new Date(data.createdAt).getTime();
          },
        },
        updatedAt: {
          compute(data: any) {
            return new Date(data.updatedAt).getTime();
          },
        },
      },
    },
  };
}

export type ResultTimestamp = ReturnType<
  typeof createResultTimestampExtension
>['result']['$allModels']['createdAt'];
