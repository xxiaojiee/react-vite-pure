// import { useImmer } from 'use-immer';
import { createContainer, } from 'unstated-next';
import { useState } from 'react';
import type { RefObject } from 'react';

export interface MenuContextProp {
  activeName: RefObject<string | number>;
  onUpdateOpened: (data: boolean | Array<string | number> | Recordable) => void;
  [index: string]: any;
}


export const useMenuContext = () => {
  const [menuContext, setMenuContext] = useState<MenuContextProp>({
    activeName: '',
  } as any);
  const saveMenuContext = (newContent: Partial<MenuContextProp>) => {
    setMenuContext((preState) => {
      return {
        ...preState,
        ...newContent,
      }
    });
  };
  return { ...menuContext, saveMenuContext };
};

const Menu = createContainer(useMenuContext);

export const MenuProvider = Menu.Provider;

export const useMenuContextContainer = () => Menu.useContainer();
