import React from 'react';
import type { UserInfo } from '/#/store';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { actions, useStoreState } from '/@/store';
import { useDispatch } from 'react-redux'
import { useGetUserInfoAction } from '/@/pages/sys/login/useLogin'
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { map } from 'lodash-es';
import { useMount } from 'ahooks';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import type { AppRouteRecordRaw } from '/@/router/types';
import { useAppContainer } from '/@/components/Application';
import { useBuildRoutesAction } from '/@/hooks/web/usePermission'
import { useAfterLoginAction } from '/@/pages/sys/login'

import { RootRoute } from '/@/router/routes';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const ROOT_PATH = RootRoute.path;

const permissionActions = actions.permission

// async function usePermissionGuard(route) {
//   const dispatch = useDispatch();
//   const userState = useStoreState('user');
//   const permissionState = useStoreState('permission');
//   const afterLoginAction = useAfterLoginAction()
//   const getUserInfoAction = useGetUserInfoAction();
//   const buildRoutesAction = useBuildRoutesAction();
//   const getUserInfo = (): UserInfo => {
//     return userState.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
//   }
//   const getToken = (): string => {
//     return userState.token || getAuthCache<string>(TOKEN_KEY);
//   };
//   if (
//     from.path === ROOT_PATH &&
//     to.path === PageEnum.BASE_HOME &&
//     getUserInfo().homePath &&
//     getUserInfo().homePath !== PageEnum.BASE_HOME
//   ) {
//     next(getUserInfo().homePath);
//     return;
//   }

//   const token = getToken();
//   // 可以直接进入白名单
//   if (whitePathList.includes(to.path as PageEnum)) {
//     // 如果是登录页面且存在token
//     if (to.path === LOGIN_PATH && token) {
//       const isSessionTimeout = userState.sessionTimeout;
//       try {
//         await afterLoginAction();
//         if (!isSessionTimeout) {
//           next((to.query?.redirect as string) || '/');
//           return;
//         }
//       } catch {}
//     }
//     next();
//     return;
//   }
//   // token 不存在
//   if (!token) {
//     // 如果该页面不需要授权，将直接访问（需要将路由 meta.ignoreAuth 设置为 true）
//     if (to.meta.ignoreAuth) {
//       next();
//       return;
//     }
//     // 重定向到登录页面
//     const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
//       path: LOGIN_PATH,
//       replace: true,
//     };
//     if (to.path) {
//       redirectData.query = {
//         ...redirectData.query,
//         redirect: to.path, //登录后重定向的位置
//       };
//     }
//     next(redirectData);
//     return;
//   }
//   // 处理登录后跳转到404页面
//   if (
//     from.path === LOGIN_PATH &&
//     to.name === PAGE_NOT_FOUND_ROUTE.name &&
//     to.fullPath !== (getUserInfo().homePath || PageEnum.BASE_HOME)
//   ) {
//     next(getUserInfo().homePath || PageEnum.BASE_HOME);
//     return;
//   }
//   // get userinfo while last fetch time is empty
//   if (userState.getLastUpdateTime === 0) {
//     try {
//       await getUserInfoAction();
//     } catch (err) {
//       next();
//       return;
//     }
//   }
//   if (permissionState.isDynamicAddedRoute) {
//     next();
//     return;
//   }

//   const routes = await buildRoutesAction();
//   routes.forEach((route) => {
//     router.addRoute(route as unknown as RouteRecordRaw);
//   });

//   router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
//   dispatch(permissionActions.setDynamicAddedRoute(true))
//   if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
//     // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
//     next({ path: to.fullPath, replace: true, query: to.query });
//   } else {
//     const redirectPath = (from.query.redirect || to.path) as string;
//     const redirect = decodeURIComponent(redirectPath);
//     const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
//     next(nextData);
//   }
// }

const RouteWithSubRoutes = (route: AppRouteRecordRaw) => {
  // usePermissionGuard(route);
  return (
    <Route
      path={route.path}
      exact ={route.exact}
      render={(props: any) => {
        console.log('我是Route', route);
        const Comp = route.component;
        let Component: JSX.Element | null = null;
        if (route.redirect) {
          console.log('redirect:', route);
          Component = (
            <Redirect
              to={{
                pathname: route.redirect,
                state: { fromPath: route.path }
              }}
            />
          );
        }
        if (Comp && route.children) {
          Component = (
            <Comp {...props} route={route}>
              <DynamicRoute routes={route.children} />
            </Comp>
          );
        }
        if (Comp && !route.children) {
          Component = <Comp {...props} />;
        }
        if (!Comp && route.children) {
          Component = <DynamicRoute routes={route.children} />;
        }
        return Component;
      }}
    />
  );
};

const DynamicRoute = ({ routes: rous }: { routes?: AppRouteRecordRaw[] }) => {
  if (!rous) return null;
  return (
    <Switch>
      {map(rous, (route, index) => {
        return <RouteWithSubRoutes key={index} {...route} />;
      })}
    </Switch>
  );
};

export default function Routes() {
  const { app } = useAppContainer();
  console.log('routes:', app.routes);
  return <DynamicRoute routes={app.routes} />;
}
