import { Allow } from 'class-validator';

export class FindManyDto {
  @Allow()
  keyword?: string;
  @Allow()
  phone?: string;
}
