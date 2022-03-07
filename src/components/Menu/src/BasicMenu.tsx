import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Menu } from 'antd';
import classNames from 'classnames';
import { useAppContainer } from '/@/hooks/core/useAppContext';
import BasicSubMenuItem from './components/BasicSubMenuItem';
import { listenerRouteChange } from '/@/logics/mitt/routeChange';
import { useOpenKeys } from './useOpenKeys';
import { isFunction } from '/@/utils/is';
import { BasicProps } from './props';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { REDIRECT_NAME } from '/@/router/constant';
import { useDesign } from '/@/hooks/web/useDesign';
import { getAllParentPath } from '/@/router/helper/menuHelper';
import { useCurrentParentPath } from '/@/router/menus';

import type { AppRouteRecordRaw } from '/@/router/types';

import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { ThemeEnum } from '/@/enums/appEnum';

const BasicMenu: React.FC<BasicProps> = (props) => {
  const {
    items,
    isHorizontal,
    mixSider,
    inlineIndent = 20,
    mode = MenuModeEnum.INLINE,
    type = MenuTypeEnum.MIX,
    theme = ThemeEnum.DARK,
    accordion = true,
    menuClick,
    beforeClickFn,
  } = props;
  const isClickGo = useRef(false);
  const currentActiveMenu = useRef('');
  const getCurrentParentPath = useCurrentParentPath();
  const [defaultSelectedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const { prefixCls } = useDesign('basic-menu');

  const { getCollapsed, getTopMenuAlign, getSplit } = useMenuSetting();

  const { route: currentRoute } = useAppContainer();

  const { handleOpenChange, setOpenKeys, getOpenKeys } = useOpenKeys(items, mode as any, accordion);

  const getIsTopMenu = useMemo(() => {
    return (
      (type === MenuTypeEnum.TOP_MENU && mode === MenuModeEnum.HORIZONTAL) ||
      (isHorizontal && getSplit())
    );
  }, [getSplit, mode, isHorizontal, type]);

  const getMenuClass = useMemo(() => {
    const align = isHorizontal && getSplit() ? 'start' : getTopMenuAlign();
    return classNames(prefixCls, `justify-${align}`, {
      [`${prefixCls}__second`]: !isHorizontal && getSplit(),
      [`${prefixCls}__sidebar-hor`]: getIsTopMenu(),
    });
  }, [getIsTopMenu, getSplit, getTopMenuAlign, isHorizontal, prefixCls]);

  const getInlineCollapseOptions = useMemo(() => {
    const isInline = mode === MenuModeEnum.INLINE;

    const inlineCollapseOptions: { inlineCollapsed?: boolean } = {};
    if (isInline) {
      inlineCollapseOptions.inlineCollapsed = mixSider ? false : getCollapsed();
    }
    return inlineCollapseOptions;
  }, [getCollapsed, mixSider, mode]);

  listenerRouteChange((route) => {
    if (route.name === REDIRECT_NAME) return;
    handleMenuChange(route);
    currentActiveMenu.current = route.meta?.currentActiveMenu as string;

    if (currentActiveMenu.current) {
      setSelectedKeys([currentActiveMenu.current]);
      setOpenKeys(currentActiveMenu.current);
    }
  });

  const handleMenuClick = useCallback(
    async ({ key }: { key: string; keyPath: string[] }) => {
      if (beforeClickFn && isFunction(beforeClickFn)) {
        const flag = await beforeClickFn(key);
        if (!flag) return;
      }
      menuClick(key);
      isClickGo.current = true;
      setSelectedKeys([key]);
    },
    [beforeClickFn, menuClick],
  );

  const handleMenuChange = useCallback(
    async (route?: AppRouteRecordRaw) => {
      if (isClickGo.current) {
        isClickGo.current = false;
        return;
      }
      const path = (route || currentRoute).meta?.currentActiveMenu || (route || currentRoute).path;
      setOpenKeys(path);
      if (currentActiveMenu.current) return;
      if (isHorizontal && getSplit()) {
        const parentPath = await getCurrentParentPath(path);
        setSelectedKeys([parentPath]);
      } else {
        const parentPaths = await getAllParentPath(items, path);
        setSelectedKeys(parentPaths);
      }
    },
    [currentRoute, setOpenKeys, isHorizontal, getSplit, getCurrentParentPath, items],
  );

  useEffect(() => {
    if (!mixSider) {
      handleMenuChange();
    }
  }, [handleMenuChange, items, mixSider]);

  return (
    <Menu
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      mode={mode}
      openKeys={getOpenKeys}
      inlineIndent={inlineIndent}
      theme={theme}
      onOpenChange={handleOpenChange}
      className={getMenuClass}
      onClick={handleMenuClick}
      subMenuOpenDelay={0.2}
      {...getInlineCollapseOptions}
    >
      {items.map((item) => (
        <BasicSubMenuItem item={item} theme={theme} isHorizontal={isHorizontal} />
      ))}
    </Menu>
  );
};

export default BasicMenu;
