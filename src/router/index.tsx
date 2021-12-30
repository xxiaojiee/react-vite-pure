import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { map } from 'lodash-es';
import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';
import { routes, basicRoutes } from '../router/routes';

const RouteWithSubRoutes = (route: AppRouteRecordRaw) => {
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
              <DynamicRoute routes={route.children} />
            </Comp>
          );
        } else {
          console.log('route:', route.path);
          Component = (
            <>
              <DynamicRoute routes={route.children} />
            </>
          );
        }
        return Component;
      }}
    />
  );
};

const DynamicRoute = ({ routes: rous }: { routes?: AppRouteRecordRaw[] }) => {
  if (!rous) return null;
  return (
    <Switch>
      {map(rous, (route, index) => {
        return <RouteWithSubRoutes key={index} {...route} />;
      })}
    </Switch>
  );
};

export default function Routes() {
  return <DynamicRoute routes={basicRoutes} />;
}
