
import { NOT_PERMISSION_ROUTE } from '/@/router/routes';
import type { AppRouteRecordRaw, Menu } from '/@/router/types';

interface PermissionState {
  // 权限code列表
  permCodeList: string[] | number[];
  // 路由是否已经动态添加
  isDynamicAddedRoute: boolean;
  // 触发菜单更新
  lastBuildMenuTime: number;
  // 路由列表
  routes: AppRouteRecordRaw[],
  // 后台菜单列表
  backMenuList: Menu[];
  frontMenuList: Menu[];
}


const defaultState = {
  permCodeList: [],
  // 路由是否已经动态添加
  isDynamicAddedRoute: false,
  // 触发菜单更新
  lastBuildMenuTime: 0,
  // 路由列表
  routes: NOT_PERMISSION_ROUTE,
  // 后台菜单列表
  backMenuList: [],
  // menu List
  frontMenuList: [],
}

export default {
  id: 'permission',
  state: defaultState,
  reducers: {
    setPermCodeList(this: any, codeList: string[]) {
      this.permCodeList = codeList;
      this.setCurrentState({
        permCodeList: codeList
      })
    },

    setBackMenuList(this: any, list: Menu[]) {
      const newState: Partial<PermissionState> = {
        backMenuList: list,
      }
      if (list?.length > 0) {
        newState.lastBuildMenuTime = new Date().getTime();
      }
      this.setCurrentState(newState)
    },

    setRoutes(this: any, list: AppRouteRecordRaw[]) {
      console.log('获取路由啦！！！', list);
      this.setCurrentState({
        routes: list,
        isDynamicAddedRoute: true,
      })
    },

    setFrontMenuList(this: any, list: Menu[]) {
      this.setCurrentState({
        frontMenuList: list
      })
    },

    setLastBuildMenuTime(this: any) {
      this.setCurrentState({
        lastBuildMenuTime: new Date().getTime()
      })
    },

    setDynamicAddedRoute(this: any, added: boolean) {
      this.setCurrentState({
        isDynamicAddedRoute: added
      })
    },

    resetState(this: any): void {
      this.setCurrentState(defaultState)
    },
  },
  // methods: {
  //   dealData() {
  //   }
  // }
}

