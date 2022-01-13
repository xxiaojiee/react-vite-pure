import React from 'react';
import { useMount } from 'ahooks';
import { AppProvider, AppContainerProp } from './useAppContext';
import { useInitAppConfigStore } from '/@/logics/initAppConfig';
import { prefixCls } from '/@/settings/designSetting';

interface AppProviderIndexProp {
  children: React.ReactNode;
}

const AppProviderIndex: React.FC<AppProviderIndexProp> = ({ children }) => {
  const initAppConfig = useInitAppConfigStore();
  useMount(() => {
    console.log('初始化系统内部配置initAppConfig');
    // 初始化系统内部配置
    initAppConfig();
  });
  const appInitialState: Omit<AppContainerProp, 'loading'> = {
    prefixCls,
    isMobile: false,
  };
  return <AppProvider initialState={appInitialState}>{children}</AppProvider>;
};

export default AppProviderIndex;
