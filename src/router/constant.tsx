import * as H from 'history';
import React, { ComponentType, lazy, Suspense } from 'react';
import nProgress from 'nprogress';
import { useMount, useUnmount } from 'ahooks';
import { Loading } from '/@/components/Loading';
import projectSetting from '/@/settings/projectSetting';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
import { useAfterLoginAction } from '/@/pages/sys/login/useLogin';
import { getAuthCache } from '/@/utils/auth';
import { useStoreState } from '/@/store';
import { useLoading } from '/@/hooks/web/useLoading';

import type { UserInfo } from '/#/store';
import { PageEnum } from '/@/enums/pageEnum';
import { TOKEN_KEY, USER_INFO_KEY, SESSION_TIMEOUT_KEY } from '/@/enums/cacheEnum';

export const ROOT_NAME = 'Root';
export const LOGIN_NAME = 'Login';
export const REDIRECT_NAME = 'Redirect';
export const PARENT_LAYOUT_NAME = 'ParentLayout';
export const PAGE_NOT_FOUND_NAME = 'PageNotFound';
export const PAGE_NOT_FOUND_CHILD_NAME = 'PageNotFoundChild';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
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

export const IFRAME = load(() => import('/@/pages/sys/iframe/FrameBlank'));

/**
 * @description: 鉴权
 */
export  function usePermission(props: any) {
  const userState = useStoreState('user');
  // const afterLoginAction = useAfterLoginAction();
  console.log('userState:', userState);
  return function getPermission() {
    console.log('进入鉴权', props);
    let redirectPath = '';
    const { route, location, history } = props;
    const { name: routeName } = route;
    const { pathname, search, hash } = location as H.Location;
    const fullPath = `${pathname}${search || ''}${hash || ''}`;
    const userInfo = userState.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    const token = userState.token || getAuthCache<string>(TOKEN_KEY);
    const sessionTimeout = userState.sessionTimeout || getAuthCache<string>(SESSION_TIMEOUT_KEY);

    // 未登录或者已登录但过期的
    if (!token || (token && sessionTimeout)) {
      // 未登录， 跳到登录页
      redirectPath = LOGIN_PATH
      if (pathname && routeName === PAGE_NOT_FOUND_NAME) {
        redirectPath += `?redirect=${pathname}`;
      }
      history.replace(redirectPath)
    } else {
      console.log('自动登录')
      // 获取动态路由后，会重新渲染页面，不在其他处理
      // afterLoginAction();
      // if (['ROOT_NAME'].includes(routeName)) {
      //   return {
      //     componentType: CompoentType.REDIRECT,
      //     redirectPath: userInfo?.homePath || PageEnum.BASE_HOME,
      //   };
      // }
      // if (routeName === PAGE_NOT_FOUND_NAME) {
      //   // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      //   return {
      //     componentType: CompoentType.REDIRECT,
      //     redirectPath: fullPath,
      //   };
      // }
    }
  };
}

/**
 * @description: 组件添加授权
 */
export const getAuthority = (Compoent) => {
  return function (props) {
    // const loading = useLoading(false);
    const getPermission = usePermission(props);
    useMount(() => {
      getPermission();
    });
    return <Compoent {...props} />;
  };
};
