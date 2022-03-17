import React from 'react';

import { Layout } from 'antd';
import { load } from '/@/router/constant';
import classNames from 'classnames';
import LayoutMenu from '../menu';

import LayoutTrigger from '../trigger';

import { AppSearch, AppLocalePicker, AppLogo } from '/@/components/Application';

import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';

import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
import { SettingButtonPositionEnum } from '/@/enums/appEnum';

import { UserDropDown, LayoutBreadcrumb, FullScreen, Notify, ErrorAction } from './components';
import { useAppInject } from '/@/hooks/web/useAppInject';
import { useDesign } from '/@/hooks/web/useDesign';

import './index.less';

const SettingDrawer = load(() => import('/@/layouts/default/setting'), {
  loading: true,
});

const { Header } = Layout;

interface HeaderProp {
  fixed: boolean;
}

const LayoutHeader: React.FC<HeaderProp> = (props) => {
  const { prefixCls } = useDesign('layout-header');
  const { showTopMenu, showHeaderTrigger, split, isMixMode, menuWidth, isMixSidebar } =
    useMenuSetting();
  const { useErrorHandle, showSettingButton, settingButtonPosition } = useRootSetting();

  const {
    headerTheme,
    showFullScreen,
    showNotice,
    showContent,
    showBread,
    showHeaderLogo,
    showHeader,
    showSearch,
  } = useHeaderSetting();

  const { isMobile } = useAppInject();

  const getHeaderClass = () => {
    const theme = headerTheme;
    return classNames(prefixCls, {
      [`${prefixCls}--fixed`]: props.fixed,
      [`${prefixCls}--mobile`]: isMobile,
      [`${prefixCls}--${theme}`]: theme,
    });
  };

  const getShowSetting = () => {
    if (!showSettingButton) {
      return false;
    }
    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return showHeader;
    }
    return settingButtonPosition === SettingButtonPositionEnum.HEADER;
  };

  const getLogoWidth = () => {
    if (!isMixMode || isMobile) {
      return {};
    }
    const width = menuWidth < 180 ? 180 : menuWidth;
    return { width: `${width}px` };
  };

  const getSplitType = () => {
    return split ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
  };

  const getMenuMode = () => {
    return split ? MenuModeEnum.HORIZONTAL : undefined;
  };

  console.log('是否显示：', showTopMenu && !isMobile);
  return (
    <Header className={getHeaderClass()}>
      {/* left start */}
      <div className={`${prefixCls}-left`}>
        {/* logo */}
        {showHeaderLogo || isMobile ? (
          <AppLogo className={`${prefixCls}-logo`} theme={headerTheme} style={getLogoWidth()} />
        ) : null}
        {(showContent && showHeaderTrigger && !split && !isMixSidebar) || isMobile ? (
          <LayoutTrigger theme={headerTheme} sider={false} />
        ) : null}
        {showContent && showBread ? <LayoutBreadcrumb theme={headerTheme} /> : null}
      </div>
      {/* left end */}

      {/* menu start */}
      {showTopMenu && !isMobile ? (
        <div className={`${prefixCls}-menu`}>
          <LayoutMenu
            isHorizontal
            theme={headerTheme}
            splitType={getSplitType()}
            menuMode={getMenuMode()}
          />
        </div>
      ) : null}

      {/* menu-end */}

      {/* action */}
      <div className={`${prefixCls}-action`}>
        {showSearch ? <AppSearch className={`${prefixCls}-action__item `} /> : null}
        {useErrorHandle ? (
          <ErrorAction className={`${prefixCls}-action__item error-action`} />
        ) : null}
        {showNotice ? <Notify className={`${prefixCls}-action__item notify-item`} /> : null}
        {showFullScreen ? (
          <FullScreen className={`${prefixCls}-action__item fullscreen-item`} />
        ) : null}
        <AppLocalePicker reload showText={false} className={`${prefixCls}-action__item`} />
        <UserDropDown theme={headerTheme} />
        {getShowSetting() ? <SettingDrawer className={`${prefixCls}-action__item`} /> : null}
      </div>
    </Header>
  );
};

export default LayoutHeader;
