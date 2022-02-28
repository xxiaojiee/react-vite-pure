import { useEffect, useMemo, useRef } from 'react';
import nProgress from 'nprogress';
import { useStoreState } from '/@/store';
import { getAuthCache } from '/@/utils/auth';
import { useAppContainer } from '/@/components/Application';
import { useAfterLoginAction } from '/@/pages/sys/login/useLogin';
import projectSetting from '/@/settings/projectSetting';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
import { TOKEN_KEY, SESSION_TIMEOUT_KEY } from '/@/enums/cacheEnum';
import { cloneDeep } from 'lodash-es';
import { PageEnum } from '/@/enums/pageEnum';
import { useMount, useUnmount } from 'ahooks';
import queryString from 'query-string';

import { PAGE_NOT_FOUND_NAME } from '/@/router/constant';

import * as H from 'history';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList: PageEnum[] = [LOGIN_PATH];

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
  const isFirst = useRef<boolean>(true);
  const { redirect, path, meta, name, children } = route;
  const { pathname, search } = location as H.Location;
  const { route: appRoute, matched, saveApp } = useAppContainer();
  const getPermissionGuard = usePermissionGuard(props);
  const userState = useStoreState('user');
  const { userInfo, sessionTimeout } = userState || {};
  const token = userState.token || getAuthCache<string>(TOKEN_KEY);
  const { removeAllHttpPending } = projectSetting;
  // 是否获取了当前的Route; 再渲染路由组件，保证组件都马上获取到当前的Route；
  const isGetCurrentRoute = !!matched?.some((rou) => rou.path === path);
  const isWhite = whitePathList.includes(path as PageEnum) || !!meta.ignoreAuth; // 是否是白名单
  const { isDynamicAddedRoute } = useStoreState('permission'); // 是否获取了动态路由
  // 登录后，找不到route路由地址
  const isLoginToFount = useMemo(() => {
    if (
      appRoute?.path === LOGIN_PATH &&
      route.name === PAGE_NOT_FOUND_NAME &&
      pathname !== (userInfo?.homePath || PageEnum.BASE_HOME)
    ) {
      return true;
    }
    return false;
  }, [appRoute, pathname, route.name, userInfo?.homePath]);
  // 是否是登录页，且目前已登录 (是，就自动登录到系统)
  const isLoginPageAndAuth = useMemo(() => {
    // 如果是登录页面且存在token，且token已经过期
    if (path === LOGIN_PATH && token && sessionTimeout) {
      return true;
    }
    return false;
  }, [path, token, sessionTimeout]);
  const isAuthorize = (isWhite || isDynamicAddedRoute) && !isLoginPageAndAuth; // 是否已经授权（授权才显示组件）
  const isShowComponent = isAuthorize && isGetCurrentRoute && !isLoginToFount;
  const isLastRoute = !children; // 页面地址是否为最终路由地址

  const beforeMount = () => {
    if (!isFirst.current) {
      return;
    }
    // 加载顶部进度条
    if (!nProgress.status) {
      nProgress.start();
    }
    if (!redirect && isLastRoute) {
      if (removeAllHttpPending) {
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

    // 当找不到一级路由时
    if (isLoginToFount) {
      await history.replace(userInfo.homePath || PageEnum.BASE_HOME);
      return;
    }
    if (isLastRoute) {
      if (!isAuthorize) {
        await getPermissionGuard();
        return;
      }
      if (token && !sessionTimeout) {
        if (path === LOGIN_PATH) {
          await history.replace(
            (queryString.parse(search)?.redirect as string) ||
              userInfo?.homePath ||
              PageEnum.BASE_HOME,
          );
          return;
        }
        if (pathname === PageEnum.BASE_ROOT) {
          await history.replace(userInfo?.homePath || PageEnum.BASE_HOME);
          return;
        }
      }
      if (!isGetCurrentRoute) {
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
