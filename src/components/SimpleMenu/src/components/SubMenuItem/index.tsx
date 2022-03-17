import React, { useState, useRef, useMemo, useCallback, CSSProperties } from 'react';
import { useDesign } from '/@/hooks/web/useDesign';
import { useMenuContextContainer } from '../useSimpleMenuContext';
import { useMount } from 'ahooks';
import { CollapseTransition } from '/@/components/Transition';
import Icon from '/@/components/Icon';
import { Popover } from 'antd';
import classNames from 'classnames';
import { isBoolean, isObject } from '/@/utils/is';
import mitt from '/@/utils/mitt';

import type { Menu } from '/@/router/types';

interface SubMenuItemProp {
  className?: string;
  item: Menu;
  disabled?: boolean;
  title: React.ReactNode;
  collapsedShowTitle: boolean;
  indentSize?: number;
  collapse: boolean;
}

const DELAY = 200;

const SubMenuItem: React.FC<SubMenuItemProp> = (props) => {
  const {
    className,
    item,
    disabled=false,
    collapsedShowTitle,
    title,
    indentSize = 20,
    collapse,
    children,
  } = props;
  const { parentPathList, path, level } = item;
  const [active, setActive] = useState(false);
  const [opened, setOpened] = useState(false);

  const timeout = useRef<TimeoutHandle | null>(null);
  const mouseInChild = useRef(false);
  const isChild = useRef(false);

  const { prefixCls } = useDesign('menu');

  const subMenuEmitter = mitt();

  const {
    saveMenuContext,
    openedNames,
    rootMenuEmitter,
    addSubMenu: parentAddSubmenu,
    removeSubMenu: parentRemoveSubmenu,
    removeAll: parentRemoveAll,
    isRemoveAllPopup,
    sliceIndex,
    memuProps: rootProps,
    handleMouseleave: parentHandleMouseleave,
  } = useMenuContextContainer();

  const getClass = classNames(`${prefixCls}-submenu`, className, {
    [`${prefixCls}-item-active`]: active,
    [`${prefixCls}-opened`]: opened,
    [`${prefixCls}-submenu-disabled`]: disabled,
    [`${prefixCls}-submenu-has-parent-submenu`]: !!parentPathList.length,
    [`${prefixCls}-child-item-active`]: active,
  });

  const getAccordion = rootProps.accordion;
  const getCollapse = rootProps.collapse;
  const getTheme = rootProps.theme;

  const getOverlayStyle = {
    minWidth: '200px',
  };

  const getIsOpend = useMemo(() => {
    if (getCollapse) {
      return openedNames.includes(path);
    }
    return opened;
  }, [getCollapse, opened, openedNames, path]);

  const getSubClass = useMemo(() => {
    const isActive = rootProps?.activeSubMenuNames?.includes(path);
    return classNames(`${prefixCls}-submenu-title`, {
      [`${prefixCls}-submenu-active`]: isActive,
      [`${prefixCls}-submenu-active-border`]: isActive && level === 1,
      [`${prefixCls}-submenu-collapse`]: getCollapse && level === 1,
    });
  }, [getCollapse, level, path, prefixCls, rootProps?.activeSubMenuNames]);

  // const handleMouseleave = useCallback((deepDispatch = false) => {
  //   const parentName = parentPathList[parentPathList.length - 1];
  //   if (!parentName) {
  //     isRemoveAllPopup.current = true;
  //   }

  //   // 是否是打开最后一个
  //   if (openedNames.slice(-1)[0] === path) {
  //     isChild.current = false;
  //   }

  //   if (!isChild.current) {
  //     mouseInChild.current = false;
  //     clearTimeout(timeout.current!);
  //   }

  //   if (timeout.current) {
  //     clearTimeout(timeout.current!);
  //     timeout.current = setTimeout(() => {
  //       if (isRemoveAllPopup.current) {
  //         parentRemoveAll();
  //       } else if (!mouseInChild.current) {
  //         parentRemoveSubmenu(path);
  //       }
  //     }, DELAY);
  //   }
  //   if (deepDispatch) {
  //     if (getParentSubMenu.value) {
  //       parentHandleMouseleave?.(true);
  //     }
  //   }
  // }, []);

  // const handleMouseenter = useCallback(() => {
  //   if (disabled) return;

  //   mouseInChild.current = true;
  //   isRemoveAllPopup.current = false;
  //   clearTimeout(timeout.current!);

  //   const index = openedNames.findIndex((items: string) => items === path);

  //   sliceIndex(index);

  //   const isRoot = level === 0 && openedNames.length === 2;
  //   if (isRoot) {
  //     parentRemoveAll();
  //   }
  //   isChild.current = openedNames.includes(path);
  //   clearTimeout(timeout.current!);
  //   timeout.current = setTimeout(() => {
  //     parentAddSubmenu(path);
  //   }, DELAY);
  // }, [
  //   disabled,
  //   isRemoveAllPopup,
  //   level,
  //   openedNames,
  //   parentAddSubmenu,
  //   parentRemoveAll,
  //   path,
  //   sliceIndex,
  // ]);

  const getEvents = useCallback((deep: boolean) => {
    return {};
    // if (!getCollapse) {
    //   return {};
    // }
    // return {
    //   onMouseenter: handleMouseenter,
    //   onMouseleave: () => handleMouseleave(deep),
    // };
  }, []);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (disabled || getCollapse) return;
      if (getAccordion) {
        rootMenuEmitter.emit('on-update-opened', {
          opend: false,
          parentPath: parentPathList[parentPathList.length - 1],
          parentPathList,
        });
      } else {
        rootMenuEmitter.emit('open-name-change', {
          name: path,
          opened: !opened,
        });
      }
      setOpened(!opened);
    },
    [disabled, getAccordion, getCollapse, opened, parentPathList, path, rootMenuEmitter],
  );

  useMount(() => {
    // saveMenuContext({
    //   handleMouseleave,
    // });
    rootMenuEmitter.on(
      'on-update-opened',
      (data: boolean | Array<string | number> | Recordable) => {
        if (getCollapse) return;
        if (isBoolean(data)) {
          setOpened(data);
          return;
        }
        if (isObject(data) && rootProps.accordion) {
          const { opend, parentPath, parentPathList: parentPaths } = data as Recordable;
          if (parentPath === parentPathList[parentPathList.length - 1]) {
            setOpened(opend);
          } else if (!parentPaths.includes(path)) {
            setOpened(false);
          }
          return;
        }

        if (path && Array.isArray(data)) {
          setOpened((data as Array<string | number>).includes(path));
        }
      },
    );

    rootMenuEmitter.on('on-update-active-name:submenu', (data: string[]) => {
      setActive(data.includes(path));
    });
  });

  const handleVisibleChange = (visible: boolean) => {
    setOpened(visible);
  };

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
    <li className={getClass}>
      {getCollapse ? (
        <Popover
          placement="right"
          overlayClassName={`${prefixCls}-menu-popover`}
          visible={getIsOpend}
          onVisibleChange={handleVisibleChange}
          overlayStyle={getOverlayStyle}
          align={{ offset: [0, 0] }}
          content={
            opened ? (
              <div {...getEvents(true)}>
                <ul
                  className={classNames(
                    prefixCls,
                    `${prefixCls}-${getTheme}`,
                    `${prefixCls}-popup`,
                  )}
                >
                  {children}
                </ul>
              </div>
            ) : null
          }
        >
          <div className={getSubClass} {...getEvents(false)}>
            <div
              className={classNames({
                [`${prefixCls}-submenu-popup`]: !parentPathList.length,
                [`${prefixCls}-submenu-collapsed-show-tit`]: collapsedShowTitle,
              })}
            >
              {title}
            </div>
            <Icon
              v-if="getParentSubMenu"
              icon="eva:arrow-ios-downward-outline"
              size={14}
              className={`${prefixCls}-submenu-title-icon`}
            />
          </div>
        </Popover>
      ) : (
        <>
          <div className={`${prefixCls}-submenu-title`} onClick={handleClick} style={getItemStyle}>
            {title}
            <Icon
              icon="eva:arrow-ios-downward-outline"
              size={14}
              className={`${prefixCls}-submenu-title-icon`}
            />
          </div>
          <CollapseTransition>
            {opened ? <ul className="prefixCls">{children}</ul> : null}
          </CollapseTransition>
        </>
      )}
    </li>
  );
};

export default SubMenuItem;
