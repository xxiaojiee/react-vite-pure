import React from 'react';
import type { RouteMeta } from 'react-router';
import type {
  RouteProps, RouteComponentProps,
} from 'react-router-dom';
import { RoleEnum } from '/@/enums/roleEnum';

export interface RouterRenderProp extends Omit<RouteComponentProps, 'match'> {
  matched: AppRouteRecordRaw[];
  route: AppRouteRecordRaw;
}

export interface AppRouteRecordRaw extends Omit<RouteProps, 'component'> {
  name: string;
  meta: RouteMeta;
  redirect?: string;
  component?: React.ComponentType<RouterRenderProp> | React.ComponentType<any> | undefined | string | (() => Promise<any>);
  components?: React.ComponentType<RouterRenderProp> | React.ComponentType<any> | undefined | string | (() => Promise<any>);
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  isChildrenRoute?: boolean;
  path: string;
  matched?: AppRouteRecordRaw[];
  match?: RouteComponentProps['match']
}


export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

export interface Menu {
  name: string;

  icon?: string;

  path: string;

  // path contains param, auto assignment.
  paramPath?: string;

  redirect?: string;

  disabled?: boolean;

  children?: Menu[];

  orderNo?: number;

  roles?: RoleEnum[];

  meta?: Partial<RouteMeta>;

  tag?: MenuTag;

  hideMenu?: boolean;
}

export interface MenuModule {
  orderNo?: number;
  menu: Menu;
}

// export type AppRouteRecordRaw = RouteModule | AppRouteRecordRaw;
// export type AppRouteRecordRaw = AppRouteRecordRaw;
