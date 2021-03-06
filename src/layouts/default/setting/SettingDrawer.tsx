import React from 'react';
import { BasicDrawer } from '/@/components/Drawer/index';
import { Divider } from 'antd';
import {
  TypePicker,
  ThemeColorPicker,
  SettingFooter,
  SwitchItem,
  SelectItem,
  InputNumberItem,
} from './components';

import { AppDarkModeToggle } from '/@/components/Application';

import { MenuTypeEnum, TriggerEnum } from '/@/enums/menuEnum';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';

import { baseHandler } from './handler';

import {
  HandlerEnum,
  contentModeOptions,
  topMenuAlignOptions,
  getMenuTriggerOptions,
  routerTransitionOptions,
  menuTypeList,
  mixSidebarTriggerOptions,
} from './enum';

import type { DrawerInstance } from '/@/components/Drawer/src/typing';

import {
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
  APP_PRESET_COLOR_LIST,
} from '/@/settings/designSetting';

interface SettingDrawerProp {
  onRegister: (drawerInstance: DrawerInstance) => void;
}

const SettingDrawer: React.FC<SettingDrawerProp> = (props) => {
  const {
    contentMode,
    showFooter,
    showBreadCrumb,
    showBreadCrumbIcon,
    showLogo,
    fullContent,
    colorWeak,
    grayMode,
    lockTime,
    showDarkModeToggle,
    themeColor,
  } = useRootSetting();

  const { openPageLoading, basicTransition, enableTransition, openNProgress } =
    useTransitionSetting();

  const {
    isHorizontal,
    showMenu,
    menuType,
    trigger,
    collapsedShowTitle,
    menuFixed,
    collapsed,
    canDrag,
    topMenuAlign,
    accordion,
    menuWidth,
    menuBgColor,
    isTopMenu,
    split,
    isMixSidebar,
    closeMixSidebarOnChange,
    mixSideTrigger,
    mixSideFixed,
  } = useMenuSetting();

  const { showHeader, fixed: headerFixed, headerBgColor, showSearch } = useHeaderSetting();

  const { showMultipleTab, showQuick, showRedo, showFold } = useMultipleTabSetting();

  const getShowMenuRef = () => {
    return showMenu && !isHorizontal;
  };

  function renderSidebar() {
    return (
      <>
        <TypePicker
          menuTypeList={menuTypeList}
          handler={(item: typeof menuTypeList[0]) => {
            baseHandler(HandlerEnum.CHANGE_LAYOUT, {
              mode: item.mode,
              type: item.type,
              split: isHorizontal ? false : undefined,
            });
          }}
          def={menuType}
        />
      </>
    );
  }

  function renderHeaderTheme() {
    return (
      <ThemeColorPicker
        colorList={HEADER_PRESET_BG_COLOR_LIST}
        def={headerBgColor}
        event={HandlerEnum.HEADER_THEME}
      />
    );
  }

  function renderSiderTheme() {
    return (
      <ThemeColorPicker
        colorList={SIDE_BAR_BG_COLOR_LIST}
        def={menuBgColor}
        event={HandlerEnum.MENU_THEME}
      />
    );
  }

  function renderMainTheme() {
    return (
      <ThemeColorPicker
        colorList={APP_PRESET_COLOR_LIST}
        def={themeColor}
        event={HandlerEnum.CHANGE_THEME_COLOR}
      />
    );
  }

  /**
   * @description:
   */
  function renderFeatures() {
    let triggerDef = trigger;

    const triggerOptions = getMenuTriggerOptions(split);
    const some = triggerOptions.some((item) => item.value === triggerDef);
    if (!some) {
      triggerDef = TriggerEnum.FOOTER;
    }

    return (
      <>
        <SwitchItem
          title="????????????"
          event={HandlerEnum.MENU_SPLIT}
          def={split}
          disabled={!getShowMenuRef() || menuType !== MenuTypeEnum.MIX}
        />
        <SwitchItem
          title="??????????????????"
          event={HandlerEnum.MENU_FIXED_MIX_SIDEBAR}
          def={mixSideFixed}
          disabled={!isMixSidebar}
        />

        <SwitchItem
          title="????????????????????????"
          event={HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE}
          def={closeMixSidebarOnChange}
          disabled={!isMixSidebar}
        />
        <SwitchItem
          title="????????????"
          event={HandlerEnum.MENU_COLLAPSED}
          def={collapsed}
          disabled={!getShowMenuRef()}
        />

        <SwitchItem
          title="??????????????????"
          event={HandlerEnum.MENU_HAS_DRAG}
          def={canDrag}
          disabled={!getShowMenuRef()}
        />
        <SwitchItem
          title="????????????"
          event={HandlerEnum.HEADER_SEARCH}
          def={showSearch}
          disabled={!showHeader}
        />
        <SwitchItem
          title="???????????????????????????"
          event={HandlerEnum.MENU_ACCORDION}
          def={accordion}
          disabled={!getShowMenuRef()}
        />

        <SwitchItem
          title="????????????????????????"
          event={HandlerEnum.MENU_COLLAPSED_SHOW_TITLE}
          def={collapsedShowTitle}
          disabled={!getShowMenuRef() || !collapsed || isMixSidebar}
        />

        <SwitchItem
          title="??????header"
          event={HandlerEnum.HEADER_FIXED}
          def={headerFixed}
          disabled={!showHeader}
        />
        <SwitchItem
          title="??????Sidebar"
          event={HandlerEnum.MENU_FIXED}
          def={menuFixed}
          disabled={!getShowMenuRef() || isMixSidebar}
        />
        <SelectItem
          title="????????????????????????"
          event={HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR}
          def={mixSideTrigger}
          options={mixSidebarTriggerOptions}
          disabled={!isMixSidebar}
        />
        <SelectItem
          title="??????????????????"
          event={HandlerEnum.MENU_TOP_ALIGN}
          def={topMenuAlign}
          options={topMenuAlignOptions}
          disabled={!showHeader || split || (!isTopMenu && !split) || isMixSidebar}
        />
        <SelectItem
          title="??????????????????"
          event={HandlerEnum.MENU_TRIGGER}
          def={triggerDef}
          options={triggerOptions}
          disabled={!getShowMenuRef() || isMixSidebar}
        />
        <SelectItem
          title="??????????????????"
          event={HandlerEnum.CONTENT_MODE}
          def={contentMode}
          options={contentModeOptions}
        />
        <InputNumberItem
          title="????????????"
          min={0}
          event={HandlerEnum.LOCK_TIME}
          defaultValue={lockTime}
          formatter={(value: string) => {
            return parseInt(value, 10) === 0 ? `0(???????????????)` : `${value}??????`;
          }}
        />
        <InputNumberItem
          title="??????????????????"
          max={600}
          min={100}
          step={10}
          event={HandlerEnum.MENU_WIDTH}
          disabled={!getShowMenuRef()}
          defaultValue={menuWidth}
          formatter={(value: string) => `${parseInt(value, 10)}px`}
        />
      </>
    );
  }

  function renderContent() {
    return (
      <>
        <SwitchItem
          title="?????????"
          event={HandlerEnum.SHOW_BREADCRUMB}
          def={showBreadCrumb}
          disabled={!showHeader}
        />

        <SwitchItem
          title="???????????????"
          event={HandlerEnum.SHOW_BREADCRUMB_ICON}
          def={showBreadCrumbIcon}
          disabled={!showHeader}
        />

        <SwitchItem title="?????????" event={HandlerEnum.TABS_SHOW} def={showMultipleTab} />

        <SwitchItem
          title="?????????????????????"
          event={HandlerEnum.TABS_SHOW_REDO}
          def={showRedo}
          disabled={!showMultipleTab}
        />

        <SwitchItem
          title="?????????????????????"
          event={HandlerEnum.TABS_SHOW_QUICK}
          def={showQuick}
          disabled={!showMultipleTab}
        />
        <SwitchItem
          title="?????????????????????"
          event={HandlerEnum.TABS_SHOW_FOLD}
          def={showFold}
          disabled={!showMultipleTab}
        />

        <SwitchItem
          title="????????????"
          event={HandlerEnum.MENU_SHOW_SIDEBAR}
          def={showMenu}
          disabled={isHorizontal}
        />

        <SwitchItem title="??????" event={HandlerEnum.HEADER_SHOW} def={showHeader} />
        <SwitchItem
          title="Logo"
          event={HandlerEnum.SHOW_LOGO}
          def={showLogo}
          disabled={isMixSidebar}
        />
        <SwitchItem title="??????" event={HandlerEnum.SHOW_FOOTER} def={showFooter} />
        <SwitchItem title="????????????" event={HandlerEnum.FULL_CONTENT} def={fullContent} />

        <SwitchItem title="????????????" event={HandlerEnum.GRAY_MODE} def={grayMode} />

        <SwitchItem title="????????????" event={HandlerEnum.COLOR_WEAK} def={colorWeak} />
      </>
    );
  }

  function renderTransition() {
    return (
      <>
        <SwitchItem title="???????????????" event={HandlerEnum.OPEN_PROGRESS} def={openNProgress} />
        <SwitchItem
          title="??????loading"
          event={HandlerEnum.OPEN_PAGE_LOADING}
          def={openPageLoading}
        />

        <SwitchItem
          title="????????????"
          event={HandlerEnum.OPEN_ROUTE_TRANSITION}
          def={enableTransition}
        />

        <SelectItem
          title="????????????"
          event={HandlerEnum.ROUTER_TRANSITION}
          def={basicTransition}
          options={routerTransitionOptions}
          disabled={!enableTransition}
        />
      </>
    );
  }

  return (
    <BasicDrawer {...props} title="????????????" width={330} className="setting-drawer">
      {showDarkModeToggle && <Divider>??????</Divider>}
      {showDarkModeToggle && <AppDarkModeToggle className="mx-auto" />}
      <Divider>???????????????</Divider>
      {renderSidebar()}
      <Divider>????????????</Divider>
      {renderMainTheme()}
      <Divider>????????????</Divider>
      {renderHeaderTheme()}
      <Divider>????????????</Divider>
      {renderSiderTheme()}
      <Divider>????????????</Divider>
      {renderFeatures()}
      <Divider>????????????</Divider>
      {renderContent()}
      <Divider>??????</Divider>
      {renderTransition()}
      <Divider />
      <SettingFooter />
    </BasicDrawer>
  );
};

export default SettingDrawer;
