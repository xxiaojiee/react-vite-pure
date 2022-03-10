import React, { useCallback, useEffect, useRef } from 'react';
import { useMount } from 'ahooks';
import classNames from 'classnames';
import type { SubMenuProvider } from '../types';

import { useDesign } from '/@/hooks/web/useDesign';
import { MenuProvider, useMenuContextContainer } from '../useSimpleMenuContext';

interface MenuProp {
  className?: string;
  theme: 'light' | 'dark';
  activeName: string | number;
  openNames?: string[];
  accordion?: boolean;
  width?: string | number;
  collapsedWidth?: string | number;
  indentSize?: number;
  collapse?: boolean;
  activeSubMenuNames?: Array<string | number>;
  onSelect?: Fn;
}

const Menu: React.FC<MenuProp> = (props) => {
  const {
    className,
    activeName,
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
  const { saveMenuContext, onUpdateOpened } = useMenuContextContainer();
  const currentActiveName = useRef<string | number>('');
  const openedNames = useRef<string[]>([]);

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

  useEffect(() => {
    openedNames.current = openNames;
  }, [openNames]);

  useEffect(() => {
    currentActiveName.current = activeName;
  }, [activeName]);

  const updateOpened = useCallback(() => {
    onUpdateOpened(openedNames.current);
  }, [onUpdateOpened]);

  useEffect(() => {
    updateOpened();
  }, [openNames, updateOpened]);

  const addSubMenu = (name: string) => {
    if (openedNames.current.includes(name)) return;
    openedNames.current.push(name);
    updateOpened();
  };

  const removeSubMenu = (name: string) => {
    openedNames.current = openedNames.current.filter((item) => item !== name);
    updateOpened();
  };

  const removeAll = () => {
    openedNames.current = [];
    updateOpened();
  };

  const sliceIndex = (index: number) => {
    if (index === -1) return;
    openedNames.current = openedNames.current.slice(0, index + 1);
    updateOpened();
  };

  useMount(() => {});

  useMount(() => {
    openedNames.current = !collapse ? [...openNames] : [];
    updateOpened();
    saveMenuContext({
      activeName: currentActiveName,
      addSubMenu,
      removeSubMenu,
      getOpenNames: () => openedNames.current,
      removeAll,
      isRemoveAllPopup,
      sliceIndex,
      level: 0,
      onMenuItemSelect: (name: string) => {
        currentActiveName.current = name;
        collapse && removeAll();
        onSelect(name);
      },
      openNameChange: ({ name, opened }) => {
        if (opened && !openedNames.current.includes(name)) {
          openedNames.current.push(name);
        } else if (!opened) {
          const index = openedNames.current.findIndex((item) => item === name);
          index !== -1 && openedNames.current.splice(index, 1);
        }
      },
      props: {
        activeName,
        theme,
        openNames,
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

export default Menu;
