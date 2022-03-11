// import { useImmer } from 'use-immer';
import { createContainer } from 'unstated-next';
import { useState } from 'react';
import type { Menu } from '/@/router/types';

export interface MenuContextProp {
  currentMenu: Menu | null;
  openedNames: string[];
  onUpdateOpened: (data: boolean | Array<string | number> | Recordable) => void;
  onMenuItemSelect: (menuItem: Menu) => void;
  onUpdateActiveName: (data: string[]) => void;
  [index: string]: any;
}


export const useMenuContext = () => {
  const [menuContext, setMenuContext] = useState<MenuContextProp>({
    currentMenu: null,
    openedNames: null,
  } as any);
  const saveMenuContext = (newContent: Partial<MenuContextProp>) => {
    setMenuContext((preState) => {
      return {
        ...preState,
        ...newContent,
      }
    });
  };
  return {
    ...menuContext,
    saveMenuContext,
  };
};

const MenuContext = createContainer(useMenuContext);

export const MenuProvider = MenuContext.Provider;

export const useMenuContextContainer = () => MenuContext.useContainer();
