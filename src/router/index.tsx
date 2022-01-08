import React, { useState, useRef } from 'react';
import type { UserInfo } from '/#/store';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';
import { useHistory, Location } from 'react-router-dom';
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
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import type { AppRouteRecordRaw } from '/@/router/types';
import { useAppContainer } from '/@/components/Application';
import { useBuildRoutesAction } from '/@/hooks/web/usePermission';

import { RootRoute } from '/@/router/routes';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const ROOT_PATH = RootRoute.path;

const permissionActions = actions.permission;

const whitePathList: PageEnum[] = [LOGIN_PATH];

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
  let type = componentType;
  const Comp = route.component;
  if (route.redirect) {
    type = CompoentType.REDIRECT;
  }
  if (route.children && Comp) {
    type = CompoentType.COMDYNAMIC;
  }
  if (route.children && !Comp) {
    type = CompoentType.DYNAMIC;
  }
  if (!route.children && Comp) {
    type = CompoentType.COMPONENT;
  }

  return type;
};

function usePermissionRoute(route: AppRouteRecordRaw, routerConfig: RouterConfigProp) {
  const dispatch = useDispatch();
  const userState = useStoreState('user');
  const permissionState = useStoreState('permission');
  const afterLoginAction = useAfterLoginAction();
  const getUserInfoAction = useGetUserInfoAction();
  const buildRoutesAction = useBuildRoutesAction();
  const { app, saveApp } = useAppContainer();
  return async function getRouteConfig() {
    console.log('进入鉴权');
    const { pathname, search, hash, state = {} } = route.location as Location;
    const { fromLocation } = state;
    const fromQuery = queryString.parse(fromLocation?.search);
    const query = queryString.parse(search);
    const fullPath = `${pathname}${search || ''}${hash || ''}`;
    const userInfo = userState.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    const token = userState.token || getAuthCache<string>(TOKEN_KEY);
    const sessionTimeout = userState.sessionTimeout || getAuthCache<string>(SESSION_TIMEOUT_KEY);
    const lastUpdateTime = userState.lastUpdateTime || getAuthCache<string>(LAST_UPDATE_TIME_KEY);
    const { isDynamicAddedRoute } = permissionState;

    const compType = getType(route, routerConfig.componentType);

    // 当用户已登录，用户配置的首页与路由首页不匹配时， 当跳到路由首页时重定向到用户的首页
    if (
      fromLocation?.pathname === ROOT_PATH &&
      pathname === PageEnum.BASE_HOME &&
      userInfo.homePath &&
      userInfo.homePath !== PageEnum.BASE_HOME
    ) {
      console.log('当跳到路由首页时重定向到用户的首页');
      return {
        componentType: CompoentType.REDIRECT,
        redirectPath: userInfo.homePath,
      };
    }

    // 可以直接进入白名单
    if (whitePathList.includes(pathname as PageEnum)) {
      console.log('进入白名单');
      // 如果是登录页面且存在token
      if (pathname === LOGIN_PATH && token) {
        try {
          await afterLoginAction();
          // 登录是否过期
          if (!sessionTimeout) {
            return {
              componentType: CompoentType.REDIRECT,
              redirectPath: (query?.redirect as string) || '/',
            };
          }
        } catch {}
      }

      return {
        componentType: compType,
      };
    }

    // token 不存在
    if (!token) {
      console.log('进入没登录');
      // 如果该页面不需要授权，将直接访问（需要将路由 meta.ignoreAuth 设置为 true）
      if (route.meta.ignoreAuth) {
        return {
          componentType: compType,
        };
      }
      // 重定向到登录页面
      const config: RouterConfigProp = {
        componentType: CompoentType.REDIRECT,
        redirectPath: LOGIN_PATH,
      };
      if (pathname && pathname !== ROOT_PATH) {
        config.redirectSearch = `?redirect=${pathname}`;
      }

      return config;
    }

    // 处理登录后跳转到404页面
    if (
      fromLocation?.pathname === LOGIN_PATH &&
      pathname === PAGE_NOT_FOUND_ROUTE.name &&
      fullPath !== (userInfo.homePath || PageEnum.BASE_HOME)
    ) {
      console.log('处理登录后');
      return {
        componentType: CompoentType.REDIRECT,
        redirectPath: userInfo.homePath || PageEnum.BASE_HOME,
      };
    }

    // 当上次获取用户信息时间为空时获取用户信息
    if (lastUpdateTime === 0) {
      console.log('获取用户信息');
      try {
        await getUserInfoAction();
      } catch (err) {
        return {
          componentType: compType,
        };
      }
    }

    // 路由是否已经动态添加
    if (isDynamicAddedRoute) {
      console.log('已添加路由');
      return {
        componentType: compType,
      };
    }

    console.log('添加路由');
    const routes = await buildRoutesAction();
    console.log('获取到了routes', routes);
    saveApp({
      ...app,
      routes: [...routes, ...app.routes],
    });
    dispatch(permissionActions.setDynamicAddedRoute(true));

    if (pathname === PAGE_NOT_FOUND_ROUTE.name) {
      console.log('重定向到fullPath');
      // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
      return {
        componentType: CompoentType.REDIRECT,
        redirectPath: fullPath,
      };
    } else {
      console.log('重定向到最后');
      const redirectPath = (fromQuery?.redirect || pathname) as string;
      const redirect = decodeURIComponent(redirectPath);
      const nextData =
        pathname === redirect
          ? {
              componentType: compType,
            }
          : {
              componentType: CompoentType.REDIRECT,
              redirectPath: redirect,
            };

      return nextData;
    }
  };
}

function RouterRender(props: RouterRenderProp) {
  const { route, routerConfig, ...routerRenderProp } = props;
  const { componentType, redirectPath, redirectSearch } = routerConfig;
  const Comp = route.component!;
  switch (componentType) {
    case CompoentType.REDIRECT:
      return (
        <Redirect
          to={{
            pathname: redirectPath || route.redirect,
            search: redirectSearch || '',
            state: { fromLocation: route.location },
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
  const isGone = useRef(false); // 是否卸载
  const { app } = useAppContainer();
  const [routerConfig, setRouterConfig] = useState({
    componentType: route.isChildrenRoute ? getType(route) : CompoentType.FRAGMENT,
  });
  const getRouteConfig = usePermissionRoute(route, routerConfig);
  useMount(async () => {
    console.log('调用useMount00000000');
    if (route.isChildrenRoute) {
      return;
    }
    console.log('初始化', route);
    const config = await getRouteConfig();
    if (isGone.current) {
      console.log('获取配置失败', route);
      return;
    }
    console.log('获取配置成功', config, app.routes);
    setRouterConfig(config);
  });
  useUnmount(async () => {
    isGone.current = true;
  });
  console.log('是否是子路由:', route.name, route.isChildrenRoute, routerConfig.componentType);
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
  console.log('我是主路由1111111111111111111111111');
  return <DynamicRoute routes={app.routes} />;
}
