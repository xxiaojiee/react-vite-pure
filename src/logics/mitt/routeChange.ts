/**
 * Used to monitor routing changes to change the status of menus and tabs. There is no need to monitor the route, because the route status change is affected by the page rendering time, which will be slow
 */

import mitt from '/@/utils/mitt';
import type { AppRouteRecordRaw } from '/@/router/types';
import { getRawRoute } from '/@/utils';

const emitter = mitt();

const key = Symbol('route');

let lastChangeTab: AppRouteRecordRaw;

export function setRouteChange(lastChangeRoute: AppRouteRecordRaw) {
  const r = getRawRoute(lastChangeRoute);
  emitter.emit(key, r);
  lastChangeTab = r;
}

export function listenerRouteChange(
  callback: (route: AppRouteRecordRaw) => void,
  immediate = true,
) {
  emitter.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab);
}

export function removeTabChangeListener() {
  emitter.clear();
}
