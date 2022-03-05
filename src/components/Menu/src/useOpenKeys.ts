import { useMemo } from 'react';
import { MenuModeEnum } from '/@/enums/menuEnum';
import type { Menu as MenuType } from '/@/router/types';
import type { MenuState } from './types';
import { uniq } from 'lodash-es';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { getAllParentPath } from '/@/router/helper/menuHelper';
import { useTimeoutFn } from '/@/hooks/core/useTimeout';

export function useOpenKeys(
  menuState: MenuState,
  menus: MenuType[],
  mode: MenuModeEnum,
  accordion: boolean,
) {
  const { getCollapsed, getIsMixSidebar } = useMenuSetting();
  const { start: setOpenKeys } = useTimeoutFn(
    (path: string) => {
      if (mode === MenuModeEnum.HORIZONTAL) {
        return;
      }
      const menuList = menus;
      if (menuList?.length === 0) {
        menuState.openKeys = [];
        return;
      }
      if (!accordion) {
        menuState.openKeys = uniq([...menuState.openKeys, ...getAllParentPath(menuList, path)]);
      } else {
        menuState.openKeys = getAllParentPath(menuList, path);
      }
    }
    ,
    16,
    !getIsMixSidebar(),
  );
  const getOpenKeys = useMemo(() => {
    const collapse = getIsMixSidebar() ? false : getCollapsed();
    return collapse ? menuState.collapsedOpenKeys : menuState.openKeys;
  }, [getCollapsed, getIsMixSidebar, menuState.collapsedOpenKeys, menuState.openKeys]);

  /**
   * @description:  重置值
   */
  const resetKeys = () => {
    menuState.selectedKeys = [];
    menuState.openKeys = [];
  }

  function handleOpenChange(openKeys: string[]) {
    if (mode === MenuModeEnum.HORIZONTAL || !accordion || getIsMixSidebar()) {
      menuState.openKeys = openKeys;
    } else {
      // const menuList = toRaw(menus.value);
      // getAllParentPath(menuList, path);
      const rootSubMenuKeys: string[] = [];
      for (const { children, path } of menus) {
        if (children && children.length > 0) {
          rootSubMenuKeys.push(path);
        }
      }
      if (!getCollapsed()) {
        const latestOpenKey = openKeys.find((key) => menuState.openKeys.indexOf(key) === -1);
        if (rootSubMenuKeys.indexOf(latestOpenKey as string) === -1) {
          menuState.openKeys = openKeys;
        } else {
          menuState.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
      } else {
        menuState.collapsedOpenKeys = openKeys;
      }
    }
  }
  return { setOpenKeys, resetKeys, getOpenKeys, handleOpenChange };
}
