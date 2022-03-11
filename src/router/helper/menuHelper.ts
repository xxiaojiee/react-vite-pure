
import type { MenuModule, Menu, AppRouteRecordRaw } from '/@/router/types';
import { findPath, treeMap } from '/@/utils/helper/treeHelper';
import { cloneDeep } from 'lodash-es';
import { isUrl } from '/@/utils/is';

export function getAllParentPath<T = Recordable>(treeData: T[], path: string) {
  const menuList = findPath(treeData, (n) => n.path === path) as Menu[];
  return (menuList || []).map((item) => item.path);
}

function joinParentPath(menus: Menu[], parentPath = '', parentPathList: string[] = []) {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    const path = menu.path as string;
    let nextParentPathList: string[] = [];
    if (!(path.startsWith('/') || isUrl(path))) {
      // path doesn't start with /, nor is it a url, join parent path
      const fullPath = `${parentPath}/${path}`
      menu.path = fullPath;
      menu.parentPathList = parentPathList;
      nextParentPathList = [...parentPathList, fullPath]
    }
    if (menu?.children?.length) {
      joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path, nextParentPathList);
    }
  }
}

// // Parsing the menu module
export function transformMenuModule(menuModule: MenuModule): Menu {
  const { menu } = menuModule;

  const menuList = [menu];

  joinParentPath(menuList);
  return menuList[0];
}

export function transformRouteToMenu(routeModList: AppRouteRecordRaw[], routerMapping = false) {
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList: AppRouteRecordRaw[] = [];

  cloneRouteModList.forEach((item) => {
    if (routerMapping && item.meta.hideChildrenInMenu && typeof item.redirect === 'string') {
      item.path = item.redirect;
    }
    if (item.meta?.single) {
      const realItem = item?.children?.[0];
      realItem && routeList.push(realItem);
    } else {
      routeList.push(item);
    }
  });
  const list = treeMap<Menu>(routeList, {
    conversion: (node: AppRouteRecordRaw, levelIndex: { level: number; index: number; }) => {
      const { meta: { title, hideMenu = false } = {} } = node;
      return {
        ...(node.meta || {}),
        meta: node.meta,
        name: title,
        hideMenu,
        path: node.path,
        level: levelIndex.level,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      };
    },
  });
  joinParentPath(list);
  return cloneDeep(list);
}

// /**
//  * config menu with given params
//  */
// const menuParamRegex = /(?::)([\s\S]+?)((?=\/)|$)/g;
// export function configureDynamicParamsMenu(menu: Menu, params: RouteParams) {
//   const { path, paramPath } = toRaw(menu);
//   let realPath = paramPath ? paramPath : path;
//   const matchArr = realPath.match(menuParamRegex);

//   matchArr?.forEach((it) => {
//     const realIt = it.substr(1);
//     if (params[realIt]) {
//       realPath = realPath.replace(`:${realIt}`, params[realIt] as string);
//     }
//   });
//   // save original param path.
//   if (!paramPath && matchArr && matchArr.length > 0) {
//     menu.paramPath = path;
//   }
//   menu.path = realPath;
//   // children
//   menu.children?.forEach((item) => configureDynamicParamsMenu(item, params));
// }
