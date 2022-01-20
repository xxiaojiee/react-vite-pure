import React from 'react';
import { useMount } from 'ahooks';
import { AppProvider } from '../useAppContext';
import { useInitAppConfigStore } from '/@/logics/initAppConfig';


interface AppProviderIndexProp {
  children: React.ReactNode;
}

const AppProviderIndex: React.FC<AppProviderIndexProp> = ({ children }) => {
  const initAppConfig = useInitAppConfigStore();
  useMount(() => {
    // 初始化系统内部配置
    initAppConfig();
  });
  return <AppProvider>{children}</AppProvider>;
};

export default AppProviderIndex;
