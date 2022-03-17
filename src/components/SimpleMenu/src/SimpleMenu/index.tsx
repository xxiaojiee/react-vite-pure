import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Menu as MenuType, AppRouteRecordRaw } from '/@/router/types';
import type { MenuState } from '../types';
import { useDesign } from '/@/hooks/web/useDesign';
import Menu from '../components/Menu';
import SimpleSubMenu from '../SimpleSubMenu';
import classNames from 'classnames';
import { omit } from 'lodash-es';
import { useAppContainer } from '/@/hooks/core/useAppContext';
import { REDIRECT_NAME } from '/@/router/constant';
import { isFunction, isUrl } from '/@/utils/is';
import { openWindow } from '/@/utils';
import { useOpenKeys } from '../useOpenKeys';

import './index.less';


interface SimpleMenuProp {
  className?: string;
  items: MenuType[];
  collapse: boolean;
  mixSider?: boolean;
  theme: 'dark' | 'light';
  accordion: boolean;
  collapsedShowTitle: boolean;
  beforeClickFn: (key: string) => boolean;
  isSplitMenu: boolean;
  onMenuClick: Fn;
}

const SimpleMenu: React.FC<SimpleMenuProp> = (props) => {
  const {
    className,
    accordion = true,
    items,
    collapse,
    mixSider= false,
    theme,
    collapsedShowTitle,
    beforeClickFn,
    onMenuClick = () => {},
    isSplitMenu,
  } = props;
  const { route: currentRoute } = useAppContainer();
  const currentActiveMenu = useRef('');
  const isClickGo = useRef(false);

  const [menuState, setMenuState] = useState<MenuState>({
    activeName: '',
    openNames: [],
    activeSubMenuNames: [],
  });

  const { prefixCls } = useDesign('simple-menu');

  const { setOpenKeys, getOpenKeys } = useOpenKeys(
    menuState,
    items,
    accordion,
    mixSider,
    collapse,
    setMenuState,
  );

  useEffect(() => {
    if (collapse) {
      setMenuState((preState) => ({
        ...preState,
        openNames: [],
      }));
    } else {
      setOpenKeys(currentRoute.path);
    }
  }, [collapse, currentRoute.path, setOpenKeys]);

  useEffect(() => {
    if (!isSplitMenu) {
      return;
    }
    setOpenKeys(currentRoute.path);
  }, [currentRoute.path, isSplitMenu, setOpenKeys]);

  const handleMenuChange = useCallback(
    async (route?: AppRouteRecordRaw) => {
      if (isClickGo.current) {
        isClickGo.current = false;
        return;
      }
      const { path } = route || currentRoute;

      setMenuState((preState) => ({
        ...preState,
        activeName: path,
      }));

      setOpenKeys(path);
    },
    [currentRoute, setOpenKeys],
  );

  useEffect(() => {
    if (currentRoute.name === REDIRECT_NAME) return;

    currentActiveMenu.current = currentRoute.meta?.currentActiveMenu as string;
    handleMenuChange(currentRoute);

    if (currentActiveMenu.current) {
      setMenuState((preState) => ({
        ...preState,
        activeName: currentActiveMenu.current,
      }));
      setOpenKeys(currentActiveMenu.current);
    }
  }, [currentRoute, handleMenuChange, setOpenKeys]);

  const handleSelect = useCallback(
    async (key: string) => {
      if (isUrl(key)) {
        openWindow(key);
        return;
      }
      if (beforeClickFn && isFunction(beforeClickFn)) {
        const flag = beforeClickFn(key);
        if (!flag) return;
      }

      onMenuClick(key);

      isClickGo.current = true;
      setOpenKeys(key);
      setMenuState((preState) => ({
        ...preState,
        activeName: key,
      }));
    },
    [beforeClickFn, onMenuClick, setOpenKeys],
  );
  return (
    <Menu
      {...omit(props)}
      // activeName={menuState.activeName}
      openNames={getOpenKeys}
      className={classNames(prefixCls, className)}
      activeSubMenuNames={menuState.activeSubMenuNames}
      onSelect={handleSelect}
    >
      {items.map((item) => (
        <SimpleSubMenu
          item={item}
          key={item.path}
          parent
          theme={theme}
          collapsedShowTitle={collapsedShowTitle}
          collapse={collapse}
        />
      ))}
    </Menu>
  );
};

export default SimpleMenu;
