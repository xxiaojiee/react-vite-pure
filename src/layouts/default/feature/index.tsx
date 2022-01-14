import React from 'react';
import { BackTop } from 'antd';
import { load } from '/@/router/constant';

import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useDesign } from '/@/hooks/web/useDesign';
import { useStoreState } from '/@/store';

import { SettingButtonPositionEnum } from '/@/enums/appEnum';
import SessionTimeoutLogin from '/@/pages/sys/login/SessionTimeoutLogin';

import './index.less';

const LayoutLockPage = load(() => import('/@/pages/sys/lock'));
const SettingDrawer = load(() => import('/@/layouts/default/setting'));

const Feature: React.FC = () => {
  console.log(6666666666666);
  const { getUseOpenBackTop, getShowSettingButton, getSettingButtonPosition, getFullContent } =
    useRootSetting();
  const userState = useStoreState('user');
  const { prefixCls } = useDesign('setting-drawer-feature');
  const { getShowHeader } = useHeaderSetting();

  const getIsSessionTimeout = () => userState.sessionTimeout;

  const getIsFixedSettingDrawer = () => {
    if (!getShowSettingButton()) {
      return false;
    }
    const settingButtonPosition = getSettingButtonPosition();

    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return !getShowHeader() || getFullContent();
    }
    return settingButtonPosition === SettingButtonPositionEnum.FIXED;
  };
  return (
    <>
      <LayoutLockPage />
      {getUseOpenBackTop() ? <BackTop target={() => document.body} /> : null}
      {getIsFixedSettingDrawer() ? <SettingDrawer className={prefixCls} /> : null}
      {getIsSessionTimeout() ? <SessionTimeoutLogin /> : null}
    </>
  );
};

export default Feature;
