import { load, LOGIN_NAME, EXCEPTION_COMPONENT, PAGE_NOT_FOUND_NAME } from '../constant';

import type { AppRouteRecordRaw } from '/@/router/types';

const LAYOUT = load(() => import('/@/layouts/default/index'));

// 获取本地路由
export const getStaticRoutes = () => {
  const routeModuleList: AppRouteRecordRaw[] = [];
  const modules = import.meta.globEager('./modules/**/*.ts');
  Object.keys(modules).forEach((key) => {
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
  });
  console.log('staticRoutes:', routeModuleList);
  return routeModuleList;
};

export const LOGIN: AppRouteRecordRaw = {
  path: '/login',
  name: LOGIN_NAME,
  component: load(() => import('../../pages/sys/login/Login')),
  meta: {
    title: '登录',
  },
};

export const MAIN_OUT: AppRouteRecordRaw = {
  path: '/main-out',
  name: 'MainOut',
  component: load(() => import('../../pages/main-out')),
  meta: {
    title: 'MainOut',
    ignoreAuth: true,
  },
};

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: EXCEPTION_COMPONENT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
};

export const ERROR_LOG_ROUTE: AppRouteRecordRaw[] = [
  {
    path: '/error-log',
    name: 'ErrorLog',
    redirect: '/error-log/list',
    meta: {
      title: 'ErrorLog',
      hideBreadcrumb: true,
      hideChildrenInMenu: true,
    },
    children: [
      {
        path: '/error-log/list',
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

// 无需权限的路由(未登录)
export const NOT_PERMISSION_ROUTE: AppRouteRecordRaw[] = [LOGIN, MAIN_OUT, PAGE_NOT_FOUND_ROUTE];

// 登录后而外需要的路由
export const PERMISSION_OUT_ROUTE: AppRouteRecordRaw[] = [LOGIN, MAIN_OUT];

// 获取权限后的路由（登录后）
export const getPermissionRouter = (routes: AppRouteRecordRaw[]) => [
  ...PERMISSION_OUT_ROUTE,
  {
    path: '/',
    name: 'Root',
    meta: {
      title: 'Root',
    },
    component: LAYOUT,
    children: [...routes, ...ERROR_LOG_ROUTE],
  },
];
