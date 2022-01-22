import React, { useState } from 'react';
import classNames from 'classnames';
import { useMount } from 'ahooks';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { useAppContainer } from '/@/components/Application';
import { useDesign } from '/@/hooks/web/useDesign';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { isString } from '/@/utils/is';
import { filter } from '/@/utils/helper/treeHelper';
import { useMenus } from '/@/router/menus';
import { REDIRECT_NAME } from '/@/router/constant';
import { getAllParentPath } from '/@/router/helper/menuHelper';

import type { AppRouteRecordRaw, Menu } from '/@/router/types';

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

interface RouteListProp extends Omit<Menu, 'children'> {
  breadcrumbName: string;
  children?: Array<Omit<RouteListProp, 'children'>>;
}

const LayoutBreadcrumb: React.FC<LayoutBreadcrumbProp> = (props) => {
  const { theme } = props;
  const [routeList, setRouteList] = useState<RouteListProp[]>([]);
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
    const getBreadcrumbName = (breadList) => {
      return breadList.map((menuIem) => ({
        ...menuIem,
        breadcrumbName: menuIem.name,
        children: menuIem.children ? getBreadcrumbName(menuIem.children) : undefined,
      }));
    };
    const breadcrumbNameList = getBreadcrumbName(breadcrumbList);
    setRouteList(breadcrumbNameList);
  });

  function handleClick(rou: RouteListProp, paths: string[]) {
    // e?.preventDefault();
    const { children, redirect, meta } = rou;

    if (children?.length && !redirect) {
      // e?.stopPropagation();
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

  function hasRedirect(rous: RouteListProp[], rou: RouteListProp) {
    console.log('rous:', rous);
    return rous.indexOf(rou) !== rous.length - 1;
  }

  function getIcon(rou) {
    return rou.icon || rou.meta?.icon;
  }

  const itemRender = (
    rou: RouteListProp,
    _params: Record<string, any>,
    routesMatched: RouteListProp[],
    paths: string[],
  ) => (
    <>
      {/* {getShowBreadCrumbIcon() && getIcon(rou) ? <Icon icon={getIcon(rou)} v-if="" /> : null} */}
      {!hasRedirect(routesMatched, rou) ? (
        <span>{rou.name || rou.meta?.title}</span>
      ) : (
        <Link to="" onClick={() => handleClick(rou, paths)}>
          {rou.name || rou.meta?.title}
        </Link>
      )}
    </>
  );

  return (
    <div className={classNames(prefixCls, `${prefixCls}--${theme}`)}>
      <Breadcrumb routes={routeList} itemRender={itemRender} />
    </div>
  );
};

export default LayoutBreadcrumb;
