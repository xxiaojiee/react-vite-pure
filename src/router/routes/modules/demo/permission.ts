import type { AppRouteRecordRaw } from '/@/router/types';

import { RoleEnum } from '/@/enums/roleEnum';

import { load } from '../../../constant';

const permission: AppRouteRecordRaw = {
  path: '/permission',
  name: 'Permission',
  // redirect: '/permission/front/page',
  meta: {
    orderNo: 15,
    icon: 'ion:key-outline',
    title: '权限管理',
  },

  children: [
    {
      path: 'front',
      name: 'PermissionFrontDemo',
      meta: {
        title: '基于前端权限',
      },
      children: [
        {
          path: 'page',
          name: 'FrontPageAuth',
          component: load(() => import('/@/pages/demo/permission/front')),
          meta: {
            title: '页面权限',
          },
        },
        {
          path: 'btn',
          name: 'FrontBtnAuth',
          component: load(() => import('/@/pages/demo/permission/front/Btn')),
          meta: {
            title: '按钮权限',
          },
        },
        {
          path: 'auth-pageA',
          name: 'FrontAuthPageA',
          component: load(() => import('/@/pages/demo/permission/front/AuthPageA')),
          meta: {
            title: '权限测试页A',
            roles: [RoleEnum.SUPER],
          },
        },
        {
          path: 'auth-pageB',
          name: 'FrontAuthPageB',
          component: load(() => import('/@/pages/demo/permission/front/AuthPageB')),
          meta: {
            title: '权限测试页B',
            roles: [RoleEnum.TEST],
          },
        },
      ],
    },
    {
      path: 'back',
      name: 'PermissionBackDemo',
      meta: {
        title: '基于后台权限',
      },
      children: [
        {
          path: 'page',
          name: 'BackAuthPage',
          component: load(() => import('/@/pages/demo/permission/back')),
          meta: {
            title: '页面权限',
          },
        },
        {
          path: 'btn',
          name: 'BackAuthBtn',
          component: load(() => import('/@/pages/demo/permission/back/Btn')),
          meta: {
            title: '按钮权限',
          },
        },
      ],
    },
  ],
};

export default permission;
