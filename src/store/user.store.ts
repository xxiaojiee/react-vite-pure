import type { UserInfo } from '/#/store';
// import type { ErrorMessageMode } from '/#/axios';
import { RoleEnum } from '/@/enums/roleEnum';
// import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';


// import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
// import { doLogout, getUserInfo, loginApi } from '/@/api/sys/user';
// import { useI18n } from '/@/hooks/web/useI18n';
// import { getMessage } from '/@/hooks/web/getMessage';
// import { usePermissionStore } from '/@/store/modules/permission';
// import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
// import { isArray } from '/@/utils/is';


interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export default {
  id: 'user',
  state: {
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  },
  reducers: {
    setToken(this: any, info: string | undefined) {
      this.setCurrentState({
        token: info || ''
      })
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(this: any, roleList: RoleEnum[]) {
      this.setCurrentState({
        roleList
      })
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(this: any, info: UserInfo | null) {
      this.setCurrentState({
        userInfo: info,
        lastUpdateTime: new Date().getTime(),
      })
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(this: any, flag: boolean) {
      this.setCurrentState({
        sessionTimeout: flag,
      })
    },
    resetState(this: any, ) {
      this.setCurrentState({
        userInfo: null,
        token: '',
        roleList:[],
        sessionTimeout:false,
      })
    },
  },
  // methods: {
  //   dealData() {
  //     console.log('this:', this)
  //   }
  // }
}

