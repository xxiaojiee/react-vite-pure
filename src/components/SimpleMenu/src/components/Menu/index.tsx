import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Menu } from '/@/router/types';
import { useMount } from 'ahooks';
import classNames from 'classnames';
// import type { SubMenuProvider } from '../types';

import { useDesign } from '/@/hooks/web/useDesign';
import { MenuProvider, useMenuContextContainer } from '../useSimpleMenuContext';

interface MenuProp {
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

  useEffect(() => {
    saveMenuContext({
      openedNames: openNames,
    });
  }, [openNames, saveMenuContext]);

  const addSubMenu = useCallback(
    (name: string) => {
      if (openedNames.includes(name)) return;
      saveMenuContext({
        openedNames: [...openedNames, name],
      });
    },
    [openedNames, saveMenuContext],
  );

  const removeSubMenu = useCallback(
    (name: string) => {
      const newOpenedNames = openedNames.filter((item) => item !== name);
      saveMenuContext({
        openedNames: newOpenedNames,
      });
    },
    [openedNames, saveMenuContext],
  );

  const removeAll = () => {
    saveMenuContext({
      openedNames: [],
    });
  };

  const sliceIndex = useCallback(
    (index: number) => {
      if (index === -1) return;
      const newOpenedNames = openedNames.slice(0, index + 1);
      saveMenuContext({
        openedNames: newOpenedNames,
      });
    },
    [openedNames, saveMenuContext],
  );

  const openNameChange = useCallback(
    ({ name, opened }) => {
      if (opened && !openedNames.includes(name)) {
        saveMenuContext({
          openedNames: [...openedNames, name],
        });
      } else if (!opened) {
        const index = openedNames.findIndex((item) => item === name);
        if (index !== -1) {
          const newOpenedNames = openedNames.splice(index, 1);
          saveMenuContext({
            openedNames: newOpenedNames,
          });
        }
      }
    },
    [openedNames, saveMenuContext],
  );

  useMount(() => {
    saveMenuContext({
      openedNames: !collapse ? [...openNames] : [],
      openNameChange,
      addSubMenu,
      removeSubMenu,
      removeAll,
      isRemoveAllPopup,
      sliceIndex,
      onMenuItemSelect: (menuItem: Menu) => {
        saveMenuContext({
          currentMenu: menuItem,
        });
        collapse && removeAll();
        onSelect(menuItem);
      },
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
