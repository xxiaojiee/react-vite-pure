
import { LoginStateEnum, PageEnum } from '/@/enums/pageEnum';
import { RoleEnum } from '/@/enums/roleEnum';
import { getToken } from '/@/utils/auth';
import { getUserInfo, loginApi, doLogout } from '/@/api/sys/user';
import { useBuildRoutesAction } from '/@/hooks/web/usePermission';
import { LoginParams } from '/@/api/sys/types/user';
import { actions, useStoreState, store } from '/@/store';
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
  return async function afterLoginAction(): Promise<UserInfo | null> {
    if (!getToken()) return null;
    // 1.获取用户信息
    const userInfo = await getUserInfoAction();
    const { sessionTimeout } = userState;
    // 登录是否过期
    if (sessionTimeout) {
      disPatch(userActions.setSessionTimeout(false))
      // 动态添加路由
    } else if (!permissionState.isDynamicAddedRoute) {
      const actionroutes = await buildRoutesAction();
      const routes = [...dealRoutersPath(actionroutes), ...basicRoutes];
      // 设置routes, 页面会重新卸载，重新加载页面
      disPatch(permissionActions.setRoutes(routes))
    }
    return userInfo;
  }
}

export function useLogin() {
  const dispatch = useDispatch();
  const afterLoginAction = useAfterLoginAction();
  return async function login(params: LoginParams & {
    mode?: ErrorMessageMode;
  }): Promise<UserInfo | null> {
    try {
      const { mode, ...loginParams } = params;
      const data = await loginApi(loginParams, mode);
      const { token } = data;
      // save token
      dispatch(userActions.setToken(token));
      return afterLoginAction();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

/**
 * @description: logout
 */

export async function logout() {
  const { token } = store.getState().user;
  if (token) {
    try {
      await doLogout();
    } catch {
      console.log('注销Token失败');
    }
  }
  store.dispatch(userActions.setToken(undefined));
  store.dispatch(userActions.setSessionTimeout(false));
  store.dispatch(userActions.setUserInfo(null));
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


