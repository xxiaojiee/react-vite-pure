import React from 'react';
import classNames from 'classnames';
import { useDesign } from '/@/hooks/web/useDesign';
import { MenuProvider } from '../useSimpleMenuContext';

import './index.less';

export interface MenuProp {
  className?: string;
  theme: 'light' | 'dark';
  accordion?: boolean;
  width?: string | number;
  collapsedWidth?: string | number;
  indentSize?: number;
  collapse?: boolean;
  onSelect?: Fn;
}

const MenuMain: React.FC<MenuProp> = (props) => {
  const {
    className,
    theme = 'light',
    accordion = true,
    width = '100%',
    collapsedWidth = '48px',
    indentSize = 16,
    collapse = true,
    onSelect = () => {},
    children,
  } = props;

  const { prefixCls } = useDesign('menu');

  const getClass = classNames(
    prefixCls,
    `${prefixCls}-${theme}`,
    `${prefixCls}-vertical`,
    className,
    {
      [`${prefixCls}-collapse`]: collapse,
    },
  );
  return (
    <MenuProvider
      initialState={{
        theme,
        className,
        accordion,
        width,
        collapsedWidth,
        indentSize,
        collapse,
        onSelect,
      }}
    >
      <ul className={getClass}>{children}</ul>;
    </MenuProvider>
  );
};

export default MenuMain;
