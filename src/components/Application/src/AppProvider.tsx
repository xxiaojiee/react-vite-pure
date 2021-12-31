import React from 'react';
import { AppProvider, AppContainerProp } from './useAppContext';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { prefixCls } from '/@/settings/designSetting';

interface AppProviderIndexProp {
  children: React.ReactNode;
}

const AppProviderIndex: React.FC<AppProviderIndexProp> = ({ children }) => {
  // 初始化系统内部配置
  initAppConfigStore();
  const appInitialState: AppContainerProp = {
    prefixCls,
    isMobile: false,
  };
  return <AppProvider initialState={appInitialState}>{children}</AppProvider>;
};

export default AppProviderIndex;
