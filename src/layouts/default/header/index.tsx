import React from 'react';
import { actions, useStoreState } from '/@/store';
import { propTypes } from '/@/utils/propTypes';

import { Layout } from 'antd';
import { load } from '/@/router/constant';
import classNames from 'classnames';
import { AppLogo } from '/@/components/Application';
import LayoutMenu from '../menu';

import LayoutTrigger from '../trigger';

import { AppSearch } from '/@/components/Application';

import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';

import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
import { SettingButtonPositionEnum } from '/@/enums/appEnum';
import { AppLocalePicker } from '/@/components/Application';

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
  const {
    getShowTopMenu,
    getShowHeaderTrigger,
    getSplit,
    getIsMixMode,
    getMenuWidth,
    getIsMixSidebar,
  } = useMenuSetting();
  const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } = useRootSetting();

  const {
    getHeaderTheme,
    getShowFullScreen,
    getShowNotice,
    getShowContent,
    getShowBread,
    getShowHeaderLogo,
    getShowHeader,
    getShowSearch,
  } = useHeaderSetting();

  const { getIsMobile } = useAppInject();

  const getHeaderClass = () => {
    const theme = getHeaderTheme();
    return classNames(prefixCls, {
      [`${prefixCls}--fixed`]: props.fixed,
      [`${prefixCls}--mobile`]: getIsMobile(),
      [`${prefixCls}--${theme}`]: theme,
    });
  };

  const getShowSetting = () => {
    if (!getShowSettingButton()) {
      return false;
    }
    const settingButtonPosition = getSettingButtonPosition();

    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return getShowHeader();
    }
    return settingButtonPosition === SettingButtonPositionEnum.HEADER;
  };

  const getLogoWidth = () => {
    if (!getIsMixMode() || getIsMobile()) {
      return {};
    }
    const width = getMenuWidth() < 180 ? 180 : getMenuWidth();
    return { width: `${width}px` };
  };

  const getSplitType = () => {
    return getSplit() ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
  };

  const getMenuMode = () => {
    return getSplit() ? MenuModeEnum.HORIZONTAL : null;
  };

  return (
    <Header className={getHeaderClass()}>
      {/* left start */}
      <div className={`${prefixCls}-left`}>
        {/* logo */}
        {getShowHeaderLogo() || getIsMobile() ? (
          <AppLogo
            className={`${prefixCls}-logo`}
            theme={getHeaderTheme()}
            style={getLogoWidth()}
          />
        ) : null}
        {(getShowContent() && getShowHeaderTrigger() && !getSplit() && !getIsMixSidebar()) ||
        getIsMobile() ? (
          <LayoutTrigger theme={getHeaderTheme()} sider={false} />
        ) : null}
        {getShowContent() && getShowBread() ? <LayoutBreadcrumb theme={getHeaderTheme()} /> : null}
      </div>
      {/* left end */}

      {/* menu start */}
      {getShowTopMenu() && !getIsMobile() ? (
        <div className={`${prefixCls}-menu`}>
          <LayoutMenu
            isHorizontal
            theme={getHeaderTheme()}
            splitType={getSplitType()}
            menuMode={getMenuMode()}
          />
        </div>
      ) : null}

      {/* menu-end */}

      {/* action */}
      <div className={`${prefixCls}-action`}>
        {getShowSearch() ? <AppSearch className={`${prefixCls}-action__item `} /> : null}
        {getUseErrorHandle() ? (
          <ErrorAction className={`${prefixCls}-action__item error-action`} />
        ) : null}
        {getShowNotice() ? <Notify className={`${prefixCls}-action__item notify-item`} /> : null}
        {getShowFullScreen() ? (
          <FullScreen className={`${prefixCls}-action__item fullscreen-item`} />
        ) : null}
        {/* {getShowLocalePicker() ? (
          <AppLocalePicker reload showText={false} className={`${prefixCls}-action__item`} />
        ) : null} */}

        <UserDropDown theme={getHeaderTheme()} />
        {getShowSetting() ? <SettingDrawer className={`${prefixCls}-action__item`} /> : null}
      </div>
    </Header>
  );
};

export default LayoutHeader;
