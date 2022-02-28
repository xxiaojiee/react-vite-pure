import type { AppRouteRecordRaw } from '/@/router/types';

import { Persistent } from '/@/utils/cache/persistent';

import { MULTIPLE_TABS_KEY } from '/@/enums/cacheEnum';

import projectSetting from '/@/settings/projectSetting';

export interface RouteLocationNormalized extends AppRouteRecordRaw {
  /**
   * Object representation of the `search` property of the current location.
   */
  query: Record<string, null | string | string[]>;
  /**
   * Hash of the current location. If present, starts with a `#`.
   */
  hash: string;
  /**
   * Object of decoded params extracted from the `path`.
   */
  params: Record<string, string | string[]>;
}


export interface MultipleTabState {
  cacheTabList: Set<string>;
  tabList: RouteLocationNormalized[];
  lastDragEndIndex: number;
}

function handleGotoPage(router: Router) {
  // const go = useGo(router);
  // go(unref(router.currentRoute).path, true);
}

const getToTarget = (tabItem: RouteLocationNormalized) => {
  const { params, path, query } = tabItem;
  return {
    params: params || {},
    path,
    query: query || {},
  };
};

const cacheTab = projectSetting.multiTabsSetting.cache;


// let timeId: TimeoutHandle;

export default {
  id: 'multipleTab',
  state: {
    // Tabs that need to be cached
    cacheTabList: new Set(),
    // multiple tab list
    tabList: cacheTab ? Persistent.getLocal(MULTIPLE_TABS_KEY) || [] : [],
    // Index of the last moved tab
    lastDragEndIndex: 0,
  },
  reducers: {
    clearCacheTabs(this: any): void {
      this.setCurrentState({
        cacheTabList: new Set(),
      })
    },
    resetState(this: any): void {
      this.setCurrentState({
        tabList: [],
        cacheTabList: new Set(),
      })
    },
  },
  // methods: {
  //   dealData() {
  //   }
  // }
}

