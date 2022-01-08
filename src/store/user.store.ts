import type { UserInfo } from '/#/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY, SESSION_TIMEOUT_KEY, LAST_UPDATE_TIME_KEY } from '/@/enums/cacheEnum';
import { setAuthCache } from '/@/utils/auth';
import { LoginStateEnum } from '/@/enums/pageEnum'


export interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export default {
  id: 'user',
  state: {
    loginState: LoginStateEnum.LOGIN,
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // 登录是否过期
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  },
  reducers: {
    setToken(this: any, info: string | undefined) {
      setAuthCache(TOKEN_KEY, info);
      this.setCurrentState({
        token: info || ''
      })
    },
    setLoginState(this: any, state: LoginStateEnum) {
      this.setCurrentState({
        loginState: state
      })
    },
    setRoleList(this: any, roleList: RoleEnum[]) {
      setAuthCache(ROLES_KEY, roleList);
      this.setCurrentState({
        roleList
      })
    },
    setUserInfo(this: any, info: UserInfo | null) {
      const time = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
      setAuthCache(LAST_UPDATE_TIME_KEY, time);
      this.setCurrentState({
        userInfo: info,
        lastUpdateTime: time,
      })
    },
    setSessionTimeout(this: any, flag: boolean) {
      setAuthCache(SESSION_TIMEOUT_KEY, flag);
      this.setCurrentState({
        sessionTimeout: flag,
      })
    },
    resetState(this: any,) {
      this.setCurrentState({
        userInfo: null,
        token: '',
        roleList: [],
        sessionTimeout: false,
      })
    },
  },
  // methods: {
  //   dealData() {
  //     console.log('this:', this)
  //   }
  // }
}

