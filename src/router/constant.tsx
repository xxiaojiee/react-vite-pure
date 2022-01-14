import React, { ComponentType, lazy, Suspense } from 'react';
import nProgress from 'nprogress';
import { useMount, useUnmount } from 'ahooks';
import { Loading } from '/@/components/Loading';
import projectSetting from '/@/settings/projectSetting';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';

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

/**
 * @description: 路由加载添加事件
 */
export const Fallback = (props: any) => {
  const { location } = props || {};
  let axiosCanceler: Nullable<AxiosCanceler>;
  const { removeAllHttpPending } = projectSetting;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }
  useMount(() => {
    // 加载进度条
    nProgress.start();
    // 滚动条回顶部
    location?.pathname && document.body.scrollTo(0, 0);
    // 切换路由会删除之前的请求
    axiosCanceler?.removeAllPending();
  });
  useUnmount(() => {
    nProgress.done();
  });
  return <Loading loading />;
};

export const load = <T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) => {
  const Comp = lazy(factory);
  return (props: any) => (
    <Suspense fallback={<Fallback {...props} />}>
      <Comp {...props} />
    </Suspense>
  );
};

export const EXCEPTION_COMPONENT = load(() => import('/@/pages/sys/exception'));

/**
 * @description: default layout
 */
export const LAYOUT = load(() => import('/@/layouts/default/index'));
