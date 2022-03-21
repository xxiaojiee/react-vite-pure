import { load, LOGIN_NAME, EXCEPTION_COMPONENT, PAGE_NOT_FOUND_NAME } from '../constant';

import type { AppRouteRecordRaw } from '/@/router/types';

// 获取本地路由
export const getLocalRoutes = () => {
  const routeModuleList: AppRouteRecordRaw[] = [];
  const modules = import.meta.globEager('./modules/**/*.ts');
  Object.keys(modules).forEach((key) => {
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
  });
  console.log('localRoutes:', routeModuleList);
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

// 无需权限的路由
export const basicRoutes: AppRouteRecordRaw[] = [LOGIN, MAIN_OUT, PAGE_NOT_FOUND_ROUTE];
