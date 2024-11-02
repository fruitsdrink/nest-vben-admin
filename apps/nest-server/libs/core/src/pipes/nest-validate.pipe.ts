import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const nestValidatePipe = new ValidationPipe({
  whitelist: true, // 只允许白名单
  forbidNonWhitelisted: true, // 禁止非白名单
  transform: true, // 启用转换
  transformOptions: {
    enableImplicitConversion: true, // 允许隐式转换
  },
  exceptionFactory: (errors) => {
    const result = errors.map((error) => ({
      field: error.property,
      message: [error.constraints[Object.keys(error.constraints)[0]]],
    }));
    // 合并相同字段的错误信息
    const map = new Map();
    result.forEach((item) => {
      if (map.has(item.field)) {
        map.set(item.field, map.get(item.field).concat(item.message));
      } else {
        map.set(item.field, item.message);
      }
    });

    // 合并所有错误消息为字符串数组
    const messages = errors.map((error) => error.constraints[Object.keys(error.constraints)[0]]);
    const errorList = Array.from(map).map(([field, message]) => ({
      field,
      message,
    }));
    // 将field转换为属性
    const errorObject = {};
    errorList.forEach((item) => {
      errorObject[item.field] = item.message;
    });

    const error = {
      statusCode: 400,
      errors: errorObject,
      messages,
    };

    const message = error.messages.join('，');
    return new BadRequestException({ ...error, message });
  },
});
