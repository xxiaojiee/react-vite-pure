import type { UserInfo } from '/#/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
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
    setLoginState(this: any, state: LoginStateEnum) {
      this.setCurrentState({
        loginState: state
      })
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

