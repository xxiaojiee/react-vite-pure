import type { Menu } from '/@/router/types';
import { useCallback, useEffect, useState } from 'react';
import { MenuSplitTyeEnum } from '/@/enums/menuEnum';
import { useThrottleFn, useMount } from 'ahooks';
import { useAppContainer } from '/@/hooks/core/useAppContext';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useChildrenMenus, useCurrentParentPath, useMenus, useShallowMenus } from '/@/router/menus';
import { useStoreState } from '/@/store';
import { useAppInject } from '/@/hooks/web/useAppInject';

export function useSplitMenu(splitType: MenuSplitTyeEnum) {
  // Menu array
  const [menusRef, setmenusRef] = useState<Menu[]>([]);
  const { route: currentRoute } = useAppContainer();
  const { isMobile } = useAppInject();
  const permissionState = useStoreState('permission');
  const shallowMenuList = useShallowMenus();
  const menus = useMenus();
  const getCurrentParentPath = useCurrentParentPath();
  const getChildrenMenus = useChildrenMenus();
  const { setMenuSetting, isHorizontal, split } = useMenuSetting();

  const getSplitLeft = !split || splitType !== MenuSplitTyeEnum.LEFT;

  const getSpiltTop = splitType === MenuSplitTyeEnum.TOP;

  const normalType = splitType === MenuSplitTyeEnum.NONE || !split;

  // Handle left menu split
  const handleSplitLeftMenu = useCallback((parentPath: string) => {
    if (getSplitLeft || isMobile) return;

    // spilt mode left
    const children = getChildrenMenus(parentPath);

    if (!children || !children.length) {
      setMenuSetting({ hidden: true });
      setmenusRef([])
      return;
    }

    setMenuSetting({ hidden: false });
    setmenusRef(children);
  }, [getChildrenMenus, isMobile, getSplitLeft, setMenuSetting])

  const { run: throttleHandleSplitLeftMenu } = useThrottleFn(handleSplitLeftMenu, {
    wait: 50
  });

  const splitNotLeft = splitType !== MenuSplitTyeEnum.LEFT && !isHorizontal;

  useEffect(
    () => {
      if (splitNotLeft || isMobile) return;

      const currentActiveMenu = currentRoute.meta.currentActiveMenu as string;
      let parentPath = getCurrentParentPath(currentRoute.path);
      if (!parentPath) {
        parentPath = getCurrentParentPath(currentActiveMenu);
      }
      parentPath && throttleHandleSplitLeftMenu(parentPath);
    },
    [currentRoute.meta.currentActiveMenu, currentRoute.path, splitNotLeft, splitType, getCurrentParentPath, isMobile, throttleHandleSplitLeftMenu],
  );



  // get menus
  const genMenus = useCallback(() => {
    // normal mode
    if (normalType || isMobile) {
      setmenusRef(menus);
      return;
    }
    // split-top
    if (getSpiltTop) {
      setmenusRef(shallowMenuList);
    }
  }, [isMobile, getSpiltTop, menus, normalType, shallowMenuList])

  useMount(() => {
    genMenus();
  })

  // // Menu changes
  // useEffect(
  //   () => {
  //     genMenus();
  //   },
  //   [permissionState.lastBuildMenuTime, permissionState.backMenuList, genMenus]
  // );

  // // split Menu changes
  // useEffect(
  //   () => {
  //     if (splitNotLeft) return;
  //     genMenus();
  //   },
  //   [genMenus, split, splitNotLeft]
  // );

  return { menusRef };
}
