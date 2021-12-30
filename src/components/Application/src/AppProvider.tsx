import React from 'react';
import { AppProvider } from './useAppContext';
import { initAppConfigStore } from '/@/logics/initAppConfig';

const Index: React.FC<any> = ({ children }: { children: React.ReactNode }) => {
  // 初始化系统内部配置
  initAppConfigStore();
  return <AppProvider>{children}</AppProvider>;
};

export default Index;
