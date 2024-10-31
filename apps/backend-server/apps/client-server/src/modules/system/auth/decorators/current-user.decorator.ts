import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUserByContext = (context: ExecutionContext) => {
  return context.switchToHttp().getRequest().user;
};

/**
 * 当前用户装饰器
 */
export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return getCurrentUserByContext(context);
});
