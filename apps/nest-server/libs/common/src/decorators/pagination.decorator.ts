import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { PaginationDto } from '../dtos';

export const Pagination = createParamDecorator(
  (data: Partial<PaginationDto>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const { pageSize, pageNumber, orderBy, orderType } = request.query;
    let page = 1;
    let limit = 10;

    if (data && data.pageSize) {
      limit = parseInt(data.pageSize.toString());
    } else {
      if (pageSize) {
        limit = parseInt(pageSize.toString());
      }
    }

    if (data && data.pageNumber) {
      page = parseInt(data.pageNumber.toString());
    } else {
      if (pageNumber) {
        page = parseInt(pageNumber.toString());
      }
    }

    let orderByColumn = orderBy ? orderBy.toString() : '';
    let orderTypeValue = orderType
      ? orderType.toString().toLowerCase() === 'asc'
        ? 'asc'
        : 'desc'
      : '';

    if (!orderByColumn && data && data.orderBy) {
      orderByColumn = data.orderBy;
    }

    if (!orderTypeValue && data && data.orderType) {
      orderTypeValue = data.orderType.toLowerCase() === 'asc' ? 'asc' : 'desc';
    }

    return {
      pageNumber: page > 0 ? page : 1,
      pageSize: limit > 0 ? limit : 10,
      orderBy: orderByColumn ? orderByColumn : null,
      orderType: orderByColumn ? orderTypeValue : null,
    };
  },
);
