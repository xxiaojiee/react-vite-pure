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

import {
  HEADER_PRESET_BG_COLOR_LIST,
  SIDE_BAR_BG_COLOR_LIST,
  APP_PRESET_COLOR_LIST,
} from '/@/settings/designSetting';

const SettingDrawer = (props) => {
  const {
    getContentMode,
    getShowFooter,
    getShowBreadCrumb,
    getShowBreadCrumbIcon,
    getShowLogo,
    getFullContent,
    getColorWeak,
    getGrayMode,
    getLockTime,
    getShowDarkModeToggle,
    getThemeColor,
  } = useRootSetting();

  const { getOpenPageLoading, getBasicTransition, getEnableTransition, getOpenNProgress } =
    useTransitionSetting();

  const {
    getIsHorizontal,
    getShowMenu,
    getMenuType,
    getTrigger,
    getCollapsedShowTitle,
    getMenuFixed,
    getCollapsed,
    getCanDrag,
    getTopMenuAlign,
    getAccordion,
    getMenuWidth,
    getMenuBgColor,
    getIsTopMenu,
    getSplit,
    getIsMixSidebar,
    getCloseMixSidebarOnChange,
    getMixSideTrigger,
    getMixSideFixed,
  } = useMenuSetting();

  const {
    getShowHeader,
    getFixed: getHeaderFixed,
    getHeaderBgColor,
    getShowSearch,
  } = useHeaderSetting();

  const { getShowMultipleTab, getShowQuick, getShowRedo, getShowFold } = useMultipleTabSetting();

  const getShowMenuRef = () => {
    return getShowMenu() && !getIsHorizontal();
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
              split: getIsHorizontal() ? false : undefined,
            });
          }}
          def={getMenuType()}
        />
      </>
    );
  }

  function renderHeaderTheme() {
    return (
      <ThemeColorPicker
        colorList={HEADER_PRESET_BG_COLOR_LIST}
        def={getHeaderBgColor()}
        event={HandlerEnum.HEADER_THEME}
      />
    );
  }

  function renderSiderTheme() {
    return (
      <ThemeColorPicker
        colorList={SIDE_BAR_BG_COLOR_LIST}
        def={getMenuBgColor()}
        event={HandlerEnum.MENU_THEME}
      />
    );
  }

  function renderMainTheme() {
    return (
      <ThemeColorPicker
        colorList={APP_PRESET_COLOR_LIST}
        def={getThemeColor()}
        event={HandlerEnum.CHANGE_THEME_COLOR}
      />
    );
  }

  /**
   * @description:
   */
  function renderFeatures() {
    let triggerDef = getTrigger();

    const triggerOptions = getMenuTriggerOptions(getSplit());
    const some = triggerOptions.some((item) => item.value === triggerDef);
    if (!some) {
      triggerDef = TriggerEnum.FOOTER;
    }

    return (
      <>
        <SwitchItem
          title="分割菜单"
          event={HandlerEnum.MENU_SPLIT}
          def={getSplit()}
          disabled={!getShowMenuRef() || getMenuType() !== MenuTypeEnum.MIX}
        />
        <SwitchItem
          title="固定展开菜单"
          event={HandlerEnum.MENU_FIXED_MIX_SIDEBAR}
          def={getMixSideFixed()}
          disabled={!getIsMixSidebar()}
        />

        <SwitchItem
          title="切换页面关闭菜单"
          event={HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE}
          def={getCloseMixSidebarOnChange()}
          disabled={!getIsMixSidebar()}
        />
        <SwitchItem
          title="折叠菜单"
          event={HandlerEnum.MENU_COLLAPSED}
          def={getCollapsed()}
          disabled={!getShowMenuRef()}
        />

        <SwitchItem
          title="侧边菜单拖拽"
          event={HandlerEnum.MENU_HAS_DRAG}
          def={getCanDrag()}
          disabled={!getShowMenuRef()}
        />
        <SwitchItem
          title="菜单搜索"
          event={HandlerEnum.HEADER_SEARCH}
          def={getShowSearch()}
          disabled={!getShowHeader()}
        />
        <SwitchItem
          title="侧边菜单手风琴模式"
          event={HandlerEnum.MENU_ACCORDION}
          def={getAccordion()}
          disabled={!getShowMenuRef()}
        />

        <SwitchItem
          title="折叠菜单显示名称"
          event={HandlerEnum.MENU_COLLAPSED_SHOW_TITLE}
          def={getCollapsedShowTitle()}
          disabled={!getShowMenuRef() || !getCollapsed() || getIsMixSidebar()}
        />

        <SwitchItem
          title="固定header"
          event={HandlerEnum.HEADER_FIXED}
          def={getHeaderFixed()}
          disabled={!getShowHeader()}
        />
        <SwitchItem
          title="固定Sidebar"
          event={HandlerEnum.MENU_FIXED}
          def={getMenuFixed()}
          disabled={!getShowMenuRef() || getIsMixSidebar()}
        />
        <SelectItem
          title="混合菜单触发方式"
          event={HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR}
          def={getMixSideTrigger()}
          options={mixSidebarTriggerOptions}
          disabled={!getIsMixSidebar()}
        />
        <SelectItem
          title="顶部菜单布局"
          event={HandlerEnum.MENU_TOP_ALIGN}
          def={getTopMenuAlign()}
          options={topMenuAlignOptions}
          disabled={
            !getShowHeader() || getSplit() || (!getIsTopMenu() && !getSplit()) || getIsMixSidebar()
          }
        />
        <SelectItem
          title="菜单折叠按钮"
          event={HandlerEnum.MENU_TRIGGER}
          def={triggerDef}
          options={triggerOptions}
          disabled={!getShowMenuRef() || getIsMixSidebar()}
        />
        <SelectItem
          title="内容区域宽度"
          event={HandlerEnum.CONTENT_MODE}
          def={getContentMode()}
          options={contentModeOptions}
        />
        <InputNumberItem
          title="自动锁屏"
          min={0}
          event={HandlerEnum.LOCK_TIME}
          defaultValue={getLockTime()}
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
          defaultValue={getMenuWidth()}
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
          def={getShowBreadCrumb()}
          disabled={!getShowHeader()}
        />

        <SwitchItem
          title="面包屑图标"
          event={HandlerEnum.SHOW_BREADCRUMB_ICON}
          def={getShowBreadCrumbIcon()}
          disabled={!getShowHeader()}
        />

        <SwitchItem title="标签页" event={HandlerEnum.TABS_SHOW} def={getShowMultipleTab()} />

        <SwitchItem
          title="标签页刷新按钮"
          event={HandlerEnum.TABS_SHOW_REDO}
          def={getShowRedo()}
          disabled={!getShowMultipleTab()}
        />

        <SwitchItem
          title="标签页快捷按钮"
          event={HandlerEnum.TABS_SHOW_QUICK}
          def={getShowQuick()}
          disabled={!getShowMultipleTab()}
        />
        <SwitchItem
          title="标签页折叠按钮"
          event={HandlerEnum.TABS_SHOW_FOLD}
          def={getShowFold()}
          disabled={!getShowMultipleTab()}
        />

        <SwitchItem
          title="左侧菜单"
          event={HandlerEnum.MENU_SHOW_SIDEBAR}
          def={getShowMenu()}
          disabled={getIsHorizontal()}
        />

        <SwitchItem title="顶栏" event={HandlerEnum.HEADER_SHOW} def={getShowHeader()} />
        <SwitchItem
          title="Logo"
          event={HandlerEnum.SHOW_LOGO}
          def={getShowLogo()}
          disabled={getIsMixSidebar()}
        />
        <SwitchItem title="页脚" event={HandlerEnum.SHOW_FOOTER} def={getShowFooter()} />
        <SwitchItem title="全屏内容" event={HandlerEnum.FULL_CONTENT} def={getFullContent()} />

        <SwitchItem title="灰色模式" event={HandlerEnum.GRAY_MODE} def={getGrayMode()} />

        <SwitchItem title="色弱模式" event={HandlerEnum.COLOR_WEAK} def={getColorWeak()} />
      </>
    );
  }

  function renderTransition() {
    return (
      <>
        <SwitchItem title="顶部进度条" event={HandlerEnum.OPEN_PROGRESS} def={getOpenNProgress()} />
        <SwitchItem
          title="切换loading"
          event={HandlerEnum.OPEN_PAGE_LOADING}
          def={getOpenPageLoading()}
        />

        <SwitchItem
          title="切换动画"
          event={HandlerEnum.OPEN_ROUTE_TRANSITION}
          def={getEnableTransition()}
        />

        <SelectItem
          title="动画类型"
          event={HandlerEnum.ROUTER_TRANSITION}
          def={getBasicTransition()}
          options={routerTransitionOptions}
          disabled={!getEnableTransition()}
        />
      </>
    );
  }

  return () => (
    <BasicDrawer {...props} title="项目配置" width={330} class="setting-drawer">
      {getShowDarkModeToggle() && <Divider>{() => '主题'}</Divider>}
      {getShowDarkModeToggle() && <AppDarkModeToggle className="mx-auto" />}
      <Divider>{() => '导航栏模式'}</Divider>
      {renderSidebar()}
      <Divider>{() => '系统主题'}</Divider>
      {renderMainTheme()}
      <Divider>{() => '顶栏主题'}</Divider>
      {renderHeaderTheme()}
      <Divider>{() => '菜单主题'}</Divider>
      {renderSiderTheme()}
      <Divider>{() => '界面功能'}</Divider>
      {renderFeatures()}
      <Divider>{() => '界面显示'}</Divider>
      {renderContent()}
      <Divider>{() => '动画'}</Divider>
      {renderTransition()}
      <Divider />
      <SettingFooter />
    </BasicDrawer>
  );
};

export default SettingDrawer;
