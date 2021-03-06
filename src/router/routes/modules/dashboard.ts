import type { AppRouteRecordRaw } from '/@/router/types';
import { load } from '../../constant';

const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  redirect: '/dashboard/analysis',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: 'Dashboard',
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: load(() => import('/@/pages/dashboard/analysis')),
      meta: {
        // affix: true,
        title: '分析页',
      },
    },
    {
      path: 'workbench',
      name: 'Workbench',
      component: load(() => import('/@/pages/dashboard/workbench')),
      meta: {
        title: '工作台',
      },
    },
  ],
};

export default dashboard;
