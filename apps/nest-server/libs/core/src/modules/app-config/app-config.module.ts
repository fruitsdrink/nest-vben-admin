import { Module, type DynamicModule } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { cwd } from 'process';
import path from 'path';
import { ConfigModule } from '@nestjs/config';
import { appConfigSchema } from './schema';

type AppConfigModuleOptions = {
  envPath?: string;
};

/**
 * 应用配置模块
 */
@Module({})
export class AppConfigModule {
  static forRoot(options?: AppConfigModuleOptions): DynamicModule {
    const envPath = options?.envPath || './env/server';
    const absEnvPath = path.resolve(cwd(), envPath);
    const nodeEnv = process.env.NODE_ENV || 'production';
    return {
      global: true,
      module: AppConfigModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          envFilePath: [
            path.resolve(absEnvPath, '.env'),
            path.resolve(absEnvPath, '.env.local'),
            path.resolve(absEnvPath, `.env.${nodeEnv}`),
          ],
          // validationSchema: appConfigSchema,
          validate: (config: Record<string, unknown>) => {
            try {
              return appConfigSchema.validateSync(config, { stripUnknown: true, abortEarly: true });
            } catch (error) {
              throw error;
            }
          },
        }),
      ],
      providers: [AppConfigService],
      exports: [AppConfigService],
    };
  }
}
