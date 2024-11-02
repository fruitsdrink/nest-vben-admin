import { object, string, number, boolean } from 'yup';

/**
 * 环境变量配置
 */
export const appConfigSchema = object({
  NODE_ENV: string()
    .optional()
    .oneOf(['development', 'production', 'test', 'provision'])
    .default('production'),
  APP_PORT: number().min(3000).integer().default(5321),
  APP_PREFIX: string().required(),
  APP_ENABLE_VERSION: boolean().required(),
  APP_ENABLE_CORS: boolean().required().required(),
  APP_CORS_ORIGIN: string().optional(),
  APP_CORS_CREDENTIALS: boolean().required(),
  JWT_SECRET: string().required(),
  JWT_EXPIRES_IN: string().required(),
  JWT_COOKIE_SECURE: boolean().required(),
  JWT_REFRESH_SECRET: string().required(),
  JWT_REFRESH_EXPIRES_IN: string().required(),
  REDIS_HOST: string().required(),
  REDIS_PORT: number().required(),
  REDIS_PASSWORD: string().required(),
  REDIS_DB: number().required(),
  REDIS_KEY_PREFIX: string().required(),
});
