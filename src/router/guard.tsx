import { useMemo, useRef } from 'react';
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

import { PAGE_NOT_FOUND_CHILD_NAME, PAGE_NOT_FOUND_NAME } from '/@/router/constant';

import * as H from 'history';
import type { UserInfo } from '/#/store';

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
    const { pathname, search } = location as H.Location;
    const token = userState.token || getAuthCache<string>(TOKEN_KEY);
    const sessionTimeout = userState.sessionTimeout || getAuthCache<string>(SESSION_TIMEOUT_KEY);
    // 未登录或者已登录但过期的, 跳到登录页
    if (!token || (token && sessionTimeout)) {
      if (pathname && route.name === PAGE_NOT_FOUND_CHILD_NAME && pathname !== PageEnum.BASE_ROOT) {
        await history.replace(`${LOGIN_PATH}?redirect=${pathname}`);
        return;
      }
      await history.replace(LOGIN_PATH);
    } else {
      loading.setLoading(true);
      const userInfo: UserInfo | null = await afterLoginAction();
      loading.setLoading(false);
      console.log('route999:', props);
      if (route.path === LOGIN_PATH) {
        history.replace(
          (queryString.parse(search)?.redirect as string) ||
            userInfo?.homePath ||
            PageEnum.BASE_HOME,
        );
      }
      if (pathname === PageEnum.BASE_ROOT) {
        await history.replace(userInfo?.homePath || PageEnum.BASE_HOME);
      }
    }
  };
}

/**
 * @description: 路由守卫
 */
export function useGuard(props) {
  const { route, history, location = {} } = props;
  const isFirst = useRef<boolean>(true);
  const { redirect, path, meta, name } = route;
  const { pathname } = location as H.Location;
  const { route: appRoute, saveApp } = useAppContainer();
  const getPermissionGuard = usePermissionGuard(props);
  const userState = useStoreState('user');
  const token = userState.token || getAuthCache<string>(TOKEN_KEY);
  const { removeAllHttpPending } = projectSetting;
  // 是否获取了当前的Route; 再渲染路由组件，保证组件都马上获取到当前的Route；
  const isGetCurrentRoute = !!appRoute?.path.includes(path);
  const isWhite = whitePathList.includes(path as PageEnum) || !!meta.ignoreAuth; // 是否是白名单
  const { isDynamicAddedRoute } = useStoreState('permission'); // 是否获取了动态路由
  // 登录后，找不到route路由地址
  const isLoginToFount = useMemo(() => {
    if (
      appRoute?.path === LOGIN_PATH &&
      route.name === PAGE_NOT_FOUND_CHILD_NAME &&
      pathname !== (userState.userInfo?.homePath || PageEnum.BASE_HOME)
    ) {
      return true;
    }
    return false;
  }, [appRoute, pathname, route.name, userState.userInfo?.homePath]);
  // 是否是登录页，且目前已登录 (是，就自动登录到系统)
  const isLoginPageAndAuth = useMemo(() => {
    // 如果是登录页面且存在token，且token未过期
    if (path === LOGIN_PATH && token && !userState.sessionTimeout) {
      return true;
    }
    return false;
  }, [path, token, userState.sessionTimeout]);
  // 子路由是否不存在
  const isExistChildren = useMemo(() => {
    // pathname.split()
    // // 如果是登录页面且存在token，且token未过期
    // if (path === LOGIN_PATH && token && !userState.sessionTimeout) {
    //   return false;
    // }
    // return true;
  }, []);
  const isAuthorize = (isWhite || isDynamicAddedRoute) && !isLoginPageAndAuth; // 是否已经授权（授权才显示组件）
  const isShowComponent = isAuthorize && isGetCurrentRoute && !isLoginToFount;
  const isLastRoute = path === pathname || name === PAGE_NOT_FOUND_CHILD_NAME || !route.children; // 页面地址是否为最终路由地址

  // console.log(
  //   'isAuthorize',
  //   isAuthorize,
  //   {
  //     isGetCurrentRoute,
  //     isWhite,
  //     isDynamicAddedRoute,
  //     isLoginPageAndAuth,
  //     isLoginToFount,
  //     isLastRoute,
  //   },
  //   props,
  // );
  const beforeMount = () => {
    if (!isFirst.current) {
      return;
    }
    // 加载顶部进度条
    if (!nProgress.status) {
      nProgress.start();
    }
    if (!redirect && isLastRoute) {
      console.log('路由即将挂载', path);
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
    // 当找不到一级路由时
    if (isLoginToFount) {
      history.replace(userState.userInfo.homePath || PageEnum.BASE_HOME);
      return;
    }
    // 重定向
    if (redirect && !path.includes(redirect)) {
      console.log('路由重定向啦！！！！', path, redirect);
      await history.replace(redirect);
      return;
    }
    if (isLastRoute) {
      console.log('路由挂载啦啦啦啦啦啦啦啦啦啦啦啦啦啦！', path);
      if (!isAuthorize) {
        console.log('准备授权啦！！！！', path);
        await getPermissionGuard();
        return;
      }
      if (!isGetCurrentRoute) {
        console.log('appRoute:', appRoute);
        // 保存当前props (会导致组件重新渲染)
        saveApp(cloneDeep(props));
      }
      if (isGetCurrentRoute) {
        nProgress.done();
      }
    }
  });
  useUnmount(() => {
    if (isLastRoute) {
      console.log('路由卸载啦！！！！', path);
    }
  });
  return isShowComponent;
}
