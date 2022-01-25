import React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import { map } from 'lodash-es';
import { useGuard } from './guard';
import type { AppRouteRecordRaw, RouterRenderProp } from '/@/router/types';
import { useStoreState } from '/@/store';

function RouterRender(props: RouterRenderProp) {
  console.log('props:::', props.route);
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
    return <Comp {...props} />;
  }
  return null;
}

const DynamicRoute: React.FC<{ routes?: AppRouteRecordRaw[]; matched?: AppRouteRecordRaw[] }> = ({
  routes: rous,
  matched = [],
}) => (
  <Switch>
    {map(rous, (route, index) => {
      const path = route.path[0] !== '/' ? `${matched[0].path}/${route.path}` : route.path;
      return (
        <Route
        key={index}
        path={path}
        exact={!!route.exact}
        render={(props: RouteComponentProps) => {
            const { match, ...otherProp } = props;
            const newRoute = {
              ...route,
              match,
              path,
            };
            const routerRenderProps = {
              ...otherProp,
              route: newRoute,
              matched: [...matched, newRoute],
            };
            return <RouterRender {...routerRenderProps} />;
          }}
        />
      );
    })}
  </Switch>
);

export default function Routes() {
  const permission = useStoreState('permission');
  return <DynamicRoute routes={permission.routes} />;
}
