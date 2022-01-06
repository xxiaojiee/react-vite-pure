import React from 'react';
import type { RouteMeta } from 'react-router';
import type {
  RouteProps, RouteComponentProps,
} from 'react-router-dom';
import { RoleEnum } from '/@/enums/roleEnum';

export interface AppRouteRecordRaw extends Omit<RouteProps, 'component'> {
  name: string;
  meta: RouteMeta;
  redirect?: string;
  component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any> | undefined;
  components?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any> | undefined;
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  fullPath?: string;
}

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

export interface Menu {
  name: string;

  icon?: string;

  path?: string | readonly string[] | undefined;

  // path contains param, auto assignment.
  paramPath?: string;

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

// export type AppRouteModule = RouteModule | AppRouteRecordRaw;
export type AppRouteModule = AppRouteRecordRaw;
