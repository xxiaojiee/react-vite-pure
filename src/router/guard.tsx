import { useEffect, useMemo, useRef } from 'react';
import nProgress from 'nprogress';
import { useStoreState } from '/@/store';
import { getAuthCache } from '/@/utils/auth';
import { useAppContainer } from '/@/hooks/core/useAppContext';
import { useAfterLoginAction } from '/@/pages/sys/login/useLogin';
import projectSetting from '/@/settings/projectSetting';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
import { TOKEN_KEY, SESSION_TIMEOUT_KEY } from '/@/enums/cacheEnum';
import { cloneDeep } from 'lodash-es';
import { PageEnum } from '/@/enums/pageEnum';
import { useMount, useUnmount } from 'ahooks';
import queryString from 'query-string';

import { PAGE_NOT_FOUND_NAME, ROOT_NAME } from '/@/router/constant';

import * as H from 'history';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const MAIN_OUT_PATH = PageEnum.MAIN_OUT_PAGE;

const whitePathList: PageEnum[] = [MAIN_OUT_PATH];

/**
 * @description: 登录鉴权
 */
export function usePermissionGuard(props: any) {
  const userState = useStoreState('user');
  const afterLoginAction = useAfterLoginAction();
  const { loading } = useAppContainer();
  return async function getPermissionGuard() {
    const { route, location, history } = props;
    const { pathname } = location as H.Location;
    const token = userState.token || getAuthCache<string>(TOKEN_KEY);
    const sessionTimeout = userState.sessionTimeout || getAuthCache<string>(SESSION_TIMEOUT_KEY);
    // 未登录或者已登录但过期的, 跳到登录页
    if (!token || (token && sessionTimeout)) {
      if (pathname && route.name === PAGE_NOT_FOUND_NAME && pathname !== PageEnum.BASE_ROOT) {
        await history.replace(`${LOGIN_PATH}?redirect=${pathname}`);
        return;
      }
      await history.replace(LOGIN_PATH);
    } else {
      loading.setLoading(true);
      await afterLoginAction();
      loading.setLoading(false);
    }
  };
}

/**
 * @description: 路由守卫
 */
export function useGuard(props) {
  const { route, history, location = {} } = props;
  const { redirect, path, meta, name, children } = route;
  const { pathname, search } = location as H.Location;
  const { route: currentRoute, matched, saveApp } = useAppContainer();
  const userState = useStoreState('user');
  const token = userState.token || getAuthCache<string>(TOKEN_KEY);
  const { userInfo, sessionTimeout } = userState || {};
  // 是否获取了当前的Route; 再渲染路由组件，保证组件都马上获取到当前的Route；
  const isWhite = whitePathList.includes(path) || !!meta.ignoreAuth;
  // 是否获取了当前的Route; 再渲染路由组件，保证组件都马上获取到当前的Route；
  const isGetCurrentRoute = !!matched?.some((rou) => rou.path === path);
  const isFirst = useRef<boolean>(true);
  const { isDynamicAddedRoute } = useStoreState('permission'); // 是否获取了动态路由
  const getPermissionGuard = usePermissionGuard(props);
  // 当前页面是登录页，且已登录则先不展示
  const isLoginPageAddShow = path === LOGIN_PATH && (!token || (token && !sessionTimeout));
  const isShowComponent =
    (isWhite || isDynamicAddedRoute || isLoginPageAddShow) && isGetCurrentRoute;
  const isLastRoute = ROOT_NAME !== name; // 页面地址是否为最终路由地址
  console.log({
    isWhite,
    isDynamicAddedRoute,
    isLastRoute,
    isLoginPageAddShow,
    isGetCurrentRoute,
  });
  const beforeMount = () => {
    if (!isFirst.current) {
      return;
    }
    // 加载顶部进度条
    if (!nProgress.status) {
      nProgress.start();
    }
    if (!redirect && isLastRoute) {
      if (projectSetting.removeAllHttpPending) {
        const axiosCanceler = new AxiosCanceler();
        // 切换路由会删除之前的请求
        axiosCanceler?.removeAllPending();
      }
    }
    isFirst.current = false;
  };
  beforeMount();
  useMount(async () => {
    // 重定向
    if (redirect && pathname === path) {
      await history.replace(redirect);
      return;
    }
    if (isLastRoute) {
      if (!isDynamicAddedRoute) {
        debugger;
        await getPermissionGuard();
        return;
      }
      if (path === LOGIN_PATH) {
        await history.replace(
          (queryString.parse(search)?.redirect as string) ||
            userInfo?.homePath ||
            PageEnum.BASE_HOME,
        );
        return;
      }
      if (token && !sessionTimeout) {
        if (pathname === PageEnum.BASE_ROOT) {
          await history.replace(userInfo?.homePath || PageEnum.BASE_HOME);
        }
      }
      if (!isGetCurrentRoute) {
        console.log('当前router:', props);
        // 保存当前props (会导致组件重新渲染)
        saveApp(cloneDeep(props));
      }
    }
  });
  useEffect(() => {
    if (isGetCurrentRoute && nProgress.status) {
      nProgress.done();
    }
  }, [isGetCurrentRoute]);
  return isShowComponent;
}
