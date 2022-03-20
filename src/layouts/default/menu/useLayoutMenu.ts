import type { Menu } from '/@/router/types';
import { useCallback, useEffect, useState } from 'react';
import { MenuSplitTyeEnum } from '/@/enums/menuEnum';
import { useThrottleFn } from 'ahooks';
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
      if (splitNotLeft || isMobile || !currentRoute?.path) return;

      const currentActiveMenu = currentRoute.meta.currentActiveMenu as string;
      let parentPath = getCurrentParentPath(currentRoute.path);
      if (!parentPath) {
        parentPath = getCurrentParentPath(currentActiveMenu);
      }
      parentPath && throttleHandleSplitLeftMenu(parentPath);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRoute?.path, splitType],
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


  // // Menu changes
  useEffect(
    () => {
      genMenus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissionState.lastBuildMenuTime, permissionState.backMenuList]
  );

  // split Menu changes
  useEffect(
    () => {
      if (splitNotLeft) return;
      genMenus();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [split, splitNotLeft]
  );

  return { menusRef };
}
