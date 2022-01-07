import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { map } from 'lodash-es';
import type { AppRouteRecordRaw } from '/@/router/types';
import { useAppContainer } from '/@/components/Application';

const RouteWithSubRoutes = (route: AppRouteRecordRaw) => {
  const Comp = route.component;
  return (
    <Route
      path={route.path}
      render={(props: any) => {
        let Component: JSX.Element | null = null;
        if (route.redirect) {
          Component = <Redirect to={route.redirect} />;
        } else if (route.children) {
          if (Comp) {
            Component = (
              <Comp {...props} route={route}>
                <DynamicRoute routes={route.children} />
              </Comp>
            );
          } else {
            Component = (
              <>
                <DynamicRoute routes={route.children} />
              </>
            );
          }
        } else if (Comp) {
          Component = <Comp {...props} />;
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
  const { app } = useAppContainer();
  console.log('routes:', app.routes);
  return <DynamicRoute routes={app.routes} />;
}
