import type { RouteRecordRaw } from 'vue-router';
import { VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout } from '#/layouts';
import { MdiUser } from '@vben/icons';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: VBEN_LOGO_URL,
      title: '系统信息',
    },
    name: 'System',
    path: '/system',
    children: [
      {
        name: 'UserInfo',
        path: '/system/user',
        meta: {
          title: '用户管理',
          icon: MdiUser,
        },
        component: () => import('#/views/system/user.vue'),
      },
    ],
  },
];

export default routes;
