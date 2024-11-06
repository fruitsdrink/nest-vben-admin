import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/api/v1': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/v1/, ''),
            target: 'http://localhost:5321/api/v1',
            ws: true,
          },
        },
      },
    },
  };
});
