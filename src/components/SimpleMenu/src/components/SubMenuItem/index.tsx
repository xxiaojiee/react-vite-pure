import React, { useMemo, useCallback, CSSProperties } from 'react';
import { useDesign } from '/@/hooks/web/useDesign';
import { useMenuContextContainer } from '../useSimpleMenuContext';
import { CollapseTransition } from '/@/components/Transition';
import Icon from '/@/components/Icon';
import { Popover } from 'antd';
import classNames from 'classnames';

import type { Menu } from '/@/router/types';
interface SubMenuItemProp {
  className?: string;
  item: Menu;
  disabled?: boolean;
  title: React.ReactNode;
  collapsedShowTitle: boolean;
}

const SubMenuItem: React.FC<SubMenuItemProp> = (props) => {
  const { className, item, disabled = false, collapsedShowTitle, title, children } = props;
  const { parentPathList, path, level } = item;

  const { prefixCls } = useDesign('menu');

  const {
    currentMenu,
    openedNames,
    openNameChange,
    onUpdateOpened,
    handleMouseenter,
    handleMouseleave,
    getItemStyle,
    memuProps,
  } = useMenuContextContainer();

  const isOpend = openedNames.includes(path);
  const active = currentMenu?.path === path;
  const getClass = classNames(`${prefixCls}-submenu`, className, {
    [`${prefixCls}-item-active`]: active,
    [`${prefixCls}-opened`]: isOpend,
    [`${prefixCls}-submenu-disabled`]: disabled,
    [`${prefixCls}-submenu-has-parent-submenu`]: !!parentPathList.length,
    [`${prefixCls}-child-item-active`]: active,
  });

  const { accordion, collapse, theme } = memuProps || {};

  const getOverlayStyle = {
    minWidth: '200px',
  };

  const getSubClass = useMemo(() => {
    return classNames(`${prefixCls}-submenu-title`, {
      [`${prefixCls}-submenu-active`]: active,
      [`${prefixCls}-submenu-active-border`]: active && level === 1,
      [`${prefixCls}-submenu-collapse`]: collapse && level === 1,
    });
  }, [prefixCls, active, level, collapse]);

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

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (accordion) {
        onUpdateOpened(item);
      } else {
        openNameChange(item);
      }
    },
    [accordion, item, onUpdateOpened, openNameChange],
  );

  return (
    <li className={getClass}>
      {collapse ? (
        <Popover
          placement="right"
          overlayClassName={`${prefixCls}-menu-popover`}
          visible={isOpend}
          overlayStyle={getOverlayStyle}
          align={{ offset: [0, 0] }}
          content={
            <div>
              <ul className={classNames(prefixCls, `${prefixCls}-${theme}`, `${prefixCls}-popup`)}>
                {children}
              </ul>
            </div>
          }
        >
          <div className={getSubClass} {...getEvents}>
            <div
              className={classNames({
                [`${prefixCls}-submenu-popup`]: !parentPathList.length,
                [`${prefixCls}-submenu-collapsed-show-tit`]: collapsedShowTitle,
              })}
            >
              {title}
            </div>
            {parentPathList.length ? (
              <Icon
                icon="eva:arrow-ios-downward-outline"
                size={14}
                className={`${prefixCls}-submenu-title-icon`}
              />
            ) : null}
          </div>
        </Popover>
      ) : (
        <>
          <div
            className={`${prefixCls}-submenu-title`}
            onClick={handleClick}
            style={getItemStyle(item)}
          >
            {title}
            <Icon
              icon="eva:arrow-ios-downward-outline"
              size={14}
              className={`${prefixCls}-submenu-title-icon`}
            />
          </div>
          <CollapseTransition show={isOpend}>
            <ul className={prefixCls}>{children}</ul>
          </CollapseTransition>
        </>
      )}
    </li>
  );
};

export default SubMenuItem;
