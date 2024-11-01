import { AppFactory } from '@app/core';

import { ServerModule } from './server.module';

import 'reflect-metadata';

AppFactory.boot({
  appName: 'Nest Server',
  mainModule: ServerModule,
});
