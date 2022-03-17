import { useMemo, useState } from 'react';
import { MenuModeEnum } from '/@/enums/menuEnum';
import type { Menu as MenuType } from '/@/router/types';
import { uniq } from 'lodash-es';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { getAllParentPath } from '/@/router/helper/menuHelper';
import { useTimeoutFn } from '/@/hooks/core/useTimeout';

export function useOpenKeys(
  menus: MenuType[],
  mode: MenuModeEnum,
  accordion: boolean,
) {
  const [openKeyList, setOpenKeyList] = useState<string[]>([]);
  const [collapsedOpenKeys, setCollapsedOpenKeys] = useState<string[]>([]);
  const { collapsed, isMixSidebar } = useMenuSetting();
  const { start: setOpenKeys } = useTimeoutFn(
    (path: string) => {
      if (mode === MenuModeEnum.HORIZONTAL) {
        return;
      }
      const menuList = menus;
      if (menuList?.length === 0) {
        setOpenKeyList([]);
        return;
      }
      if (!accordion) {
        setOpenKeyList(uniq([...openKeyList, ...getAllParentPath(menuList, path)]));
      } else {
        setOpenKeyList(getAllParentPath(menuList, path));
      }
    }
    ,
    16,
    !isMixSidebar,
  );
  const getOpenKeys = useMemo(() => {
    const collapse = isMixSidebar ? false : collapsed;
    return collapse ? collapsedOpenKeys : openKeyList;
  }, [collapsed, isMixSidebar, collapsedOpenKeys, openKeyList]);


  function handleOpenChange(openKeys: string[]) {
    if (mode === MenuModeEnum.HORIZONTAL || !accordion || isMixSidebar) {
      setOpenKeyList(openKeys);
    } else {
      // const menuList = toRaw(menus.value);
      // getAllParentPath(menuList, path);
      const rootSubMenuKeys: string[] = [];
      for (const { children, path } of menus) {
        if (children && children.length > 0) {
          rootSubMenuKeys.push(path);
        }
      }
      if (!collapsed) {
        const latestOpenKey = openKeys.find((key) => openKeyList.indexOf(key) === -1);
        if (rootSubMenuKeys.indexOf(latestOpenKey as string) === -1) {
          setOpenKeyList(openKeys);
        } else {
          setOpenKeyList(latestOpenKey ? [latestOpenKey] : []);
        }
      } else {
        setCollapsedOpenKeys(openKeys);
      }
    }
  }
  return { setOpenKeys,getOpenKeys, handleOpenChange };
}
