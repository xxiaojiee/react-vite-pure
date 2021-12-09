import React from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import {
  Redirect,
  Route,
  Switch,
  HashRouter as Router, // hash模式
  // BrowserRouter as Router, // history模式
} from 'react-router-dom';
import { map } from 'lodash-es';
import { Provider } from 'react-redux';
import { store } from './store';
import { IRouter, routes } from './common/router';
import { ConfigProvider } from 'antd';

const RouteWithSubRoutes = (route: IRouter) => {
  const Comp = route.component;

  return (
    <Route
      path={route.path}
      render={(props: any) => {
        let Component = null;
        if (route.redirect) {
          Component = <Redirect to={route.redirect} />;
        } else if (Comp) {
          Component = (
            <Comp {...props} route={route}>
              <DynamicRoute routes={route.routes} />
            </Comp>
          );
        } else {
          Component = (
            <>
              <DynamicRoute routes={route.routes} />
            </>
          );
        }
        return Component;
      }}
    />
  );
};

const DynamicRoute = ({ routes: rous }: { routes?: IRouter[] }) => {
  if (!rous) return null;

  return (
    <Switch>
      {map(rous, (route, index) => {
        return <RouteWithSubRoutes key={index} {...route} />;
      })}
    </Switch>
  );
};

const App = () => {
  return (
    <Router>
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <DynamicRoute routes={routes} />
        </Provider>
      </ConfigProvider>
    </Router>
  );
};

export default App;
