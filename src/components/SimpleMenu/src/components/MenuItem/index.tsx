import React, { useCallback, useEffect, useState, useMemo } from 'react';
import type { CSSProperties } from 'react';
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
  indentSize?: number;
  item: Menu;
}

const MenuItem: React.FC<MenuItemProp> = (props) => {
  const { className, disabled = false, collapse, title, item, indentSize = 20, children } = props;

  const { path, parentPathList } = item;

  const [active, setActive] = useState(false);

  const { prefixCls } = useDesign('menu');

  const { currentMenu, rootMenuEmitter } = useMenuContextContainer();

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
      rootMenuEmitter.emit('on-menu-item-select', item);
      if (collapse) {
        return;
      }
      rootMenuEmitter.emit('on-update-opened', {
        opend: false,
        parentPath: parentPathList[parentPathList.length - 1],
        parentPathList,
      });
    },
    [collapse, disabled, item, parentPathList, rootMenuEmitter],
  );

  useEffect(() => {
    if (currentMenu?.path === path) {
      setActive(true);
      rootMenuEmitter.emit('on-update-active-name:submenu', parentPathList);
    } else {
      setActive(false);
    }
  }, [currentMenu?.path, parentPathList, path, rootMenuEmitter]);

  const getItemStyle = useMemo((): CSSProperties => {
    if (!parent) return {};
    let padding = indentSize;

    if (collapse) {
      padding = indentSize;
    } else {
      padding += indentSize * (parentPathList.length - 1);
    }
    return { paddingLeft: padding };
  }, [collapse, indentSize, parentPathList.length]);

  return (
    <li className={getClass} onClick={handleClickItem} style={collapse ? {} : getItemStyle}>
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
