import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import BasicSubMenuItem from './components/BasicSubMenuItem';
import { Menu } from 'antd';
import { useAppContainer } from '/@/hooks/core/useAppContext';
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
    onMenuClick,
    beforeClickFn,
  } = props;
  const isClickGo = useRef(false);
  const currentActiveMenu = useRef('');
  const getCurrentParentPath = useCurrentParentPath();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const { prefixCls } = useDesign('basic-menu');

  const { collapsed, topMenuAlign, split } = useMenuSetting();

  const { route: currentRoute } = useAppContainer();

  const { handleOpenChange, setOpenKeys, getOpenKeys } = useOpenKeys(items, mode as any, accordion);

  const getIsTopMenu = useMemo(() => {
    return (
      (type === MenuTypeEnum.TOP_MENU && mode === MenuModeEnum.HORIZONTAL) ||
      (isHorizontal && split)
    );
  }, [split, mode, isHorizontal, type]);

  const getMenuClass = useMemo(() => {
    const align = isHorizontal && split ? 'start' : topMenuAlign;
    return classNames(prefixCls, `justify-${align}`, {
      [`${prefixCls}__second`]: !isHorizontal && split,
      [`${prefixCls}__sidebar-hor`]: getIsTopMenu,
    });
  }, [getIsTopMenu, split, topMenuAlign, isHorizontal, prefixCls]);

  const getInlineCollapseOptions = useMemo(() => {
    const isInline = mode === MenuModeEnum.INLINE;

    const inlineCollapseOptions: { inlineCollapsed?: boolean } = {};
    if (isInline) {
      inlineCollapseOptions.inlineCollapsed = mixSider ? false : collapsed;
    }
    return inlineCollapseOptions;
  }, [collapsed, mixSider, mode]);

  const handleMenuChange = useCallback(
    (route?: AppRouteRecordRaw) => {
      if (isClickGo.current) {
        isClickGo.current = false;
        return;
      }
      const path = (route || currentRoute).meta?.currentActiveMenu || (route || currentRoute).path;
      setOpenKeys(path);
      if (currentActiveMenu.current) return;
      if (isHorizontal && split) {
        const parentPath = getCurrentParentPath(path);
        setSelectedKeys([parentPath]);
      } else {
        const parentPaths = getAllParentPath(items, path);
        console.log('设置selectkey拉33', path, items, parentPaths);
        setSelectedKeys(parentPaths);
      }
    },
    [currentRoute, setOpenKeys, isHorizontal, split, getCurrentParentPath, items],
  );

  useEffect(() => {
    if (currentRoute.name === REDIRECT_NAME) return;
    handleMenuChange(currentRoute);
    // currentActiveMenu： 最顶层memu
    currentActiveMenu.current = currentRoute.meta?.currentActiveMenu as string;

    if (currentActiveMenu.current) {
      setSelectedKeys([currentActiveMenu.current]);
      setOpenKeys(currentActiveMenu.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoute]);

  const handleMenuClick = useCallback(
    async ({ key }: { key: string; keyPath: string[] }) => {
      if (beforeClickFn && isFunction(beforeClickFn)) {
        const flag = await beforeClickFn(key);
        if (!flag) return;
      }
      onMenuClick && onMenuClick(key);
      isClickGo.current = true;
      setSelectedKeys([key]);
    },
    [beforeClickFn, onMenuClick],
  );

  useEffect(() => {
    if (!mixSider) {
      handleMenuChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mixSider]);
  console.log('items:', items);
  return (
    <Menu
      selectedKeys={selectedKeys}
      defaultSelectedKeys={[]}
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
      {items.map((item) => {
        return (
          <BasicSubMenuItem key={item.path} item={item} theme={theme} isHorizontal={isHorizontal} />
        );
      })}
    </Menu>
  );
};

export default BasicMenu;
