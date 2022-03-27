import React from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import {
  HashRouter as Router, // hash模式
  // BrowserRouter as Router, // history模式
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Routes from './router';
import { ConfigProvider } from 'antd';
import { useMount } from 'ahooks';
import { AppProvider } from '/@/hooks/core/useAppContext';
import { useInitAppConfigStore } from '/@/logics/initAppConfig';

const AppProviderMain: React.FC = ({ children }) => {
  const initAppConfig = useInitAppConfigStore();
  useMount(() => {
    // 初始化系统内部配置
    initAppConfig();
  });
  return <AppProvider>{children}</AppProvider>;
};

const App = (
  <Router>
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <AppProviderMain>
          <Routes />
        </AppProviderMain>
      </Provider>
    </ConfigProvider>
  </Router>
);

export default App;
