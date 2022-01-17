import React, { useState, useEffect } from 'react';
import { useAppContainer } from '/@/components/Application';
import type { AppRouteRecordRaw, Menu } from '/@/router/types';
import { useDesign } from '/@/hooks/web/useDesign';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { isString } from '/@/utils/is';
import { filter } from '/@/utils/helper/treeHelper';
import { useMenus } from '/@/router/menus';

import { REDIRECT_NAME } from '/@/router/constant';
import { getAllParentPath } from '/@/router/helper/menuHelper';

function getMatched(menuList: Menu[], parent: any[]) {
  const metched: Menu[] = [];
  menuList.forEach((item) => {
    if (parent.includes(item.path)) {
      metched.push({
        ...item,
        name: item.meta?.title || item.name,
      });
    }
    if (item.children?.length) {
      metched.push(...getMatched(item.children, parent));
    }
  });
  return metched;
}

function filterItem(list: Menu[]) {
  return filter(list, (item) => {
    const { meta, name } = item;
    if (!meta) {
      return !!name;
    }
    const { title, hideBreadcrumb, hideMenu } = meta;
    if (!title || hideBreadcrumb || hideMenu) {
      return false;
    }
    return true;
  }).filter((item) => !item.meta?.hideBreadcrumb);
}
interface LayoutBreadcrumbProp {
  theme: 'dark' | 'light';
}

const LayoutBreadcrumb: React.FC<LayoutBreadcrumbProp> = (props) => {
  // const [routes, setroutes] = useState<Menu[]>([]);
  // const { app } = useAppContainer();
  // const currentRoute = app.route;
  // const menus = useMenus();
  // console.log('app:', app);
  // console.log('menus:', menus);
  // const { prefixCls } = useDesign('layout-breadcrumb');
  // const { getShowBreadCrumbIcon } = useRootSetting();

  // useEffect(() => {
  //   console.log(9999999999);

  //   if (!currentRoute || currentRoute.name === REDIRECT_NAME) return;
  //   const routeMatched = app.matched;
  //   console.log('routeMatched:', routeMatched);
  //   const cur = routeMatched?.[routeMatched.length - 1];
  //   let path: string = currentRoute.path || '';

  //   if (cur && cur?.meta?.currentActiveMenu) {
  //     path = cur.meta.currentActiveMenu;
  //   }

  //   console.log('path:', path);
  //   const parent = getAllParentPath(menus, path);
  //   const filterMenus = menus.filter((item) => item.path === parent[0]);
  //   console.log('filterMenus:', filterMenus, parent);
  //   const matched = getMatched(filterMenus, parent);
  //   console.log('matched:', matched);

  //   if (!matched || matched.length === 0) return;

  //   const breadcrumbList = filterItem(matched);

  //   if (currentRoute.meta?.currentActiveMenu) {
  //     breadcrumbList.push({
  //       ...currentRoute,
  //       name: currentRoute.meta?.title || currentRoute.name,
  //     } as unknown as AppRouteRecordRaw);
  //   }
  //   console.log('breadcrumbList:', breadcrumbList);
  //   setroutes(breadcrumbList);
  // }, [currentRoute]);

  // function handleClick(route: AppRouteRecordRaw, paths: string[], e: Event) {
  //   e?.preventDefault();
  //   const { children, redirect, meta } = route;

  //   if (children?.length && !redirect) {
  //     e?.stopPropagation();
  //     return;
  //   }
  //   if (meta?.carryParam) {
  //     return;
  //   }

  //   if (redirect && isString(redirect)) {
  //     app.history.push(redirect);
  //   } else {
  //     let goPath = '';
  //     if (paths.length === 1) {
  //       goPath = paths[0];
  //     } else {
  //       const ps = paths.slice(1);
  //       const lastPath = ps.pop() || '';
  //       goPath = `${lastPath}`;
  //     }
  //     goPath = /^\//.test(goPath) ? goPath : `/${goPath}`;
  //     app.history.push(goPath);
  //   }
  // }

  // function hasRedirect(routes: RouteLocationMatched[], route: RouteLocationMatched) {
  //   return routes.indexOf(route) !== routes.length - 1;
  // }

  // function getIcon(route) {
  //   return route.icon || route.meta?.icon;
  // }
  return <div>LayoutBreadcrumb</div>;
};

export default LayoutBreadcrumb;
