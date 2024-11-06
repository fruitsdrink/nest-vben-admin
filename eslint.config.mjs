// @ts-check

import { defineConfig } from '@vben/eslint-config';

const config = defineConfig([{ ignores: ['apps/nest-server/**/*.*'] }]);

const extentsConfig = {
  "extends": ["eslint:recommended", "standard",  "plugin:prettier/recommended"]
}
export default { ...config,...extentsConfig };
