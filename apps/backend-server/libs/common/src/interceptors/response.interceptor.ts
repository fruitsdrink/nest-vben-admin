import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from '../dtos';

/**
 * 接口响应拦截器
 * 分页数据返回一个对象，包含list和total
 * list是数组，total是总数
 * 分页参数
 * - pageSize 每页数量
 * - pageNumber 页码
 * - pageTotal 总页数
 * - total 总数
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const query = request.query;

    return next.handle().pipe(
      map((data) => {
        const { pageSize, pageNumber } = query;

        const result = new ResponseDto({
          code: `${HttpStatus.OK}`,
          message: 'success',
          data,
        });

        const { list, total } = data ?? {};
        // 如果list存在且是数组
        if (list && Array.isArray(list)) {
          // 分页数据
          result.data = list;

          if (total) {
            result.total = total;
          } else {
            result.total = list.length;
          }

          if (pageSize) {
            result.pageSize = parseInt(pageSize);
          }

          if (pageNumber) {
            result.pageNumber = parseInt(pageNumber);
          } else {
            result.pageNumber = 1;
          }

          if (pageSize > 0) {
            result.pageTotal = Math.ceil(result.total / result.pageSize);
          }
        }

        return result;
      }),
    );
  }
}
