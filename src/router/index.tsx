import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import { basicRoutes } from '/@/router/routes';
import { map, cloneDeep } from 'lodash-es';
import type { AppRouteRecordRaw } from '/@/router/types';

interface RouterRenderProp extends RouteComponentProps {
  route: AppRouteRecordRaw;
}

function RouterRender(props: RouterRenderProp) {
  const { route } = props;
  const { redirect, component, children, location = {} } = route;
  const { state } = location as H.Location;
  const fromRoute = (state as Record<string, any>)?.from || [];
  const Comp = component!;
  if (redirect) {
    const redirectProp = {
      pathname: route.redirect,
      state: {
        from: [route, ...fromRoute],
      },
    };
    return <Redirect to={redirectProp} />;
  }
  if (children && Comp) {
    return (
      <Comp {...props}>
        <DynamicRoute routes={children} />
      </Comp>
    );
  }
  if (children && !Comp) {
    return <DynamicRoute routes={children} />;
  }
  if (!children && Comp) {
    return <Comp {...props} />;
  }
  return null;
}

const DynamicRoute: React.FC<{ routes?: AppRouteRecordRaw[] }> = ({ routes: rous }) => (
  <Switch>
    {map(rous, (route, index) => (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        render={(props: RouteComponentProps) => <RouterRender {...props} route={route} />}
      />
    ))}
  </Switch>
);

export default function Routes() {
  // const [routes, setRoutes] = useState<AppRouteRecordRaw[]>();
  const routes = cloneDeep(basicRoutes)
  return <DynamicRoute routes={routes} />;
}
