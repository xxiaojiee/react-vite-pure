import React, { useState, useRef, useMemo } from 'react';
import type { UserInfo } from '/#/store';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import queryString from 'query-string';
import { actions, useStoreState } from '/@/store';
import { useDispatch } from 'react-redux';
import { useGetUserInfoAction, useAfterLoginAction } from '/@/pages/sys/login/useLogin';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { map } from 'lodash-es';
import { useMount, useUnmount } from 'ahooks';
import { PageEnum } from '/@/enums/pageEnum';
import {
  ROLES_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
  SESSION_TIMEOUT_KEY,
  LAST_UPDATE_TIME_KEY,
  IS_DYNAMIC_ADDED_ROUTE_KEY,
} from '/@/enums/cacheEnum';
import { ROOT_NAME, LOGIN_NAME, PAGE_NOT_FOUND_NAME } from '/@/router/constant';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import type { AppRouteRecordRaw } from '/@/router/types';
import { useAppContainer } from '/@/components/Application';
import { useBuildRoutesAction } from '/@/hooks/web/usePermission';

import { RootRoute, LoginRoute } from '/@/router/routes';

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
  routerConfig: RouterConfigProp;
  route: AppRouteRecordRaw;
}

const getType = (route, componentType = CompoentType.FRAGMENT) => {
  const Comp = route.component;
  const { state } = route.location as H.Location;
  console.log('state:', state);
  const { redirect: fromRedirect } = (state as Record<string, any>)?.from?.[0] || {};

  if (route.redirect) {
    // 防止无法渲染子路由，一直重定向到父路由
    if (!fromRedirect || !fromRedirect.startsWith(route.path)) {
      return CompoentType.REDIRECT;
    }
  }
  if (route.children && Comp) {
    return CompoentType.COMDYNAMIC;
  }
  if (route.children && !Comp) {
    return CompoentType.DYNAMIC;
  }
  if (!route.children && Comp) {
    return CompoentType.COMPONENT;
  }
  return componentType;
};

function usePermissionRoute(route: AppRouteRecordRaw) {
  const dispatch = useDispatch();
  const userState = useStoreState('user');
  const permissionState = useStoreState('permission');
  const afterLoginAction = useAfterLoginAction();
  const getUserInfoAction = useGetUserInfoAction();
  const buildRoutesAction = useBuildRoutesAction();
  const { app, saveApp } = useAppContainer();
  return async function getRouteConfig() {
    console.log('进入鉴权', route);
    const { name: routeName } = route;
    const { pathname, search, hash } = route.location as H.Location;
    const query = queryString.parse(search);
    const fullPath = `${pathname}${search || ''}${hash || ''}`;
    let userInfo = userState.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    const token = userState.token || getAuthCache<string>(TOKEN_KEY);
    const sessionTimeout = userState.sessionTimeout || getAuthCache<string>(SESSION_TIMEOUT_KEY);
    const lastUpdateTime = userState.lastUpdateTime || getAuthCache<string>(LAST_UPDATE_TIME_KEY);
    const { isDynamicAddedRoute } = permissionState;
    console.log('是否获取了动态路由：', isDynamicAddedRoute);

    const compType = getType(route);
    console.log('获取type:', route);
    // 如果该页面不需要授权，将直接访问（需要将路由 meta.ignoreAuth 设置为 true）
    if (route.meta.ignoreAuth) {
      return {
        componentType: compType,
      };
    }

    // 已登录并已经动态添加了路由
    if (isDynamicAddedRoute) {
      // 如果有重定向，直接重定向
      if (route.redirect) {
        return {
          componentType: CompoentType.REDIRECT,
        };
      }
      console.log('已登录并获得了动态路由，直接跳转');
      // 处理登录后跳转到404页面
      // 当用户已登录，用户配置的首页与路由首页不匹配时， 当跳到路由首页时重定向到用户的首页
      if (
        routeName === PAGE_NOT_FOUND_NAME &&
        fullPath !== (userInfo.homePath || PageEnum.BASE_HOME)
      ) {
        console.log('处理登录后');
        return {
          componentType: CompoentType.REDIRECT,
          redirectPath: userInfo.homePath || PageEnum.BASE_HOME,
        };
      }
      return {
        componentType: compType,
      };
    }

    // 未登录或者已登录但过期的
    if (!token || (token && sessionTimeout)) {
      console.log('未登录， 跳到登录页');
      // 未登录， 跳到登录页
      const config: RouterConfigProp = {
        componentType: CompoentType.REDIRECT,
        redirectPath: LOGIN_PATH,
      };
      if (pathname && routeName === PAGE_NOT_FOUND_NAME) {
        config.redirectSearch = `?redirect=${pathname}`;
      }
      return config;
    } else {
      console.log('已有token，获取用户信息', token, pathname);
      // 获取动态路由后，会重新渲染页面，不在其他处理
      afterLoginAction();
      // 如果有重定向，直接重定向
      // if (route.redirect) {
      //   console.log('我重定向啦');
      //   return {
      //     componentType: CompoentType.REDIRECT,
      //   };
      // }
      // if (['ROOT_NAME', 'LOGIN_PATH'].includes(routeName)) {
      //   console.log(333333333, userInfo?.homePath || PageEnum.BASE_HOME);
      //   return {
      //     componentType: CompoentType.REDIRECT,
      //     redirectPath: userInfo?.homePath || PageEnum.BASE_HOME,
      //   };
      // }
      // if (routeName === PAGE_NOT_FOUND_NAME) {
      //   console.log(444444444444444, fullPath);
      //   // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      //   return {
      //     componentType: CompoentType.REDIRECT,
      //     redirectPath: fullPath,
      //   };
      // }
    }
    console.log('没找到相关配置');
    return false;
  };
}

function RouterRender(props: RouterRenderProp) {
  const { route, routerConfig, ...routerRenderProp } = props;
  const { componentType, redirectPath, redirectSearch } = routerConfig;
  const Comp = route.component!;
  const { state } = route.location as H.Location;
  const fromRoute = (state as Record<string, any>)?.from || [];
  switch (componentType) {
    case CompoentType.REDIRECT:
      console.log(6666, [route, ...fromRoute]);
      return (
        <Redirect
          to={{
            pathname: redirectPath || route.redirect,
            search: redirectSearch || '',
            state: {
              from: [route, ...fromRoute],
            },
          }}
        />
      );
    case CompoentType.COMDYNAMIC:
      return (
        <Comp {...routerRenderProp}>
          <DynamicRoute routes={route.children} isChildrenRoute />
        </Comp>
      );
    case CompoentType.COMPONENT:
      return <Comp {...routerRenderProp} />;
    case CompoentType.DYNAMIC:
      return <DynamicRoute routes={route.children} isChildrenRoute />;

    default:
      return null;
  }
}

const RouteWithSubRoutes = (route: AppRouteRecordRaw) => {
  console.log('route:', route);
  const isGone = useRef(false); // 是否卸载
  const { app } = useAppContainer();
  const getRouteConfig = usePermissionRoute(route);
  const { state } = route.location as H.Location;
  const fromRoute = (state as Record<string, any>)?.from;
  const getIsNeedAuth = () => {
    if (authRouteList.includes(route.name)) {
      if (!fromRoute) {
        return true;
      }
      if (fromRoute) {
        // 是否之前授权过
        const isBeAuth = fromRoute.some((i) => {
          return authRouteList.includes(i.name);
        });
        console.log('isBeAuth:', isBeAuth);
        return !isBeAuth;
      }
    }
    return false; // 是否需要鉴权
  };
  const [routerConfig, setRouterConfig] = useState(() => {
    console.log('是否需要鉴权：', getIsNeedAuth());
    return {
      componentType: getIsNeedAuth() ? CompoentType.FRAGMENT : getType(route),
    };
  });
  useMount(async () => {
    if (!getIsNeedAuth()) {
      return;
    }
    console.log('1111111111111111111111');
    const config = await getRouteConfig();

    if (isGone.current || !config) {
      return;
    }
    console.log('999999999999999', config, app.routes);
    setRouterConfig(config);
  });
  useUnmount(async () => {
    isGone.current = true;
  });
  return (
    <Route
      path={route.path}
      exact={route.exact}
      render={(props: RouteComponentProps) => (
        <RouterRender {...props} route={route} routerConfig={routerConfig} />
      )}
    />
  );
};

const DynamicRoute = ({
  routes: rous,
  isChildrenRoute = false,
}: {
  routes?: AppRouteRecordRaw[];
  isChildrenRoute?: boolean;
}) => {
  if (!rous) return null;
  return (
    <Switch>
      {map(rous, (route, index) => {
        return <RouteWithSubRoutes key={index} {...route} isChildrenRoute={isChildrenRoute} />;
      })}
    </Switch>
  );
};

export default function Routes() {
  const { app } = useAppContainer();
  console.log('路由：', app.routes);
  return <DynamicRoute routes={app.routes} />;
}
