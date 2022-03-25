import type { AppRouteRecordRaw } from '/@/router/types';

import { load } from '/@/router/constant';

const system: AppRouteRecordRaw = {
  path: '/system',
  name: 'System',
  redirect: '/system/account',
  meta: {
    orderNo: 2000,
    icon: 'ion:settings-outline',
    title: '系统管理',
  },
  children: [
    {
      path: 'account',
      name: 'AccountManagement',
      meta: {
        title: '账号管理',
        ignoreKeepAlive: false,
      },
      component: load(() => import('/@/pages/demo/system/account')),
    },
    {
      path: 'account_detail/:id',
      name: 'AccountDetail',
      meta: {
        hideMenu: true,
        title: '账号详情',
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/system/account',
      },
      component: load(() => import('/@/pages/demo/system/account/AccountDetail')),
    },
    {
      path: 'role',
      name: 'RoleManagement',
      meta: {
        title: '角色管理',
        ignoreKeepAlive: true,
      },
      component: load(() => import('/@/pages/demo/system/role')),
    },

    {
      path: 'menu',
      name: 'MenuManagement',
      meta: {
        title: '菜单管理',
        ignoreKeepAlive: true,
      },
      component: load(() => import('/@/pages/demo/system/menu')),
    },
    {
      path: 'dept',
      name: 'DeptManagement',
      meta: {
        title: '部门管理',
        ignoreKeepAlive: true,
      },
      component: load(() => import('/@/pages/demo/system/dept')),
    },
    {
      path: 'changePassword',
      name: 'ChangePassword',
      meta: {
        title: '修改密码',
        ignoreKeepAlive: true,
      },
      component: load(() => import('/@/pages/demo/system/password')),
    },
  ],
};

export default system;
