import React, { ComponentType, lazy, ReactNode, Suspense } from 'react';
import { Spin } from 'antd';
import { createHashHistory } from 'history';
import { ContainerOutlined, HomeOutlined } from '@ant-design/icons';

const Loading = (
  <Spin
    size="large"
    style={{
      width: '100%',
      margin: '40px 0',
    }}
  />
);

export const history = createHashHistory();

export const load = <T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) => {
  const Comp = lazy(factory);

  return (props: any) => (
    <Suspense fallback={Loading}>
      <Comp {...props} />
    </Suspense>
  );
};

export interface IRouter {
  path: string;
  redirect?: string;
  component?: ComponentType<any>;
  icon?: ReactNode;
  routes?: IRouter[];
  name?: string;
  authority?: string[];
  target?: string;
}

export const routes: IRouter[] = [
  {
    path: '/auth',
    component: load(() => import('../layouts/UserLayout')),
    routes: [
      {
        name: '登录',
        path: '/auth/login',
        component: load(() => import('../pages/auth/login')),
      },
      {
        name: '注册',
        path: '/auth/register',
        component: load(() => import('../pages/auth/register')),
      },
    ],
  },
  {
    path: '/',
    component: load(() => import('../layouts/SecurityLayout')),
    routes: [
      {
        path: '/',
        component: load(() => import('../layouts/BasicLayout')),
        routes: [
          {
            path: '/home',
            name: '首页',
            icon: <HomeOutlined />,
            // authority: [],
            routes: [
              {
                path: '/home/manage',
                name: '首页管理',
                component: load(() => import('../pages/home/Home')),
              },
              {
                path: '/home',
                redirect: '/home/manage',
              },
            ],
          },
          {
            path: '/redux',
            name: 'redux',
            icon: <ContainerOutlined />,
            // authority: [],
            routes: [
              {
                path: '/redux/ceshi',
                name: 'redux',
                component: load(() => import('../pages/redux/ceshi')),
              },
              {
                path: '/redux',
                redirect: '/redux/ceshi',
              },
            ],
          },
          {
            path: '/debug',
            name:'调试',
            icon: <ContainerOutlined />,
            component: load(() => import('../pages/debug/index')),
          },
          {
            path: '/',
            redirect: '/home',
          },
        ],
      },
      // {
      //   component: dynamicWrapper(app, [], () => import("../pages/NoFoundPage")),
      // },
    ],
  },
  // {
  //   component: dynamicWrapper(app, [], () => import("../pages/NoFoundPage")),
  // },
];
