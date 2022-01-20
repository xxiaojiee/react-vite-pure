
import { LoginStateEnum, PageEnum } from '/@/enums/pageEnum';
import { RoleEnum } from '/@/enums/roleEnum';
import { getToken } from '/@/utils/auth';
import { getUserInfo, loginApi, doLogout } from '/@/api/sys/user';
import { useBuildRoutesAction } from '/@/hooks/web/usePermission';
import { LoginParams } from '/@/api/sys/types/user';
import { actions, useStoreState } from '/@/store';
import { useDispatch } from 'react-redux'
import { isArray } from '/@/utils/is';
import { useHistory } from 'react-router-dom';
import { basicRoutes } from '/@/router/routes';
import { dealRoutersPath } from '/@/utils/index';


import type { ErrorMessageMode } from '/#/axios';
import type { UserInfo } from '/#/store';

const userActions = actions.user
const permissionActions = actions.permission


export function useLoginState() {
  const userState = useStoreState('user');
  const dispatch = useDispatch();
  function setLoginState(state: LoginStateEnum) {
    dispatch(userActions.setLoginState(state));
  }

  const getLoginState = () => userState.loginState;

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN);
  }

  return { setLoginState, getLoginState, handleBackLogin };
}


export function useGetUserInfoAction() {
  const dispatch = useDispatch();
  return async function getUserInfoAction(): Promise<UserInfo | null> {
    if (!getToken()) return null;
    // 获取用户信息
    const userInfo = await getUserInfo();
    const { roles = [] } = userInfo;
    if (isArray(roles)) {
      const roleList = roles.map((item) => item.value) as RoleEnum[];
      dispatch(userActions.setRoleList(roleList))
    } else {
      userInfo.roles = [];
      dispatch(userActions.setRoleList([]))
    }
    dispatch(userActions.setUserInfo(userInfo))
    return userInfo;
  }
}

export function useAfterLoginAction() {
  const userState = useStoreState('user');
  const permissionState = useStoreState('permission');
  const disPatch = useDispatch();
  const getUserInfoAction = useGetUserInfoAction();
  const buildRoutesAction = useBuildRoutesAction();
  const history = useHistory();
  return async function afterLoginAction(goHome?: boolean): Promise<UserInfo | null> {
    if (!getToken()) return null;
    // 1.获取用户信息
    const userInfo = await getUserInfoAction();
    const { sessionTimeout } = userState;
    // 登录是否过期
    if (sessionTimeout) {
      disPatch(userActions.setSessionTimeout(false))
    } else {
      // 动态添加路由
      if (!permissionState.isDynamicAddedRoute) {
        const actionroutes = await buildRoutesAction();
        const routes = [...dealRoutersPath(actionroutes), ...basicRoutes];
        disPatch(permissionActions.setRoutes(routes))
        console.log('获取路由成功：', routes);
      }
      goHome && (await history.replace(userInfo?.homePath || PageEnum.BASE_HOME));
    }
    return userInfo;
  }
}

export function useLogin() {
  const dispatch = useDispatch();
  const afterLoginAction = useAfterLoginAction();
  return async function login(params: LoginParams & {
    goHome?: boolean;
    mode?: ErrorMessageMode;
  }): Promise<UserInfo | null> {
    try {
      const { goHome = true, mode, ...loginParams } = params;
      const data = await loginApi(loginParams, mode);
      const { token } = data;
      // save token
      dispatch(userActions.setToken(token));
      return afterLoginAction(goHome);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

/**
 * @description: logout
 */
export function useLogout() {
  const userState = useStoreState('user')
  const history = useHistory();
  return async function logout(goLogin = false) {
    if (userState.token) {
      try {
        await doLogout();
      } catch {
        console.log('注销Token失败');
      }
    }
    userActions.setToken(undefined);
    userActions.setSessionTimeout(false);
    userActions.setUserInfo(null);
    goLogin && history.push(PageEnum.BASE_LOGIN);
  }

}




export function useFormValid<T extends Object = any>(formRef: any) {
  async function validForm() {
    const form = formRef.current;
    if (!form) return;
    const data = await form.validateFields();
    return data as T;
  }
  return { validForm };
}


