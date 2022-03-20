import React, { useRef, useState, useMemo, useCallback, useEffect, CSSProperties } from 'react';
import classNames from 'classnames';
import LayoutTrigger from '../../trigger';
import { ScrollContainer } from '/@/components/Container';
import { SimpleMenu, SimpleMenuTag } from '/@/components/SimpleMenu';
import { Icon } from '/@/components/Icon';
import { useHistory } from 'react-router-dom';
import { useMount, useClickAway } from 'ahooks';
import { AppLogo } from '/@/components/Application';
import { useStoreState } from '/@/store';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useDragLine } from '../useLayoutSider';
import { getGlobSetting } from '/@/hooks/setting';
import { useAppContainer } from '/@/hooks/core/useAppContext';
import { useDesign } from '/@/hooks/web/useDesign';
import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '/@/enums/appEnum';
import { useChildrenMenus, useCurrentParentPath, useShallowMenus } from '/@/router/menus';

import type { Menu } from '/@/router/types';

import './index.less';
// interface MixSiderProp {
//   className?: string;
// }

const MixSider: React.FC = () => {
  // const { className } = props;
  const { push } = useHistory();
  const shallowMenuList = useShallowMenus();
  const getChildrenMenus = useChildrenMenus();
  const outsideRef = useRef<HTMLDivElement>(null);
  const getCurrentParentPath = useCurrentParentPath();
  const permissionState = useStoreState('permission');
  const [menuModules, setMenuModules] = useState<Menu[]>([]);
  const [activePath, setActivePath] = useState('');
  const [childrenMenus, setChildrenMenus] = useState<Menu[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const dragBarRef = useRef<ElRef>(null);
  const sideRef = useRef<ElRef>(null);

  const { route: currentRoute } = useAppContainer();

  const { prefixCls } = useDesign('layout-mix-sider');

  const {
    menuWidth,
    canDrag,
    closeMixSidebarOnChange,
    menuTheme,
    mixSideTrigger,
    realWidth,
    mixSideFixed,
    mixSideHasChildren,
    setMenuSetting,
    isMixSidebar,
    collapsed,
  } = useMenuSetting();

  const { title } = getGlobSetting();

  useDragLine(sideRef, dragBarRef, true);

  const mixSideWidth: number = collapsed ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH;

  const menuStyle = {
    width: openMenu ? `${menuWidth}px` : 0,
    left: `${mixSideWidth}px`,
  };

  const isFixed = useMemo(() => {
    mixSideHasChildren.current = childrenMenus.length > 0;
    const newIsFixed = mixSideFixed && mixSideHasChildren.current;
    if (newIsFixed) {
      setOpenMenu(true);
    }
    return isFixed;
  }, [childrenMenus.length, mixSideFixed, mixSideHasChildren]);

  const domStyle = useMemo((): CSSProperties => {
    const fixedWidth: number = isFixed ? realWidth : 0;
    const width = `${mixSideWidth + fixedWidth}px`;
    return getWrapCommonStyle(width);
  }, [isFixed, mixSideWidth, realWidth]);

  const wrapStyle = useMemo((): CSSProperties => {
    const width = `${mixSideWidth}px`;
    return getWrapCommonStyle(width);
  }, [mixSideWidth]);

  const menuEvents = !mixSideFixed
    ? {
        onMouseleave: () => {
          setActive(true);
          closeMenu();
        },
      }
    : {};

  useMount(async () => {
    setMenuModules(shallowMenuList);
  });

  useEffect(() => {
    setMenuModules(shallowMenuList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionState.lastBuildMenuTime, permissionState.backMenuList]);

  useEffect(() => {
    setActive(true);
    if (closeMixSidebarOnChange) {
      closeMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoute.path]);

  function getWrapCommonStyle(width: string): CSSProperties {
    return {
      width,
      maxWidth: width,
      minWidth: width,
      flex: `0 0 ${width}`,
    };
  }

  // Close menu
  const closeMenu = useCallback(() => {
    if (!isFixed) {
      setOpenMenu(false);
    }
  }, [isFixed]);
  // Set the currently active menu and submenu
  const setActive = useCallback(
    (setChildren = false) => {
      const path = currentRoute?.path;
      if (!path) return;
      const newActivePath = getCurrentParentPath(path);
      setActivePath(newActivePath);
      // hanldeModuleClick(parentPath);
      if (isMixSidebar) {
        const activeMenu = menuModules.find((item) => item.path === activePath);
        const p = activeMenu?.path;
        if (p) {
          const children = getChildrenMenus(p);
          if (setChildren) {
            setChildrenMenus(children);
            if (mixSideFixed) {
              setOpenMenu(children.length > 0);
            }
          }
          if (children.length === 0) {
            setChildrenMenus([]);
          }
        }
      }
    },
    [
      activePath,
      currentRoute?.path,
      getChildrenMenus,
      getCurrentParentPath,
      isMixSidebar,
      menuModules,
      mixSideFixed,
    ],
  );

  // Process module menu click
  const handleModuleClick = useCallback(
    (path: string, hover = false) => {
      const children = getChildrenMenus(path);
      if (activePath === path) {
        if (!hover) {
          if (!openMenu) {
            setOpenMenu(true);
          } else {
            closeMenu();
          }
        } else if (!openMenu) {
          setOpenMenu(true);
        }
        if (!openMenu) {
          setActive();
        }
      } else {
        setOpenMenu(true);
        setActivePath(path);
      }

      if (!children || children.length === 0) {
        if (!hover) push(path);
        setChildrenMenus([]);
        closeMenu();
        return;
      }
      setChildrenMenus(children);
    },
    [activePath, closeMenu, getChildrenMenus, openMenu, push, setActive],
  );

  const handleMenuClick = (path: string) => {
    push(path);
  };

  const handleClickOutside = useCallback(() => {
    setActive(true);
    closeMenu();
  }, [closeMenu, setActive]);

  const getItemEvents = (item: Menu) => {
    if (mixSideTrigger === 'hover') {
      return {
        onMouseenter: () => handleModuleClick(item.path, true),
        onClick: () => {
          const children = getChildrenMenus(item.path);
          if (item.path && (!children || children.length === 0)) push(item.path);
        },
      };
    }
    return {
      onClick: () => handleModuleClick(item.path),
    };
  };

  const handleFixedMenu = useCallback(() => {
    setMenuSetting({
      mixSideFixed: !isFixed,
    });
  }, [isFixed, setMenuSetting]);
  useClickAway(() => {
    handleClickOutside();
  }, outsideRef);
  return (
    <>
      <div className={`${prefixCls}-dom`} style={domStyle} />
      <div
        ref={outsideRef}
        style={wrapStyle}
        className={classNames(prefixCls, menuTheme, {
          open: openMenu,
          mini: collapsed,
        })}
        {...menuEvents}
      >
        <AppLogo showTitle={false} className={`${prefixCls}-logo`} />

        <LayoutTrigger className={`${prefixCls}-trigger`} />

        <ScrollContainer>
          <ul className={`${prefixCls}-module`}>
            {menuModules.map((item) => (
              <li
                className={classNames(`${prefixCls}-module__item `, {
                  [`${prefixCls}-module__item--active`]: item.path === activePath,
                })}
                {...getItemEvents}
                key={item.path}
              >
                <SimpleMenuTag item={item} collapseParent dot />
                <Icon
                  className={`${prefixCls}-module__icon`}
                  size={collapsed ? 16 : 20}
                  icon={(item.icon || (item.meta && item.meta.icon)) as string}
                />
                <p className={`${prefixCls}-module__name`}>{item.name}</p>
              </li>
            ))}
          </ul>
        </ScrollContainer>

        <div className={`${prefixCls}-menu-list`} ref={sideRef} style={menuStyle}>
          <div
            v-show="openMenu"
            className={classNames(`${prefixCls}-menu-list__title`, {
              show: openMenu,
            })}
          >
            <span className="text"> {{ title }}</span>
            <Icon
              size="16"
              icon={mixSideFixed ? 'ri:pushpin-2-fill' : 'ri:pushpin-2-line'}
              className="pushpin"
              onClick={handleFixedMenu}
            />
          </div>
          <ScrollContainer className={`${prefixCls}-menu-list__content`}>
            <SimpleMenu
              items={childrenMenus}
              theme={menuTheme}
              mixSider
              onMenuClick={handleMenuClick}
            />
          </ScrollContainer>
          {canDrag && openMenu ? (
            <div className={`${prefixCls}-drag-bar`} ref={dragBarRef} />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default MixSider;
