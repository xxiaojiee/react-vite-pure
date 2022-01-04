import type { MenuSetting } from '/#/config';
import { useDispatch } from 'react-redux'
import { useStoreState, actions } from '/@/store';
import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '/@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum, TriggerEnum } from '/@/enums/menuEnum';

import { useFullContent } from '/@/hooks/web/useFullContent';

const mixSideHasChildren = false;
const appActions = actions.app;

export function useMenuSetting() {
  const { getFullContent: fullContent } = useFullContent();
  const dispatch = useDispatch();
  const appState = useStoreState('app');

  const getCollapsed = () => appState.projectConfig?.menuSetting.collapsed;

  const getMenuType = () => appState.projectConfig?.menuSetting.type;

  const getMenuMode = () => appState.projectConfig?.menuSetting.mode;

  const getMenuFixed = () => appState.projectConfig?.menuSetting.fixed;

  const getShowMenu = () => appState.projectConfig?.menuSetting.show;

  const getMenuHidden = () => appState.projectConfig?.menuSetting.hidden;

  const getMenuWidth = () => appState.projectConfig?.menuSetting.menuWidth;

  const getTrigger = () => appState.projectConfig?.menuSetting.trigger;

  const getMenuTheme = () => appState.projectConfig?.menuSetting.theme;

  const getSplit = () => appState.projectConfig?.menuSetting.split;

  const getMenuBgColor = () => appState.projectConfig?.menuSetting.bgColor;

  const getMixSideTrigger = () => appState.projectConfig?.menuSetting.mixSideTrigger;

  const getCanDrag = () => appState.projectConfig?.menuSetting.canDrag;

  const getAccordion = () => appState.projectConfig?.menuSetting.accordion;

  const getMixSideFixed = () => appState.projectConfig?.menuSetting.mixSideFixed;

  const getTopMenuAlign = () => appState.projectConfig?.menuSetting.topMenuAlign;

  const getCloseMixSidebarOnChange = () => appState.projectConfig?.menuSetting.closeMixSidebarOnChange;

  const getIsSidebarType = () => getMenuType() === MenuTypeEnum.SIDEBAR;

  const getIsTopMenu = () => getMenuType() === MenuTypeEnum.TOP_MENU;

  const getCollapsedShowTitle = () => appState.projectConfig?.menuSetting.collapsedShowTitle;

  const getShowTopMenu = () => getMenuMode() === MenuModeEnum.HORIZONTAL || getSplit();

  const getShowSidebar = () => {
    return (
      getSplit() ||
      (getShowMenu() && getMenuMode() !== MenuModeEnum.HORIZONTAL && !fullContent())
    );
  };


  const getShowHeaderTrigger = () => {
    if (
      getMenuType() === MenuTypeEnum.TOP_MENU ||
      !getShowMenu() ||
      getMenuHidden()
    ) {
      return false;
    }

    return getTrigger() === TriggerEnum.HEADER;
  };

  const getIsHorizontal = () => {
    return getMenuMode() === MenuModeEnum.HORIZONTAL;
  };

  const getIsMixSidebar = () => {
    return getMenuType() === MenuTypeEnum.MIX_SIDEBAR;
  };

  const getIsMixMode = () => {
    return getMenuMode() === MenuModeEnum.INLINE && getMenuType() === MenuTypeEnum.MIX;
  };

  const getRealWidth = () => {
    if (getIsMixSidebar()) {
      return getCollapsed() && !getMixSideFixed()
        ? getMiniWidthNumber()
        : getMenuWidth();
    }
    return getCollapsed() ? getMiniWidthNumber() : getMenuWidth();
  };

  const getMiniWidthNumber = () => {
    const { collapsedShowTitle } = appState.projectConfig?.menuSetting;
    return collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH;
  };

  const getCalcContentWidth = () => {
    const width =
      getIsTopMenu() || !getShowMenu() || (getSplit() && getMenuHidden())
        ? 0
        : getIsMixSidebar()
          ? (getCollapsed() ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH) +
          (getMixSideFixed() && mixSideHasChildren ? getRealWidth() : 0)
          : getRealWidth();

    return `calc(100% - ${width}px)`;
  };

  // Set menu configuration
  function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
    dispatch(appActions.setProjectConfig({ menuSetting }));
  }

  function toggleCollapsed() {
    setMenuSetting({
      collapsed: !getCollapsed(),
    });
  }
  return {
    setMenuSetting,

    toggleCollapsed,

    getMenuFixed,
    getRealWidth,
    getMenuType,
    getMenuMode,
    getShowMenu,
    getCollapsed,
    getMiniWidthNumber,
    getCalcContentWidth,
    getMenuWidth,
    getTrigger,
    getSplit,
    getMenuTheme,
    getCanDrag,
    getCollapsedShowTitle,
    getIsHorizontal,
    getIsSidebarType,
    getAccordion,
    getShowTopMenu,
    getShowHeaderTrigger,
    getTopMenuAlign,
    getMenuHidden,
    getIsTopMenu,
    getMenuBgColor,
    getShowSidebar,
    getIsMixMode,
    getIsMixSidebar,
    getCloseMixSidebarOnChange,
    getMixSideTrigger,
    getMixSideFixed,
    mixSideHasChildren,
  };
}
