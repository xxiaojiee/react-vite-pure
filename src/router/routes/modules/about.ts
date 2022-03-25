import type { AppRouteRecordRaw } from '/@/router/types';

import { load } from '/@/router/constant';


const dashboard: AppRouteRecordRaw = {
  path: '/about',
  name: 'About',
  redirect: '/about/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: '关于',
    orderNo: 100000,
  },
  children: [
    {
      path: 'index',
      name: 'AboutPage',
      component: load(() => import('/@/pages/sys/about')),
      meta: {
        title: '关于',
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;
