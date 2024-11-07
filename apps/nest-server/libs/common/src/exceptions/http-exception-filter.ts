import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { isObject, omit, isString, has } from 'es-toolkit/compat';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let expMsg = exception.getResponse();
    if (isObject(expMsg)) {
      expMsg = omit(expMsg, ['error', 'statusCode']);
      if (has(expMsg, ['field'])) {
        const { field, message } = expMsg as any;
        if (!expMsg['errors']) {
          expMsg['errors'] = {};
        }
        expMsg['errors'][field] = [message];
        expMsg = omit(expMsg, ['field']);

        if (has(expMsg, ['message'])) {
          const { message: msg, ...rest } = expMsg as any;
          expMsg = {
            ...rest,
            message: msg,
          };
        }
      }
    } else if (isString(expMsg)) {
      expMsg = { expMsg };
    }

    response.status(status).json({
      code: status,
      error: exception,
      ...(expMsg as any),
    });
  }
}
