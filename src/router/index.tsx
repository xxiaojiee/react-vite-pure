import React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import { cloneDeep } from 'lodash-es';
import { useGuard } from './guard';
import type { AppRouteRecordRaw, RouterRenderProp } from '/@/router/types';
import { useStoreState } from '/@/store';

function RouterRender(props: RouterRenderProp) {
  const { route, matched = [] } = props;
  const { component, children } = route;
  const Comp = component!;
  // 是否显示组件 （在useGuard里进行鉴权）
  const isShowComponent = useGuard(props);
  if (children && Comp) {
    if (!isShowComponent) {
      return <DynamicRoute routes={children} matched={matched} />;
    }
    return (
      <Comp {...props}>
        <DynamicRoute routes={children} matched={matched} />
      </Comp>
    );
  }
  if (children && !Comp) {
    return <DynamicRoute routes={children} matched={matched} />;
  }
  if (!children && Comp && isShowComponent) {
    console.log('props:', props);
    return <Comp {...props} />;
  }
  return null;
}

const DynamicRoute: React.FC<{ routes: AppRouteRecordRaw[]; matched?: AppRouteRecordRaw[] }> = ({
  routes: rous = [],
  matched = [],
}) => {
  const reouteRender = (props: RouteComponentProps, route) => {
    // eslint-disable-next-line react/prop-types
    const { match, ...otherProp } = props;
    const newRoute = {
      ...route,
      match,
    };
    const matcheds = [...matched, newRoute];
    newRoute.matched = cloneDeep(matcheds);
    return <RouterRender {...otherProp} route={newRoute} matched={matcheds} />;
  };
  return (
    <Switch>
      {rous.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          exact={!!route.exact}
          render={(props) => reouteRender(props, route)}
        />
      ))}
    </Switch>
  );
};

export default function Routes() {
  const permission = useStoreState('permission');
  return <DynamicRoute routes={permission.routes} />;
}
