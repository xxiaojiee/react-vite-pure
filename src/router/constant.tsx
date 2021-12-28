import React, { ComponentType, lazy, Suspense } from 'react';
import { Spin } from 'antd';


export const REDIRECT_NAME = 'Redirect';
export const PARENT_LAYOUT_NAME = 'ParentLayout';
export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

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
