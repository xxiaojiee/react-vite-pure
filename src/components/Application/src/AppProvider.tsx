import React from 'react';
import { useMount } from 'ahooks';
import { useHistory } from 'react-router-dom'
import { AppProvider, AppContainerProp } from './useAppContext';
import { useInitAppConfigStore } from '/@/logics/initAppConfig';
import { basicRoutes } from '/@/router/routes';
import { prefixCls } from '/@/settings/designSetting';

interface AppProviderIndexProp {
  children: React.ReactNode;
}

const AppProviderIndex: React.FC<AppProviderIndexProp> = ({ children }) => {
  const history = useHistory();
  const initAppConfig = useInitAppConfigStore();
  useMount(() => {
    console.log('监听location：', history.location);
    history.listen((location) => {
      console.log('监听location：', location);
    });
    // 初始化系统内部配置
    initAppConfig();
  });
  const appInitialState: AppContainerProp = {
    prefixCls,
    isMobile: false,
    routes: basicRoutes,
  };
  return <AppProvider initialState={appInitialState}>{children}</AppProvider>;
};

export default AppProviderIndex;
