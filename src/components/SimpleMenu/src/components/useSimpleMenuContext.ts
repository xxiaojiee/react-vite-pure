// import { useImmer } from 'use-immer';
import { createContainer } from 'unstated-next';
import { MenuProp } from './Menu'
import { useState } from 'react';
import type { MutableRefObject } from 'react';
import type { Emitter } from '/@/utils/mitt'
import type { Menu } from '/@/router/types';

export interface MenuContextProp {
  currentMenu: Menu | null;
  openedNames: string[];
  rootMenuEmitter: Emitter;
  addSubMenu: (name: string) => void;
  removeSubMenu: (name: string) => void;
  removeAll: () => void;
  isRemoveAllPopup: MutableRefObject<boolean>;
  sliceIndex: (index: number) => void;
  memuProps: MenuProp;
  handleMouseleave: (deepDispatch: boolean) => void;
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
