
import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';

import { getParentLayout, IFRAME, LAYOUT, EXCEPTION_COMPONENT, load } from '/@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import { warn } from '/@/utils/log';
// import { createRouter, createWebHashHistory } from 'vue-router';

export type LayoutMapKey = 'LAYOUT';

let dynamicViewsModules: Record<string, () => Promise<any>>;

// Dynamic introduction
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../pages/**/*.tsx');
  if (!routes) return;
  routes.forEach((item) => {
    const component = item.component as unknown as string;
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFRAME';
    }
    const { name } = item;
    const { children } = item;
    if (component) {
      if (component.toUpperCase() === 'LAYOUT') {
        item.component = LAYOUT;
      } else if (component.toUpperCase() === 'IFRAME') {
        item.component = IFRAME;
      } else{
        item.component = dynamicImport(dynamicViewsModules, component as string);
      }
    } else if (name) {
      item.component = getParentLayout();
    }
    children && asyncImportRoute(children);
  });
}

function dynamicImport(
  dynamicViewsModuleList: Record<string, () => Promise<any>>,
  component: string,
) {
  const keys = Object.keys(dynamicViewsModuleList);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../../pages', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return load(dynamicViewsModuleList[matchKey]);
  } else if (matchKeys?.length > 1) {
    warn(
      '请不要在pages文件夹下的同一层级目录中创建同名的`.tsx`文件。 这会导致动态引入失败',
    );
    return undefined;
  } else {
    warn(`在src/pages/下找不到“${component}.tsx文件”, 请自行创建!`);
    return EXCEPTION_COMPONENT;
  }
}

// 将背景对象变成路由对象
export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
  routeList.forEach((route) => {
    const component = route.component as unknown as string;
    if (component) {
      if (component.toUpperCase() === 'LAYOUT') {
        route.component = LAYOUT;
      } else {
        route.children = [cloneDeep(route)];
        route.component = LAYOUT;
        route.name = `${route.name}Parent`;
        route.path = '';
        const meta = route.meta || {};
        meta.single = true;
        meta.affix = false;
        route.meta = meta;
      }
    } else {
      warn(`请正确配置路由：${route?.name}的component属性`);
    }
    route.children && asyncImportRoute(route.children);
  });
  return routeList as unknown as T[];
}

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
