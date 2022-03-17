import type { Menu as MenuType } from '/@/router/types';
import type { MenuState } from './types';

import { uniq } from 'lodash-es';
import { getAllParentPath } from '/@/router/helper/menuHelper';
import { useDebounceFn } from 'ahooks';

import { useTimeoutFn } from '/@/hooks/core/useTimeout';

export function useOpenKeys(
  menuState: MenuState,
  menus: MenuType[],
  accordion: boolean,
  mixSider: boolean,
  collapse: boolean,
  setMenuState: Fn,
) {
  const { start: setOpenKeys } = useTimeoutFn(
    (path: string) => {
      const menuList = menus;
      if (menuList?.length === 0) {
        setMenuState((preState) => ({
          ...preState,
          activeSubMenuNames: [],
          openNames: [],
        }))
        return;
      }
      const keys = getAllParentPath(menuList, path);
      setMenuState((preState) => ({
        ...preState,
        activeSubMenuNames: menuState.openNames,
        openNames: accordion ? keys : uniq([...menuState.openNames, ...keys]),
      }))
    },
    30,
    !mixSider,
  );

  const { run: debounceSetOpenKeys } = useDebounceFn(setOpenKeys, {
    wait: 50
  });

  const getOpenKeys =  collapse? [] : menuState.openNames;

  return { setOpenKeys: debounceSetOpenKeys, getOpenKeys };
}
