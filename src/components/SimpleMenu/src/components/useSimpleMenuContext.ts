// import { useImmer } from 'use-immer';
import { createContainer } from 'unstated-next';
import { MenuProp } from './Menu'
import { useCallback, useState, useRef, CSSProperties } from 'react';
import { cloneDeep } from 'lodash-es';
import type { Menu } from '/@/router/types';

const DELAY = 500;

export const useMenuContext = (memuProps: MenuProp) => {
  const [openedNames, setOpenedNames] = useState<string[]>(() => {
    console.log('openedNames初始化了：')
    return []
  });
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const timeout = useRef<TimeoutHandle | null>(null);
  const { accordion, collapse, onSelect, indentSize = 20 } = memuProps || {}
  const openNameChange = useCallback((changeMenu) => {
    const { parentPathList, path } = changeMenu;
    if (openedNames.includes(path)) {
      const newOpenedNames = openedNames.filter((openedName) => {
        return openedName.indexOf(path) === -1;
      })
      setOpenedNames(newOpenedNames);
    } else {
      setOpenedNames([...openedNames, ...parentPathList, path]);
    }
  }, [openedNames])

  // 手风琴模式
  const onUpdateOpened = useCallback(
    (changeMenu: Menu) => {
      if (collapse || !accordion) return;
      const { parentPathList, path } = changeMenu;
      const newOpenedNames = cloneDeep(parentPathList);
      // 如果未展开展开
      if (!openedNames.includes(path)) {
        newOpenedNames.push(path);
      }
      setOpenedNames(newOpenedNames);
    },
    [accordion, collapse, openedNames],
  );

  const onMenuItemSelect = useCallback(
    (menuItem: Menu) => {
      setCurrentMenu(menuItem);
      collapse && setOpenedNames([]);
      onSelect?.(menuItem.path);
    },
    [collapse, onSelect],
  );

  const handleMouseenter = useCallback((changeMenu: Menu, options) => {
    const { parentPathList, path } = changeMenu;
    if (options.disabled) return;
    if (timeout.current) {
      clearTimeout(timeout.current!);
      timeout.current = null;
    }
    console.log(6);
    setOpenedNames([...parentPathList, path]);
  }, [setOpenedNames]);

  const handleMouseleave = useCallback(() => {
    timeout.current = setTimeout(() => {
      console.log(9);
      setOpenedNames([]);
    }, DELAY);
  }, []);

  const getItemStyle = useCallback((changeMenu: Menu): CSSProperties => {
    const { parentPathList } = changeMenu;
    let padding = indentSize || 20;
    if (collapse) {
      padding = indentSize;
    } else {
      padding += indentSize * parentPathList.length;
    }
    return { paddingLeft: padding };
  }, [indentSize, collapse]);

  // useEffect(() => {
  //   if (currentRoute.name === REDIRECT_NAME) return;
  //   // currentActiveMenu.current = currentRoute.meta?.currentActiveMenu as string;

  //   if (accordion) {
  //     onUpdateOpened(currentRoute);
  //   } else {
  //     openNameChange(currentRoute);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentRoute.path]);
  console.log('openedNames:', openedNames);
  return {
    openedNames,
    currentMenu,
    memuProps,
    setCurrentMenu,
    setOpenedNames,
    getItemStyle,
    openNameChange,
    onUpdateOpened,
    onMenuItemSelect,
    handleMouseenter,
    handleMouseleave
  };
};

const MenuContext = createContainer(useMenuContext);

export const MenuProvider = MenuContext.Provider;

export const useMenuContextContainer = () => MenuContext.useContainer();
