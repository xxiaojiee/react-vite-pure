import React, { useCallback, useEffect, useState, useMemo } from 'react';
import type { Menu } from '/@/router/types';
import { useDesign } from '/@/hooks/web/useDesign';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { useMenuContextContainer } from '../useSimpleMenuContext';

interface MenuItemProp {
  className?: string;
  disabled?: boolean;
  collapse: boolean;
  title?: React.ReactNode;
  item: Menu;
}

const MenuItem: React.FC<MenuItemProp> = (props) => {
  const { className, disabled = false, collapse, title, item, children } = props;

  const { path, parentPathList } = item;
  const [active, setActive] = useState(false);

  const { prefixCls } = useDesign('menu');

  const {
    currentMenu,
    onMenuItemSelect,
    handleMouseenter,
    handleMouseleave,
    getItemStyle,
  } = useMenuContextContainer();

  const getClass = classNames(`${prefixCls}-item`, className, {
    [`${prefixCls}-item-active`]: active,
    [`${prefixCls}-item-selected`]: active,
    [`${prefixCls}-item-disabled`]: !!disabled,
  });

  const showTooptip = item.level === 1 && collapse && title;

  const handleClickItem = useCallback(
    (e) => {
      e.stopPropagation();
      if (disabled) {
        return;
      }
      onMenuItemSelect(item);
    },
    [disabled, item, onMenuItemSelect],
  );

  useEffect(() => {
    if (currentMenu?.path === path) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [currentMenu?.path, parentPathList, path]);

  const getEvents = useMemo(() => {
    if (!collapse) {
      return {};
    }
    return {
      onMouseEnter: () =>
        handleMouseenter(item, {
          disabled,
        }),
      onMouseLeave: handleMouseleave,
    };
  }, [disabled, collapse, handleMouseenter, handleMouseleave, item]);

  return (
    <li
      className={getClass}
      onClick={handleClickItem}
      style={collapse ? {} : getItemStyle(item)}
      {...getEvents}
    >
      {showTooptip ? (
        <Tooltip placement="right" title={title}>
          <div className={`${prefixCls}-tooltip`}>{children}</div>
        </Tooltip>
      ) : (
        <>
          {children}
          {title}
        </>
      )}
    </li>
  );
};

export default MenuItem;
