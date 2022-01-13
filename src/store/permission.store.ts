import type {  Menu } from '/@/router/types';
// import { basicRoutes } from '/@/router/routes';

interface PermissionState {
  // 权限code列表
  permCodeList: string[] | number[];
  // 路由是否已经动态添加
  isDynamicAddedRoute: boolean;
  // 触发菜单更新
  lastBuildMenuTime: number;
  // 后台菜单列表
  backMenuList: Menu[];
  frontMenuList: Menu[];
}


export default {
  id: 'permission',
  state: {
    permCodeList: [],
    // 路由是否已经动态添加
    isDynamicAddedRoute: false,
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // 路由列表
    // routes: basicRoutes,
    // 后台菜单列表
    backMenuList: [],
    // menu List
    frontMenuList: [],
  },
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
      this.setCurrentState({
        isDynamicAddedRoute: false,
        permCodeList: [],
        backMenuList: [],
        lastBuildMenuTime: 0,
      })

    },
  },
  // methods: {
  //   dealData() {
  //     console.log('this:', this)
  //   }
  // }
}

