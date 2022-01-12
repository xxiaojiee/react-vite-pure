import React, { ComponentType, lazy, Suspense } from 'react';
import { createLoading } from '/@/components/Loading';
import { Spin } from 'antd';
import { useMount } from 'ahooks';
import { SizeEnum } from '/@/enums/sizeEnum';

export const ROOT_NAME = 'Root';
export const LOGIN_NAME = 'Login';
export const REDIRECT_NAME = 'Redirect';
export const PARENT_LAYOUT_NAME = 'ParentLayout';
export const PAGE_NOT_FOUND_NAME = 'PageNotFound';
export const PAGE_NOT_FOUND_CHILD_NAME = 'PageNotFoundChild';

/**
 * @description: parent-layout
 */
export const getParentLayout = () => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      });
    });
};

export const Loading = (
  <Spin
    size="large"
    style={{
      width: '100%',
      margin: '40px 0',
    }}
  />
);

export const load = <T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) => {
  const Comp = lazy(factory);
  return (props: any) => (
    <Suspense fallback={Loading}>
      <Comp {...props} />
    </Suspense>
  );
};

export const EXCEPTION_COMPONENT = load(() => import('/@/pages/sys/exception'));

/**
 * @description: default layout
 */
export const LAYOUT = load(() => import('/@/layouts/default/index'));

/**
 * @description: 组件添加授权
 */
export const getAuthority = (Compoent) => {
  const loading = createLoading({
    tip: '加载中。。。',
  });
  return function (props) {
    useMount(() => {
      loading.open();
      setTimeout(() => {
        loading.setLoading(false);
        console.log('loading1:', loading.loading);
      }, 1000);
      setTimeout(() => {
        console.log('loading2:', loading.loading);
      }, 3000);
    });
    return <Compoent {...props} />;
  };
};
