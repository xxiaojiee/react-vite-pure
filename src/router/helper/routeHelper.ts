import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';
// import type { Router, RouteRecordNormalized } from 'vue-router';

import { getParentLayout, LAYOUT, EXCEPTION_COMPONENT } from '/@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import { warn } from '/@/utils/log';
// import { createRouter, createWebHashHistory } from 'vue-router';

export type LayoutMapKey = 'LAYOUT';
// const IFRAME = () => import('/@/views/sys/iframe/FrameBlank.vue');

// const LayoutMap = new Map<string, () => Promise<typeof import('*.tsx')>>();

// LayoutMap.set('LAYOUT', LAYOUT);
// LayoutMap.set('IFRAME', IFRAME);

// let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

// Dynamic introduction
// function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
//   dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}');
//   if (!routes) return;
//   routes.forEach((item) => {
//     if (!item.component && item.meta?.frameSrc) {
//       item.component = 'IFRAME';
//     }
//     const { component, name } = item;
//     const { children } = item;
//     if (component) {
//       const layoutFound = LayoutMap.get(component.toUpperCase());
//       if (layoutFound) {
//         item.component = layoutFound;
//       } else {
//         item.component = dynamicImport(dynamicViewsModules, component as string);
//       }
//     } else if (name) {
//       item.component = getParentLayout();
//     }
//     children && asyncImportRoute(children);
//   });
// }

// function dynamicImport(
//   dynamicViewsModules: Record<string, () => Promise<Recordable>>,
//   component: string,
// ) {
//   const keys = Object.keys(dynamicViewsModules);
//   const matchKeys = keys.filter((key) => {
//     const k = key.replace('../../views', '');
//     const startFlag = component.startsWith('/');
//     const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
//     const startIndex = startFlag ? 0 : 1;
//     const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
//     return k.substring(startIndex, lastIndex) === component;
//   });
//   if (matchKeys?.length === 1) {
//     const matchKey = matchKeys[0];
//     return dynamicViewsModules[matchKey];
//   } else if (matchKeys?.length > 1) {
//     warn(
//       'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
//     );
//     return;
//   } else {
//     warn('在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!');
//     return EXCEPTION_COMPONENT;
//   }
// }

// Turn background objects into routing objects
// export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
//   routeList.forEach((route) => {
//     const component = route.component as string;
//     if (component) {
//       if (component.toUpperCase() === 'LAYOUT') {
//         route.component = LayoutMap.get(component.toUpperCase());
//       } else {
//         route.children = [cloneDeep(route)];
//         route.component = LAYOUT;
//         route.name = `${route.name}Parent`;
//         route.path = '';
//         const meta = route.meta || {};
//         meta.single = true;
//         meta.affix = false;
//         route.meta = meta;
//       }
//     } else {
//       warn('请正确配置路由：' + route?.name + '的component属性');
//     }
//     route.children && asyncImportRoute(route.children);
//   });
//   return routeList as unknown as T[];
// }

/**
 * 将多级路由转换为 2 级路由
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    // 判断等级是否超过2级
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// 路由级别升级
function promoteRouteLevel(routeModule: AppRouteRecordRaw) {
  addToChildren(routeModule.children || [], routeModule);
  routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

// 将所有子路由添加到二级路由
function addToChildren(
  children: AppRouteRecordRaw[],
  routeModule: AppRouteRecordRaw,
) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (routeModule.children?.length && child.children?.length) {
      routeModule.children = [...routeModule.children, ...child.children];
      addToChildren(child.children, routeModule);
    }
  }
}

// 判断等级是否超过2级
function isMultipleRoute(routeModule: AppRouteModule) {
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const { children } = routeModule;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}