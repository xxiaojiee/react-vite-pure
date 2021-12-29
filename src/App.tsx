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
import { AppProvider } from '/@/components/Application';

const App = () => {
  return (
    <Router>
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <AppProvider>
            <Routes />
          </AppProvider>
        </Provider>
      </ConfigProvider>
    </Router>
  );
};

export default App;
