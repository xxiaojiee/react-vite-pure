import { load, ROOT_NAME, LOGIN_NAME } from '../constant';

import type { AppRouteRecordRaw } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { mainOutRoutes } from './mainOut';


import { dealRoutersPath } from '/@/utils/index';

const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: AppRouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = dealRoutersPath(routeModuleList);

console.log('asyncRoutes:', asyncRoutes);

// export const RootRoute: AppRouteRecordRaw = {
//   path: '/',
//   name: ROOT_NAME,
//   exact: true,
//   redirect: PageEnum.BASE_HOME,
//   meta: {
//     title: 'Root',
//   },
// };

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: LOGIN_NAME,
  component: load(() => import('../../pages/sys/login/Login')),
  meta: {
    title: '登录',
  },
};

// 无需权限的路由
export const basicRoutes = [
  LoginRoute,
  REDIRECT_ROUTE,
  ...mainOutRoutes,
  // RootRoute,
  PAGE_NOT_FOUND_ROUTE,
];

console.log('basicRoutes:', basicRoutes);

// export const routes: AppRouteRecordRaw = [
//   // {
//   //   path: '/auth',
//   //   component: load(() => import('../../layouts/UserLayout')),
//   //   children: [
//   //     {
//   //       meta: {
//   //         title: '登录',
//   //       },
//   //       path: '/auth/login',
//   //       component: load(() => import('../../pages/auth/login')),
//   //     },
//   //     {
//   //       meta: {
//   //         title: '注册',
//   //       },
//   //       path: '/auth/register',
//   //       component: load(() => import('../../pages/auth/register')),
//   //     },
//   //   ],
//   // },
//   {
//     path: '/',
//     name: 'Root',
//     meta: {
//       title: 'Root',
//     },
//     component: load(() => import('../../layouts/SecurityLayout')),
//     children: [
//       {
//         path: '/',
//         name: 'Layouts',
//         meta: {
//           title: 'Layouts',
//         },
//         component: load(() => import('../../layouts/default')),
//         children: [
//           {
//             name: 'Home',
//             path: '/home',
//             meta: {
//               title: '首页',
//             },
//             icon: <HomeOutlined />,
//             children: [
//               {
//                 name: 'Manage',
//                 path: '/home/manage',
//                 meta: {
//                   title: '首页管理',
//                 },
//                 component: load(() => import('../../pages/home/Home')),
//               },
//             ],
//           },
//           {
//             path: '/redux',
//             name: 'Redux',
//             meta: {
//               title: 'Redux',
//             },
//             icon: <ContainerOutlined />,
//             children: [
//               {
//                 name: 'Ceshi',
//                 path: '/redux/ceshi',
//                 meta: {
//                   title: 'redux',
//                 },
//                 component: load(() => import('../../pages/redux/ceshi')),
//               },
//               {
//                 name: 'Redux',
//                 path: '/redux',
//                 redirect: '/redux/ceshi',
//                 meta: {
//                   title: 'Redux',
//                 },
//               },
//             ],
//           },
//           {
//             name: 'Debug',
//             path: '/debug',
//             meta: {
//               title: '调试',
//             },
//             icon: <ContainerOutlined />,
//             component: load(() => import('../../pages/debug/index')),
//           },
//           {
//             name: 'Home',
//             path: '/',
//             redirect: '/home',
//             meta: {
//               title: 'Home',
//             },
//           },
//         ],
//       },
//     ],
//   },
// ];
