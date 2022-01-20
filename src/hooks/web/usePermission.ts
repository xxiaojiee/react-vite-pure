import * as H from 'history';
import type { AppRouteRecordRaw, Menu, RouterRenderProp } from '/@/router/types';
import type { UserInfo } from '/#/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { useStoreState, actions } from '/@/store';
import { getAuthCache } from '/@/utils/auth';
import { useAfterLoginAction } from '/@/pages/sys/login/useLogin';
import { asyncRoutes } from '/@/router/routes';
import { filter } from '/@/utils/helper/treeHelper';
import { getMessage } from '/@/hooks/web/getMessage';
import { useLoading } from '/@/hooks/web/useLoading';
import { useDispatch } from 'react-redux'
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY, SESSION_TIMEOUT_KEY } from '/@/enums/cacheEnum';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import { ERROR_LOG_ROUTE } from '/@/router/routes/basic';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { PageEnum } from '/@/enums/pageEnum';
import projectSetting from '/@/settings/projectSetting';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';
import { useMount } from 'ahooks';
import { getMenuList } from '/@/api/sys/menu';
import { getPermCode } from '/@/api/sys/user';

import { PAGE_NOT_FOUND_NAME } from '/@/router/constant'
import React from 'react';

const { createMessage } = getMessage();

const permissionActions = actions.permission


const LOGIN_PATH = PageEnum.BASE_LOGIN;

// import { useAppStore } from '/@/store/modules/app';
// import { usePermissionStore } from '/@/store/modules/permission';
// import { useUserStore } from '/@/store/modules/user';

// import { useTabs } from './useTabs';

// import { router, resetRouter } from '/@/router';
// // import { RootRoute } from '/@/router/routes';

// import { RoleEnum } from '/@/enums/roleEnum';

// import { intersection } from 'lodash-es';
// import { isArray } from '/@/utils/is';
// import { useMultipleTabStore } from '/@/store/modules/multipleTab';


export function useBuildRoutesAction() {
  const userState = useStoreState('user')
  const appState = useStoreState('app')
  const dispatch = useDispatch();
  return async function buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
    let routes: AppRouteRecordRaw[] = [];
    let menuList: Menu[] = [];
    let routeList: AppRouteRecordRaw[] = [];
    let backMenuList: Menu[] = [];
    const getRoleList = (): RoleEnum[] => {
      return userState.roleList.length > 0 ? userState.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    }
    const roleList = getRoleList() || [];
    const { permissionMode = projectSetting.permissionMode } = appState.projectConfig;

    const routeFilter = (route: AppRouteRecordRaw) => {
      const { meta } = route;
      const { roles } = meta || {};
      if (!roles) return true;
      return roleList.some((role) => roles.includes(role));
    };

    const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
      const { meta } = route;
      const { ignoreRoute } = meta || {};
      return !ignoreRoute;
    };

    /**
     * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
     * */
    const patchHomeAffix = (routeLists: AppRouteRecordRaw[]) => {
      if (!routeLists || routeLists.length === 0) return;
      const getUserInfo = (): UserInfo => {
        return userState.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
      };
      let homePath: string = getUserInfo().homePath || PageEnum.BASE_HOME;
      function patcher(routeListsd: AppRouteRecordRaw[], parentPath = '') {
        let newParentPath = parentPath;
        if (newParentPath) {
          newParentPath += '/'
        };
        routeListsd.forEach((route: AppRouteRecordRaw) => {
          const { path, children, redirect } = route;
          const currentPath = (path as string).startsWith('/') ? (path as string) : `${newParentPath}${path}`;
          if (currentPath === homePath) {
            if (redirect) {
              homePath = route.redirect! as string;
            } else {
              route.meta = Object.assign({}, route.meta, { affix: true });
              throw new Error('end');
            }
          }
          children && children.length > 0 && patcher(children, currentPath);
        });
      }
      try {
        patcher(routeLists);
      } catch (e) {
        // 已处理完毕跳出循环
      }
    };
    switch (permissionMode) {
      case PermissionModeEnum.ROLE:
        routes = filter(asyncRoutes, routeFilter);
        routes = routes.filter(routeFilter);
        // 将多级路由转换为 2 级路由
        routes = flatMultiLevelRoutes(routes);
        break;

      case PermissionModeEnum.ROUTE_MAPPING:
        routes = filter(asyncRoutes, routeFilter);
        routes = routes.filter(routeFilter);
        menuList = transformRouteToMenu(routes, true);
        routes = filter(routes, routeRemoveIgnoreFilter);
        routes = routes.filter(routeRemoveIgnoreFilter);
        menuList.sort((a, b) => {
          return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
        });
        dispatch(permissionActions.setFrontMenuList(menuList))
        // 将多级路由转换为 2 级路由
        routes = flatMultiLevelRoutes(routes);
        break;

      // 如果确定不需要做后台动态权限，请在下方评论整个判断
      case PermissionModeEnum.BACK:

        createMessage.loading({
          content: '菜单加载中...',
          duration: 1,
        });
        // !模拟从后台获取权限代码，
        // 这个函数可能只需要执行一次，实际项目可以自己放到合适的时间
        try {
          const codeList = await getPermCode();
          dispatch(permissionActions.setPermCodeList(codeList))
          routeList = (await getMenuList()) as AppRouteRecordRaw[];
        } catch (error) {
          console.error(error);
        }

        // 动态引入组件
        routeList = transformObjToRoute(routeList);

        //  通过后台路由获取菜单结构
        backMenuList = transformRouteToMenu(routeList);
        dispatch(permissionActions.setBackMenuList(backMenuList))
        // remove meta.ignoreRoute item
        routeList = filter(routeList, routeRemoveIgnoreFilter);
        routeList = routeList.filter(routeRemoveIgnoreFilter);

        routeList = flatMultiLevelRoutes(routeList);
        routes = routeList;
        break;
      default:
        break;
    }
    patchHomeAffix(routes);
    routes = [...ERROR_LOG_ROUTE, ...routes];
    return routes;
  }
}


/**
 * @description: 登录鉴权
 */
export function useLoginPermission(props: any) {
  const userState = useStoreState('user');
  const afterLoginAction = useAfterLoginAction();
  const loading = useLoading(false);
  return async function getLoginPermission() {
    let redirectPath = '';
    const { route, location, history } = props;
    const { name: routeName } = route;
    const { pathname, search, hash } = location as H.Location;
    // const fullPath = `${pathname}${search || ''}${hash || ''}`;
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
      loading.setLoading(true);
      const userInfo: UserInfo | null = await afterLoginAction();
      loading.setLoading(false);
      if (pathname === PageEnum.BASE_ROOT) {
        history.replace(userInfo?.homePath || PageEnum.BASE_HOME)
      }
    }
  };
}

/**
 * @description: 组件添加授权
 */
export function getAuthority(Compoent) {
  return function (props: RouterRenderProp) {
    const { isDynamicAddedRoute } = useStoreState('permission');
    const getLoginPermission = useLoginPermission(props);
    // 用函数包裹，获取最初的状态，否则加载完动态路由，显示layout
    const getShow = () => {
      return isDynamicAddedRoute
    }
    useMount(() => {
      if (!isDynamicAddedRoute) {
        getLoginPermission();
      }
    });
    if (getShow()) {
      return React.createElement(Compoent, props);
    }
    return null;
  };
};


// User permissions related operations
// export function usePermission() {
//   const userStore = useUserStore();
//   const appStore = useAppStore();
//   const permissionStore = usePermissionStore();
//   const { closeAll } = useTabs(router);

//   /**
//    * Change permission mode
//    */
//   async function togglePermissionMode() {
//     appStore.setProjectConfig({
//       permissionMode:
//         projectSetting.permissionMode === PermissionModeEnum.BACK
//           ? PermissionModeEnum.ROUTE_MAPPING
//           : PermissionModeEnum.BACK,
//     });
//     location.reload();
//   }

//   /**
//    * Reset and regain authority resource information
//    * @param id
//    */
//   async function resume() {
//     const tabStore = useMultipleTabStore();
//     tabStore.clearCacheTabs();
//     resetRouter();
//     const routes = await permissionStore.buildRoutesAction();
//     routes.forEach((route) => {
//       router.addRoute(route as unknown as RouteRecordRaw);
//     });
//     permissionStore.setLastBuildMenuTime();
//     closeAll();
//   }

//   /**
//    * Determine whether there is permission
//    */
//   function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
//     // Visible by default
//     if (!value) {
//       return def;
//     }

//     const permMode = projectSetting.permissionMode;

//     if ([PermissionModeEnum.ROUTE_MAPPING, PermissionModeEnum.ROLE].includes(permMode)) {
//       if (!isArray(value)) {
//         return userStore.getRoleList?.includes(value as RoleEnum);
//       }
//       return (intersection(value, userStore.getRoleList) as RoleEnum[]).length > 0;
//     }

//     if (PermissionModeEnum.BACK === permMode) {
//       const allCodeList = permissionStore.getPermCodeList as string[];
//       if (!isArray(value)) {
//         return allCodeList.includes(value);
//       }
//       return (intersection(value, allCodeList) as string[]).length > 0;
//     }
//     return true;
//   }

//   /**
//    * Change roles
//    * @param roles
//    */
//   async function changeRole(roles: RoleEnum | RoleEnum[]): Promise<void> {
//     if (projectSetting.permissionMode !== PermissionModeEnum.ROUTE_MAPPING) {
//       throw new Error(
//         'Please switch PermissionModeEnum to ROUTE_MAPPING mode in the configuration to operate!',
//       );
//     }

//     if (!isArray(roles)) {
//       roles = [roles];
//     }
//     userStore.setRoleList(roles);
//     await resume();
//   }

//   /**
//    * refresh menu data
//    */
//   async function refreshMenu() {
//     resume();
//   }

//   return { changeRole, hasPermission, togglePermissionMode, refreshMenu };
// }

