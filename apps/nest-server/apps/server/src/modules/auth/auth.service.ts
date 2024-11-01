import { PrismaService } from '@app/core';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { SysUser } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  login(user: SysUser, response: Response) {
    throw new Error('Method not implemented.');
  }
}
