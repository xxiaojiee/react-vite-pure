import React, { useCallback, useState } from 'react';
import type { UserInfo } from '/#/store';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import queryString from 'query-string';
import { actions, useStoreState } from '/@/store';
import { basicRoutes } from '/@/router/routes';
import { useGetUserInfoAction, useAfterLoginAction } from '/@/pages/sys/login/useLogin';
import { getAuthCache } from '/@/utils/auth';
import { map } from 'lodash-es';
import { useMount } from 'ahooks';
import { PageEnum } from '/@/enums/pageEnum';
import { TOKEN_KEY, USER_INFO_KEY, SESSION_TIMEOUT_KEY } from '/@/enums/cacheEnum';
import { ROOT_NAME, LOGIN_NAME, PAGE_NOT_FOUND_NAME } from '/@/router/constant';
import type { AppRouteRecordRaw } from '/@/router/types';
import { useBuildRoutesAction } from '/@/hooks/web/usePermission';

import { RootRoute } from '/@/router/routes';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const ROOT_PATH = RootRoute.path;

const permissionActions = actions.permission;

const whitePathList: PageEnum[] = [LOGIN_PATH];

// 需要鉴权的路由
const authRouteList: string[] = [ROOT_NAME, LOGIN_NAME, PAGE_NOT_FOUND_NAME];

enum CompoentType {
  FRAGMENT = 'fragment',
  REDIRECT = 'redirect',
  COMDYNAMIC = 'comdynamic',
  COMPONENT = 'component',
  DYNAMIC = 'dynamic',
}

interface RouterConfigProp {
  componentType: CompoentType;
  redirectPath?: string;
  redirectSearch?: string;
}

interface RouterRenderProp extends RouteComponentProps {
  route: AppRouteRecordRaw;
}

function RouterRender(props: RouterRenderProp) {
  const { route, ...routerRenderProp } = props;
  const { redirect, component, children, location = {} } = route;
  const { state } = location as H.Location;
  const fromRoute = (state as Record<string, any>)?.from || [];
  const Comp = component!;
  if (redirect) {
    const redirectProp = {
      pathname: route.redirect,
      state: {
        from: [route, ...fromRoute],
      },
    };
    return <Redirect to={redirectProp} />;
  }
  if (children && Comp) {
    return (
      <Comp {...routerRenderProp}>
        <DynamicRoute routes={children} />
      </Comp>
    );
  }
  if (children && !Comp) {
    return <DynamicRoute routes={children} />;
  }
  if (!children && Comp) {
    return <Comp {...routerRenderProp} />;
  }
  return null;
}

const DynamicRoute: React.FC<{ routes?: AppRouteRecordRaw[] }> = ({ routes: rous }) => (
  <Switch>
    {map(rous, (route, index) => (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        render={(props: RouteComponentProps) => <RouterRender {...props} route={route} />}
      />
    ))}
  </Switch>
);

export default function Routes() {
  const userState = useStoreState('user');
  const permissionState = useStoreState('permission');
  const afterLoginAction = useAfterLoginAction();
  const location = useLocation();
  const [routes, setRoutes] = useState<AppRouteRecordRaw[]>(basicRoutes);
  const getPermission = useCallback(async () => {
    console.log('location:', location);
    // console.log('进入鉴权', route);
    // const { name: routeName } = route;
    // const { pathname, search, hash } = route.location as H.Location;
    // const fullPath = `${pathname}${search || ''}${hash || ''}`;
    // const userInfo = userState.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    // const token = userState.token || getAuthCache<string>(TOKEN_KEY);
    // const sessionTimeout = userState.sessionTimeout || getAuthCache<string>(SESSION_TIMEOUT_KEY);
    // const { isDynamicAddedRoute } = permissionState;
    // console.log('是否获取了动态路由：', isDynamicAddedRoute);
    // // 未登录或者已登录但过期的
    // if (!token || (token && sessionTimeout)) {
    //   // 未登录， 跳到登录页
    //   const config: RouterConfigProp = {
    //     componentType: CompoentType.REDIRECT,
    //     redirectPath: LOGIN_PATH,
    //   };
    //   if (pathname && routeName === PAGE_NOT_FOUND_NAME) {
    //     config.redirectSearch = `?redirect=${pathname}`;
    //   }
    //   return config;
    // } else {
    //   // 获取动态路由后，会重新渲染页面，不在其他处理
    //   afterLoginAction();
    //   if (['ROOT_NAME'].includes(routeName)) {
    //     return {
    //       componentType: CompoentType.REDIRECT,
    //       redirectPath: userInfo?.homePath || PageEnum.BASE_HOME,
    //     };
    //   }
    //   if (routeName === PAGE_NOT_FOUND_NAME) {
    //     // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
    //     return {
    //       componentType: CompoentType.REDIRECT,
    //       redirectPath: fullPath,
    //     };
    //   }
    // }
  }, [location]);
  useMount(() => {
    getPermission();
    console.log(`Routes渲染拉`, routes);
  });
  return <DynamicRoute routes={routes} />;
}
