import React from 'react';
import { Route, Switch } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router-dom';
import { useAppContainer } from '/@/components/Application';
import * as H from 'history';
import { map, cloneDeep } from 'lodash-es';
import type { AppRouteRecordRaw, RouterRenderProp } from '/@/router/types';
import { useStoreState } from '/@/store';
import { useMount, useUnmount } from 'ahooks';

function RouterRender(props: RouterRenderProp) {
  const { route, history, location = {}, matched = [] } = props;
  const { redirect, path, component, children } = route;
  const { pathname } = location as H.Location;
  const { app, saveApp } = useAppContainer();
  const Comp = component!;
  // 是否获取了当前的Route; 再渲染路由组件，保证组件都马上获取到当前的Route；
  const isGetCurrentRoute = app.route?.path === path;
  useMount(() => {
    console.log('我要挂载啦！！！！', pathname, route);
    // 如果页面地址为当前路由地址（说明已重定向到最终的路由地址）
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
  useUnmount(() => {
    console.log('我要卸载啦！！！！', route);
  });
  if (children && Comp) {
    if (!isGetCurrentRoute) {
      <DynamicRoute routes={children} matched={matched} />;
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
  if (!children && Comp && isGetCurrentRoute) {
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
            route: { ...route, match },
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
