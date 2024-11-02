/**
 * API response DTO
 */
export class ResponseDto<T> {
  constructor(value?: ResponseDto<T>) {
    if (value) {
      this.code = value.code;
      this.message = value.message;
      this.data = value.data;
      this.total = value.total;
      this.pageSize = value.pageSize;
      this.pageNumber = value.pageNumber;
      this.pageTotal = value.pageTotal;
    }
  }

  public data: T;
  public code: number;
  public message?: string;
  public total?: number;
  public pageSize?: number;
  public pageNumber?: number;
  public pageTotal?: number;
  public error?: Error;
}
