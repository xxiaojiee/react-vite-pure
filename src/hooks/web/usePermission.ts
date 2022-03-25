
import type { AppRouteRecordRaw, Menu } from '/@/router/types';
import type { UserInfo } from '/#/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { useStoreState, actions } from '/@/store';
import { getAuthCache } from '/@/utils/auth';
import { getStaticRoutes, getPermissionRouter } from '/@/router/routes';
import { filter } from '/@/utils/helper/treeHelper';
import { useDispatch } from 'react-redux'
import { ROLES_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { transformObjToRoute, flatRoutesToFirstLevel } from '/@/router/helper/routeHelper';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { PageEnum } from '/@/enums/pageEnum';
import projectSetting from '/@/settings/projectSetting';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';
import { getMenuList } from '/@/api/sys/menu';
import { getPermCode } from '/@/api/sys/user';


const permissionActions = actions.permission


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

/**
 * @description 根据用户设置的首页，在对应的route中的加上affix标记
 * */
const patchHomeAffix = (routeLists: AppRouteRecordRaw[], userhomePath) => {
  if (!routeLists || routeLists.length === 0) return;
  let homePath = userhomePath;
  function patcher(routeListsd: AppRouteRecordRaw[], parentPath = '') {
    let newParentPath = parentPath;
    if (newParentPath) {
      newParentPath += '/'
    };
    routeListsd.forEach((route: AppRouteRecordRaw) => {
      const { path, children, redirect } = route;
      const currentPath = path.startsWith('/') ? path : `${newParentPath}${path}`;
      if (currentPath === homePath) {
        // 如果该路由存在重定向，找到重定向的路由，并加上affix标记
        if (redirect) {
          homePath = route.redirect!;
        } else {
          route.meta = Object.assign({}, route.meta, { affix: true });
          throw new Error('end');  // 通过抛出错误退出循环
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


export function useBuildRoutesAction() {
  const userState = useStoreState('user')
  const appState = useStoreState('app')
  const dispatch = useDispatch();
  return async function buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
    let routes: AppRouteRecordRaw[] = [];
    let menuList: Menu[] = [];
    let routeList: AppRouteRecordRaw[] = [];
    let backMenuList: Menu[] = [];
    // 获取角色列表
    const getRoleList = (): RoleEnum[] => {
      return userState.roleList.length > 0 ? userState.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    }
    const roleList = getRoleList() || [];
    const { permissionMode = projectSetting.permissionMode } = appState.projectConfig;

    const userInfo: UserInfo = userState.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {}
    const homePath: string = userInfo.homePath || PageEnum.BASE_HOME;

    // 通过角色roles，来过滤路由列表
    const routeFilter = (route: AppRouteRecordRaw) => {
      const { meta } = route;
      const { roles } = meta || {};
      if (!roles) return true;
      return roleList.some((role) => roles.includes(role));
    };

    // 移除需要忽略的路由
    const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
      const { meta } = route;
      const { ignoreRoute } = meta || {};
      return !ignoreRoute;  // ignoreRoute 是否忽略路由
    };

    switch (permissionMode) {
      case PermissionModeEnum.ROLE:
        routes = filter(getStaticRoutes(), routeFilter); // 通过角色roles过滤路由
        break;

      case PermissionModeEnum.ROUTE_MAPPING:
        routes = filter(getStaticRoutes(), routeFilter);  // 通过角色roles过滤路由
        menuList = transformRouteToMenu(routes, true);
        routes = filter(routes, routeRemoveIgnoreFilter);
        menuList.sort((a, b) => {
          return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
        });
        dispatch(permissionActions.setFrontMenuList(menuList))
        break;

      // 如果确定不需要做后台动态权限，请在下方评论整个判断
      case PermissionModeEnum.BACK:

        // createMessage.loading({
        //   content: '菜单加载中...',
        //   duration: 1,
        // });
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
        // 移除需要忽略的路由
        routes = filter(routeList, routeRemoveIgnoreFilter);
        break;
      default:
        break;
    }
    // 根据用户设置的首页，在对应的route中的加上affix标记
    patchHomeAffix(routes, homePath);
    // 摊平多级路由为只有一级的路由
    routes = flatRoutesToFirstLevel(routes);
    routes = getPermissionRouter(routes);
    return routes;
  }
}

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

