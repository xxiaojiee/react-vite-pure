import React, { useState, useEffect } from 'react';
import { useAppContainer } from '/@/components/Application';
import type { AppRouteRecordRaw, Menu } from '/@/router/types';
import { useDesign } from '/@/hooks/web/useDesign';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { isString } from '/@/utils/is';
import { useMount } from 'ahooks';
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

const LayoutBreadcrumb: React.FC<LayoutBreadcrumbProp> = () => {
  const [routeList, setRouteList] = useState<Menu[]>([]);
  const { route, matched, history } = useAppContainer();
  const menus = useMenus();
  console.log('menus:', menus);
  const { prefixCls } = useDesign('layout-breadcrumb');
  const { getShowBreadCrumbIcon } = useRootSetting();

  useMount(() => {
    console.log(9999999999);

    if (!route || route.name === REDIRECT_NAME) return;
    console.log('matched:', matched);
    const cur = matched?.[matched.length - 1];
    let path: string = route.path || '';

    if (cur && cur?.meta?.currentActiveMenu) {
      path = cur.meta.currentActiveMenu;
    }

    console.log('path:', path);
    const parent = getAllParentPath(menus, path);
    const filterMenus = menus.filter((item) => item.path === parent[0]);
    console.log('filterMenus:', filterMenus, parent);
    const matcheds = getMatched(filterMenus, parent);
    console.log('matched:', matcheds);

    if (!matcheds || matcheds.length === 0) return;

    const breadcrumbList = filterItem(matcheds);

    if (route.meta?.currentActiveMenu) {
      breadcrumbList.push({
        ...route,
        name: route.meta?.title || route.name,
      } as unknown as AppRouteRecordRaw);
    }
    console.log('breadcrumbList:', breadcrumbList);
    setRouteList(breadcrumbList);
  });

  function handleClick(rou: AppRouteRecordRaw, paths: string[], e: Event) {
    e?.preventDefault();
    const { children, redirect, meta } = rou;

    if (children?.length && !redirect) {
      e?.stopPropagation();
      return;
    }
    if (meta?.carryParam) {
      return;
    }

    if (redirect && isString(redirect)) {
      history.push(redirect);
    } else {
      let goPath = '';
      if (paths.length === 1) {
        goPath = paths[0];
      } else {
        const ps = paths.slice(1);
        const lastPath = ps.pop() || '';
        goPath = `${lastPath}`;
      }
      goPath = /^\//.test(goPath) ? goPath : `/${goPath}`;
      history.push(goPath);
    }
  }

  function hasRedirect(rous: AppRouteRecordRaw[], rou: AppRouteRecordRaw) {
    return rous.indexOf(rou) !== rous.length - 1;
  }

  function getIcon(rou) {
    return rou.icon || rou.meta?.icon;
  }
  return <div>LayoutBreadcrumb</div>;
};

export default LayoutBreadcrumb;
