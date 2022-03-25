import type { AppRouteRecordRaw } from '/@/router/types';

import { load } from '/@/router/constant';

const permission: AppRouteRecordRaw = {
  path: '/level',
  name: 'Level',
  redirect: '/level/menu1/menu1-1/menu1-1-1',
  meta: {
    orderNo: 2000,
    icon: 'ion:menu-outline',
    title: '多级菜单',
  },

  children: [
    {
      path: 'menu1',
      name: 'Menu1Demo',
      meta: {
        title: 'Menu1',
      },
      redirect: '/level/menu1/menu1-1/menu1-1-1',
      children: [
        {
          path: 'menu1-1',
          name: 'Menu11Demo',
          meta: {
            title: 'Menu1-1',
          },
          redirect: '/level/menu1/menu1-1/menu1-1-1',
          children: [
            {
              path: 'menu1-1-1',
              name: 'Menu111Demo',
              component: load(() => import('/@/pages/demo/level/Menu111')),
              meta: {
                title: 'Menu111',
              },
            },
          ],
        },
        {
          path: 'menu1-2',
          name: 'Menu12Demo',
          component: load(() => import('/@/pages/demo/level/Menu12')),
          meta: {
            title: 'Menu1-2',
          },
        },
      ],
    },
    {
      path: 'menu2',
      name: 'Menu2Demo',
      component: load(() => import('/@/pages/demo/level/Menu2')),
      meta: {
        title: 'Menu2',
        // ignoreKeepAlive: true,
      },
    },
  ],
};

export default permission;
