import type { AppRouteRecordRaw } from '/@/router/types';
import {
  LAYOUT,
} from '/@/router/constant';
import { load } from '../constant';

export const ERROR_LOG_ROUTE: AppRouteRecordRaw[] = [
  {
    path: '/error-log',
    name: 'ErrorLog',
    component: LAYOUT,
    redirect: '/error-log/list',
    meta: {
      title: 'ErrorLog',
      hideBreadcrumb: true,
      hideChildrenInMenu: true,
    },
    children: [
      {
        path: 'list',
        name: 'ErrorLogList',
        component: load(() => import('/@/pages/sys/error-log')),
        meta: {
          title: '错误日志列表',
          hideBreadcrumb: true,
          currentActiveMenu: '/error-log',
        },
      },
    ],
  },
];
