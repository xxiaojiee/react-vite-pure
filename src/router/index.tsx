import React from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { map } from 'lodash-es';
import { IRouter, routes } from '../router/routers';

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

export default function Routes() {
  return <DynamicRoute routes={routes} />;
}
