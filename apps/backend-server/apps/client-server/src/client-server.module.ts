import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Modules } from './modules';
import Joi from 'joi';

const configSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  APP_PORT: Joi.number().port().default(8000),
  APP_ENABLE_CORS: Joi.boolean().required(),
  APP_CORS_ORIGIN: Joi.string(),
  APP_PREFIX: Joi.string().required(),
  APP_ENABLE_VERSION: Joi.boolean().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_COOKIE_SECURE: Joi.boolean().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

  CAPTCHA_TYPE: Joi.number().required().min(0),
  CAPTCHA_LENGTH: Joi.number().required().min(0),
  CAPTCHA_CASE_SENSITIVE: Joi.boolean().required(),
  CAPTCHA_TTL: Joi.string().required(),

  REGISTER_ENABLE: Joi.boolean().required(),
  REGISTER_VERIFY: Joi.boolean().required(),
  REGISTER_CHANGE_PASSWORD: Joi.boolean().required(),
  REGISTER_PASSWORD_STRENGTH: Joi.number().required().min(0).max(4),
});

/**
 * 客户端服务模块
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['./env/client-server/.env', './env/client-server/.production.env'],
      validationSchema: configSchema,
    }),
    ...Modules,
  ],
})
export class ClientServerModule {}
