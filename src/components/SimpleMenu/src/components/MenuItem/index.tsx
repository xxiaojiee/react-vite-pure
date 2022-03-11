import React, { useEffect, useState } from 'react';
import type { Menu } from '/@/router/types';
import { useDesign } from '/@/hooks/web/useDesign';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { useMenuContextContainer } from '../useSimpleMenuContext';

interface MenuItemProp {
  className?: string;
  disabled: boolean;
  collapse: boolean;
  title?: boolean;
  item: Menu;
}

const MenuItem: React.FC<MenuItemProp> = (props) => {
  const { className, disabled, collapse, title, item } = props;

  const { path, parentPathList } = item;

  const [active, setActive] = useState(false);

  const { prefixCls } = useDesign('menu');

  const { onUpdateOpened, saveMenuContext, currentMenu, onUpdateActiveName, onMenuItemSelect } =
    useMenuContextContainer();

  const getClass = classNames(`${prefixCls}-item`, className, {
    [`${prefixCls}-item-active`]: active,
    [`${prefixCls}-item-selected`]: active,
    [`${prefixCls}-item-disabled`]: !!disabled,
  });

  const getCollapse = collapse;

  const showTooptip = item.level === 1 && collapse && title;

  const handleClickItem = () => {
    if (disabled) {
      return;
    }
    onMenuItemSelect(item);
    if (collapse) {
      return;
    }
    saveMenuContext({
      opend: false,
      parentPath: parentPathList[parentPathList.length - 1],
      parentPathList,
    });
  };

  useEffect(() => {
    if (currentMenu?.path === path) {
      setActive(true);
      onUpdateActiveName(parentPathList);
    } else {
      setActive(false);
    }
  }, [currentMenu, parentPathList, path, onUpdateActiveName]);

  return <div>MenuItem</div>;
};

export default MenuItem;
