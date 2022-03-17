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
          title="分割菜单"
          event={HandlerEnum.MENU_SPLIT}
          def={split}
          disabled={!getShowMenuRef() || menuType !== MenuTypeEnum.MIX}
        />
        <SwitchItem
          title="固定展开菜单"
          event={HandlerEnum.MENU_FIXED_MIX_SIDEBAR}
          def={mixSideFixed}
          disabled={!isMixSidebar}
        />

        <SwitchItem
          title="切换页面关闭菜单"
          event={HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE}
          def={closeMixSidebarOnChange}
          disabled={!isMixSidebar}
        />
        <SwitchItem
          title="折叠菜单"
          event={HandlerEnum.MENU_COLLAPSED}
          def={collapsed}
          disabled={!getShowMenuRef()}
        />

        <SwitchItem
          title="侧边菜单拖拽"
          event={HandlerEnum.MENU_HAS_DRAG}
          def={canDrag}
          disabled={!getShowMenuRef()}
        />
        <SwitchItem
          title="菜单搜索"
          event={HandlerEnum.HEADER_SEARCH}
          def={showSearch}
          disabled={!showHeader}
        />
        <SwitchItem
          title="侧边菜单手风琴模式"
          event={HandlerEnum.MENU_ACCORDION}
          def={accordion}
          disabled={!getShowMenuRef()}
        />

        <SwitchItem
          title="折叠菜单显示名称"
          event={HandlerEnum.MENU_COLLAPSED_SHOW_TITLE}
          def={collapsedShowTitle}
          disabled={!getShowMenuRef() || !collapsed || isMixSidebar}
        />

        <SwitchItem
          title="固定header"
          event={HandlerEnum.HEADER_FIXED}
          def={headerFixed}
          disabled={!showHeader}
        />
        <SwitchItem
          title="固定Sidebar"
          event={HandlerEnum.MENU_FIXED}
          def={menuFixed}
          disabled={!getShowMenuRef() || isMixSidebar}
        />
        <SelectItem
          title="混合菜单触发方式"
          event={HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR}
          def={mixSideTrigger}
          options={mixSidebarTriggerOptions}
          disabled={!isMixSidebar}
        />
        <SelectItem
          title="顶部菜单布局"
          event={HandlerEnum.MENU_TOP_ALIGN}
          def={topMenuAlign}
          options={topMenuAlignOptions}
          disabled={!showHeader || split || (!isTopMenu && !split) || isMixSidebar}
        />
        <SelectItem
          title="菜单折叠按钮"
          event={HandlerEnum.MENU_TRIGGER}
          def={triggerDef}
          options={triggerOptions}
          disabled={!getShowMenuRef() || isMixSidebar}
        />
        <SelectItem
          title="内容区域宽度"
          event={HandlerEnum.CONTENT_MODE}
          def={contentMode}
          options={contentModeOptions}
        />
        <InputNumberItem
          title="自动锁屏"
          min={0}
          event={HandlerEnum.LOCK_TIME}
          defaultValue={lockTime}
          formatter={(value: string) => {
            return parseInt(value, 10) === 0 ? `0(不自动锁屏)` : `${value}分钟`;
          }}
        />
        <InputNumberItem
          title="菜单展开宽度"
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
          title="面包屑"
          event={HandlerEnum.SHOW_BREADCRUMB}
          def={showBreadCrumb}
          disabled={!showHeader}
        />

        <SwitchItem
          title="面包屑图标"
          event={HandlerEnum.SHOW_BREADCRUMB_ICON}
          def={showBreadCrumbIcon}
          disabled={!showHeader}
        />

        <SwitchItem title="标签页" event={HandlerEnum.TABS_SHOW} def={showMultipleTab} />

        <SwitchItem
          title="标签页刷新按钮"
          event={HandlerEnum.TABS_SHOW_REDO}
          def={showRedo}
          disabled={!showMultipleTab}
        />

        <SwitchItem
          title="标签页快捷按钮"
          event={HandlerEnum.TABS_SHOW_QUICK}
          def={showQuick}
          disabled={!showMultipleTab}
        />
        <SwitchItem
          title="标签页折叠按钮"
          event={HandlerEnum.TABS_SHOW_FOLD}
          def={showFold}
          disabled={!showMultipleTab}
        />

        <SwitchItem
          title="左侧菜单"
          event={HandlerEnum.MENU_SHOW_SIDEBAR}
          def={showMenu}
          disabled={isHorizontal}
        />

        <SwitchItem title="顶栏" event={HandlerEnum.HEADER_SHOW} def={showHeader} />
        <SwitchItem
          title="Logo"
          event={HandlerEnum.SHOW_LOGO}
          def={showLogo}
          disabled={isMixSidebar}
        />
        <SwitchItem title="页脚" event={HandlerEnum.SHOW_FOOTER} def={showFooter} />
        <SwitchItem title="全屏内容" event={HandlerEnum.FULL_CONTENT} def={fullContent} />

        <SwitchItem title="灰色模式" event={HandlerEnum.GRAY_MODE} def={grayMode} />

        <SwitchItem title="色弱模式" event={HandlerEnum.COLOR_WEAK} def={colorWeak} />
      </>
    );
  }

  function renderTransition() {
    return (
      <>
        <SwitchItem title="顶部进度条" event={HandlerEnum.OPEN_PROGRESS} def={openNProgress} />
        <SwitchItem
          title="切换loading"
          event={HandlerEnum.OPEN_PAGE_LOADING}
          def={openPageLoading}
        />

        <SwitchItem
          title="切换动画"
          event={HandlerEnum.OPEN_ROUTE_TRANSITION}
          def={enableTransition}
        />

        <SelectItem
          title="动画类型"
          event={HandlerEnum.ROUTER_TRANSITION}
          def={basicTransition}
          options={routerTransitionOptions}
          disabled={!enableTransition}
        />
      </>
    );
  }

  return (
    <BasicDrawer {...props} title="项目配置" width={330} className="setting-drawer">
      {showDarkModeToggle && <Divider>主题</Divider>}
      {showDarkModeToggle && <AppDarkModeToggle className="mx-auto" />}
      <Divider>导航栏模式</Divider>
      {renderSidebar()}
      <Divider>系统主题</Divider>
      {renderMainTheme()}
      <Divider>顶栏主题</Divider>
      {renderHeaderTheme()}
      <Divider>菜单主题</Divider>
      {renderSiderTheme()}
      <Divider>界面功能</Divider>
      {renderFeatures()}
      <Divider>界面显示</Divider>
      {renderContent()}
      <Divider>动画</Divider>
      {renderTransition()}
      <Divider />
      <SettingFooter />
    </BasicDrawer>
  );
};

export default SettingDrawer;
