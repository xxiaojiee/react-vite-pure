import type { MenuSetting } from '/#/config';
import { useDispatch } from 'react-redux'
import { useStoreState, actions } from '/@/store';
import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '/@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum, TriggerEnum } from '/@/enums/menuEnum';

import { useFullContent } from '/@/hooks/web/useFullContent';
import { useMemo, useRef } from 'react';

const appActions = actions.app;

export function useMenuSetting() {
  const fullContent = useFullContent();
  const mixSideHasChildren = useRef(false);
  const dispatch = useDispatch();
  const appState = useStoreState('app');

  const collapsed = appState.projectConfig?.menuSetting.collapsed;

  const menuType = appState.projectConfig?.menuSetting.type;

  const menuMode = appState.projectConfig?.menuSetting.mode;

  const menuFixed = appState.projectConfig?.menuSetting.fixed;

  const showMenu = appState.projectConfig?.menuSetting.show;

  const menuHidden = appState.projectConfig?.menuSetting.hidden;

  const menuWidth = appState.projectConfig?.menuSetting.menuWidth;

  const trigger = appState.projectConfig?.menuSetting.trigger;

  const menuTheme = appState.projectConfig?.menuSetting.theme;

  const split = appState.projectConfig?.menuSetting.split;

  const menuBgColor = appState.projectConfig?.menuSetting.bgColor;

  const mixSideTrigger = appState.projectConfig?.menuSetting.mixSideTrigger;

  const canDrag = appState.projectConfig?.menuSetting.canDrag;

  const accordion = appState.projectConfig?.menuSetting.accordion;

  const mixSideFixed = appState.projectConfig?.menuSetting.mixSideFixed;

  const topMenuAlign = appState.projectConfig?.menuSetting.topMenuAlign;

  const closeMixSidebarOnChange = appState.projectConfig?.menuSetting.closeMixSidebarOnChange;

  const isSidebarType = menuType === MenuTypeEnum.SIDEBAR;

  const isTopMenu = menuType === MenuTypeEnum.TOP_MENU;

  const collapsedShowTitle = appState.projectConfig?.menuSetting?.collapsedShowTitle;

  const showTopMenu = menuMode === MenuModeEnum.HORIZONTAL || split;

  const showSidebar = split || (showMenu && menuMode !== MenuModeEnum.HORIZONTAL && !fullContent);


  const showHeaderTrigger = useMemo(() => {
    if (
      menuType === MenuTypeEnum.TOP_MENU ||
      !showMenu ||
      menuHidden
    ) {
      return false;
    }

    return trigger === TriggerEnum.HEADER;
  }, [menuHidden, menuType, showMenu, trigger]);

  const isHorizontal = menuMode === MenuModeEnum.HORIZONTAL;

  const isMixSidebar = menuType === MenuTypeEnum.MIX_SIDEBAR;

  const isMixMode = menuMode === MenuModeEnum.INLINE && menuType === MenuTypeEnum.MIX;

  const miniWidthNumber = appState.projectConfig?.menuSetting.collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH;

  const realWidth = useMemo(() => {
    if (isMixSidebar) {
      return collapsed && !mixSideFixed
        ? miniWidthNumber
        : menuWidth;
    }
    return collapsed ? miniWidthNumber : menuWidth;
  }, [collapsed, isMixSidebar, menuWidth, miniWidthNumber, mixSideFixed]);



  const calcContentWidth = useMemo(() => {
    let width = 0;
    if (!(isTopMenu || !showMenu || (split && menuHidden))) {
      if (isMixSidebar) {
        const d1: number = collapsed ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH;
        const d2: number = mixSideFixed && mixSideHasChildren.current ? realWidth : 0
        width = d1 + d2;
      } else {
        width = realWidth
      }
    }
    return `calc(100% - ${width}px)`;
  }, [collapsed, isMixSidebar, isTopMenu, menuHidden, mixSideFixed, realWidth, showMenu, split]);

  // Set menu configuration
  function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
    dispatch(appActions.setProjectConfig({ menuSetting }));
  }

  function toggleCollapsed() {
    setMenuSetting({
      collapsed: !collapsed,
    });
  }
  return {
    setMenuSetting,

    toggleCollapsed,

    menuFixed,
    realWidth,
    menuType,
    menuMode,
    showMenu,
    collapsed,
    miniWidthNumber,
    calcContentWidth,
    menuWidth,
    trigger,
    split,
    menuTheme,
    canDrag,
    collapsedShowTitle,
    isHorizontal,
    isSidebarType,
    accordion,
    showTopMenu,
    showHeaderTrigger,
    topMenuAlign,
    menuHidden,
    isTopMenu,
    menuBgColor,
    showSidebar,
    isMixMode,
    isMixSidebar,
    closeMixSidebarOnChange,
    mixSideTrigger,
    mixSideFixed,
    mixSideHasChildren,
  };
}
