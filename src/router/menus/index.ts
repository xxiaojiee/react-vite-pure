import type { Menu, MenuModule, AppRouteRecordRaw } from '/@/router/types';
import { useStoreState } from '/@/store';

import { transformMenuModule, getAllParentPath } from '/@/router/helper/menuHelper';
import { filter } from '/@/utils/helper/treeHelper';
import { isUrl } from '/@/utils/is';
import { PermissionModeEnum } from '/@/enums/appEnum';
import pathToRegexp from 'path-to-regexp';

const modules = import.meta.globEager('./modules/**/*.ts');

const menuModules: MenuModule[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  menuModules.push(...modList);
});

// ===========================
// ==========Helper===========
// ===========================

const usePermissionMode = () => {
  const appState = useStoreState('app');
  return appState.projectConfig.permissionMode;
};
const useIsBackMode = () => {
  return usePermissionMode() === PermissionModeEnum.BACK;
};

const useIsRouteMappingMode = () => {
  return usePermissionMode() === PermissionModeEnum.ROUTE_MAPPING;
};

const useIsRoleMode = () => {
  return usePermissionMode() === PermissionModeEnum.ROLE;
};

const staticMenus: Menu[] = [];
(() => {
  menuModules.sort((a, b) => {
    return (a.orderNo || 0) - (b.orderNo || 0);
  });

  for (const menu of menuModules) {
    staticMenus.push(transformMenuModule(menu));
  }
})();

function useAsyncMenus() {
  const permissionState = useStoreState('permission');
  const isBackMode = useIsBackMode();
  const isRouteMappingMode = useIsRouteMappingMode();
  if (isBackMode) {
    return permissionState.backMenuList.filter((item) => !item.meta?.hideMenu && !item.hideMenu);
  }
  if (isRouteMappingMode) {
    return permissionState.frontMenuList.filter((item) => !item.hideMenu);
  }
  return staticMenus;
}

export const useMenus = (): Menu[] => {
  const menus = useAsyncMenus();
  const isRoleMode = useIsRoleMode()
  const permission = useStoreState('permission');
  const { routes } = permission;
  if (isRoleMode) {
    return menus.filter(basicFilter(routes));
  }
  return menus;
};

export function useCurrentParentPath() {
  const menus = useAsyncMenus();
  return function getCurrentParentPath(currentPath: string) {
    const allParentPath = getAllParentPath(menus, currentPath);
    return allParentPath?.[0];
  }
}

// Get the level 1 menu, delete children
export function useShallowMenus(): Menu[] {
  const menus = useAsyncMenus();
  const isRoleMode = useIsRoleMode()
  const permission = useStoreState('permission');
  const { routes } = permission;
  const shallowMenuList = menus.map((item) => ({ ...item, children: undefined }));
  if (isRoleMode) {
    return shallowMenuList.filter(basicFilter(routes));
  }
  return shallowMenuList;
}

// Get the children of the menu
export function useChildrenMenus() {
  const menus = useMenus();
  const isRoleMode = useIsRoleMode();
  const permission = useStoreState('permission');
  return function getChildrenMenus(parentPath: string) {
    const { routes } = permission;
    const parent = menus.find((item) => item.path === parentPath);
    if (!parent || !parent.children || !!parent?.meta?.hideChildrenInMenu) {
      return [] as Menu[];
    }
    if (isRoleMode) {
      return filter(parent.children, basicFilter(routes));
    }
    return parent.children;
  }
}

function basicFilter(routes: AppRouteRecordRaw[]) {
  return (menu: Menu) => {
    const matchRoute = routes.find((route) => {
      if (isUrl(menu.path as string)) return true;

      if (route.meta?.carryParam) {
        return pathToRegexp(route.path as string).test(menu.path as string);
      }
      const isSame = route.path === menu.path;
      if (!isSame) return false;

      if (route.meta?.ignoreAuth) return true;

      return isSame || pathToRegexp(route.path as string).test(menu.path as string);
    });

    if (!matchRoute) return false;
    menu.icon = (menu.icon || matchRoute.meta.icon) as string;
    menu.meta = matchRoute.meta;
    return true;
  };
}
