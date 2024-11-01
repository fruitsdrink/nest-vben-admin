import { NestFactory } from '@nestjs/core';
import chalk from 'chalk';
import consola from 'consola';

import { ClientServerModule } from './client-server.module';

import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(ClientServerModule);

  await app.listen(5321, () => {
    consola.log(
      `${chalk.green('➜')}  ${chalk.bold('Nest Server')}: ${chalk.cyan(
        `http://localhost:5321/api`,
      )}`,
    );
  });
}
bootstrap();
