import React from 'react';
import type {  RouteMeta } from 'react-router';
import type {
  RouteProps,
} from 'react-router-dom';
import { RoleEnum } from '/@/enums/roleEnum';

export interface AppRouteRecordRaw extends Omit<RouteProps, 'meta'> {
  name: string;
  meta: RouteMeta;
  component?: React.ReactNode;
  components?: React.ReactNode;
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

  path: string;

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
