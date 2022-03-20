import React, { useCallback } from 'react';
import type { Menu as MenuType } from '/@/router/types';
import { useDesign } from '/@/hooks/web/useDesign';
import Menu from '../components/Menu';
import SimpleSubMenu from '../SimpleSubMenu';
import classNames from 'classnames';
import { omit } from 'lodash-es';
import { isFunction, isUrl } from '/@/utils/is';
import { openWindow } from '/@/utils';
import './index.less';

interface SimpleMenuProp {
  className?: string;
  items: MenuType[];
  collapse?: boolean;
  mixSider?: boolean;
  theme: 'dark' | 'light';
  accordion?: boolean;
  collapsedShowTitle?: boolean;
  beforeClickFn?: (key: string) => boolean;
  isSplitMenu?: boolean;
  onMenuClick: Fn;
}

const SimpleMenu: React.FC<SimpleMenuProp> = (props) => {
  const {
    className,
    items,
    collapse = false,
    theme,
    collapsedShowTitle = false,
    beforeClickFn,
    onMenuClick = () => {},
  } = props;

  const { prefixCls } = useDesign('simple-menu');

  const handleSelect = useCallback(
    async (key: string) => {
      if (isUrl(key)) {
        openWindow(key);
        return;
      }
      if (beforeClickFn && isFunction(beforeClickFn)) {
        const flag = beforeClickFn(key);
        if (!flag) return;
      }

      onMenuClick(key);
    },
    [beforeClickFn, onMenuClick],
  );
  return (
    <Menu
      {...omit(props)}
      className={classNames(prefixCls, className)}
      onSelect={handleSelect}
    >
      {items.map((item) => (
        <SimpleSubMenu
          item={item}
          key={item.path}
          parent
          theme={theme}
          collapsedShowTitle={collapsedShowTitle}
          collapse={collapse}
        />
      ))}
    </Menu>
  );
};

export default SimpleMenu;
