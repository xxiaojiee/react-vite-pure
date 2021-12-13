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


const App = () => {
  return (
    <Router>
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <Routes />
        </Provider>
      </ConfigProvider>
    </Router>
  );
};

export default App;
