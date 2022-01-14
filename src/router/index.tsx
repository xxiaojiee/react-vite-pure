import React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import { map } from 'lodash-es';
import type { AppRouteRecordRaw } from '/@/router/types';
import { useStoreState } from '/@/store';
import { useMount } from 'ahooks';

interface RouterRenderProp extends RouteComponentProps {
  route: AppRouteRecordRaw;
}

function RouterRender(props: RouterRenderProp) {
  const { route, history, location = {} } = props;
  const { redirect,path, component, children  } = route;
  const { pathname } = location as H.Location;
  const Comp = component!;
  useMount(() => {
    // 重定向
    if(redirect && path === pathname){
      history.replace(redirect);
    }
  })
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
  const permission = useStoreState('permission');
  return <DynamicRoute routes={permission.routes} />;
}
