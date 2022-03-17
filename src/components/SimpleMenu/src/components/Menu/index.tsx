import React, { useCallback, useEffect, useRef } from 'react';
import type { Menu } from '/@/router/types';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import mitt from '/@/utils/mitt';
// import type { SubMenuProvider } from '../types';

import { useDesign } from '/@/hooks/web/useDesign';
import { MenuProvider, useMenuContextContainer } from '../useSimpleMenuContext';

export interface MenuProp {
  className?: string;
  theme: 'light' | 'dark';
  openNames?: string[];
  accordion?: boolean;
  width?: string | number;
  collapsedWidth?: string | number;
  indentSize?: number;
  collapse?: boolean;
  activeSubMenuNames?: Array<string | number>;
  onSelect?: Fn;
}

const MenuMain: React.FC<MenuProp> = (props) => {
  const {
    className,
    theme = 'light',
    openNames = [],
    accordion = true,
    width = '100%',
    collapsedWidth = '48px',
    indentSize = 16,
    collapse = true,
    activeSubMenuNames = [],
    onSelect = () => {},
    children,
  } = props;
  const rootMenuEmitter = mitt();

  const { openedNames, saveMenuContext } = useMenuContextContainer();

  const { prefixCls } = useDesign('menu');

  const isRemoveAllPopup = useRef(false);

  const getClass = classNames(
    prefixCls,
    `${prefixCls}-${theme}`,
    `${prefixCls}-vertical`,
    className,
    {
      [`${prefixCls}-collapse`]: props.collapse,
    },
  );

  const updateOpened = useCallback(
    (names) => {
      saveMenuContext({
        openedNames: names,
      });
      rootMenuEmitter.emit('on-update-opened', names);
    },
    [rootMenuEmitter, saveMenuContext],
  );

  useEffect(() => {
    updateOpened(openNames);
  }, [openNames, updateOpened]);

  const addSubMenu = useCallback(
    (name: string) => {
      if (openedNames.includes(name)) return;
      updateOpened([...openedNames, name]);
    },
    [openedNames, updateOpened],
  );

  const removeSubMenu = useCallback(
    (name: string) => {
      const newOpenedNames = openedNames.filter((item) => item !== name);
      updateOpened(newOpenedNames);
    },
    [openedNames, updateOpened],
  );

  const removeAll = useCallback(() => {
    updateOpened([]);
  }, [updateOpened]);

  const sliceIndex = useCallback(
    (index: number) => {
      if (index === -1) return;
      const newOpenedNames = openedNames.slice(0, index + 1);
      updateOpened(newOpenedNames);
    },
    [openedNames, updateOpened],
  );

  const openNameChange = useCallback(
    ({ name, opened }) => {
      if (opened && !openedNames.includes(name)) {
        updateOpened([...openedNames, name]);
      } else if (!opened) {
        const index = openedNames.findIndex((item) => item === name);
        if (index !== -1) {
          const newOpenedNames = openedNames.splice(index, 1);
          updateOpened(newOpenedNames);
        }
      }
    },
    [openedNames, updateOpened],
  );

  const onMenuItemSelect = useCallback(
    (menuItem: Menu) => {
      saveMenuContext({
        currentMenu: menuItem,
      });
      collapse && removeAll();
      onSelect(menuItem);
    },
    [collapse, onSelect, removeAll, saveMenuContext],
  );

  useMount(() => {
    updateOpened(!collapse ? [...openNames] : []);
    rootMenuEmitter.on('on-menu-item-select', onMenuItemSelect);
    rootMenuEmitter.on('open-name-change', openNameChange);
    saveMenuContext({
      rootMenuEmitter,
      addSubMenu,
      removeSubMenu,
      removeAll,
      isRemoveAllPopup,
      sliceIndex,
      memuProps: {
        theme,
        accordion,
        width,
        collapsedWidth,
        indentSize,
        collapse,
        activeSubMenuNames,
        onSelect,
      },
    });
  });
  return (
    <MenuProvider>
      <ul className={getClass}>{children}</ul>
    </MenuProvider>
  );
};

export default MenuMain;
