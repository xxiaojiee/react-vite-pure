import React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import { useAppContainer } from '/@/components/Application';
import * as H from 'history';
import { map, cloneDeep } from 'lodash-es';
import type { AppRouteRecordRaw, RouterRenderProp } from '/@/router/types';
import { useStoreState } from '/@/store';
import { useMount } from 'ahooks';

function RouterRender(props: RouterRenderProp) {
  const { route, history, location = {}, matched = [] } = props;
  const { redirect, path, component, children } = route;
  const { pathname } = location as H.Location;
  const {  saveApp } = useAppContainer();

  const Comp = component!;
  useMount(() => {
    if (path === pathname) {
      // 重定向
      if (redirect) {
        history.replace(redirect);
        return;
      }
      // 保存当前props
      saveApp(cloneDeep(props));
    }
  });
  if (children && Comp) {
    return (
      <Comp {...props}>
        <DynamicRoute routes={children} matched={matched} />
      </Comp>
    );
  }
  if (children && !Comp) {
    return <DynamicRoute routes={children} matched={matched} />;
  }
  if (!children && Comp) {
    return <Comp {...props} />;
  }
  return null;
}

const DynamicRoute: React.FC<{ routes?: AppRouteRecordRaw[]; matched?: AppRouteRecordRaw[] }> = ({
  routes: rous,
  matched = [],
}) => (
  <Switch>
    {map(rous, (route, index) => (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        render={(props: RouteComponentProps) => {
          const { match, ...otherProp } = props;
          const routerRenderProps = {
            ...otherProp,
            route:{ ...route, match },
            matched: [...matched, { ...route, match }],
          };
          return <RouterRender {...routerRenderProps} />;
        }}
      />
    ))}
  </Switch>
);

export default function Routes() {
  const permission = useStoreState('permission');
  return <DynamicRoute routes={permission.routes} />;
}
