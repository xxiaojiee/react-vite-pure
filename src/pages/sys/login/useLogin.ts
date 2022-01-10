
import { LoginStateEnum } from '/@/enums/pageEnum';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { getToken } from '/@/utils/auth';
import { doLogout, getUserInfo, loginApi } from '/@/api/sys/user';
import { useBuildRoutesAction } from '/@/hooks/web/usePermission';
import { LoginParams } from '/@/api/sys/types/user';
import { actions, useStoreState } from '/@/store';
import { useDispatch } from 'react-redux'
import { isArray } from '/@/utils/is';
import { useHistory } from 'react-router-dom';
import { basicRoutes } from '/@/router/routes';

import type { ErrorMessageMode } from '/#/axios';
import type { AppRouteRecordRaw } from '/@/router/types';
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
        const routes = await buildRoutesAction();
        if (userInfo) {
          userInfo.routes = [...routes, ...basicRoutes]
        }
        disPatch(permissionActions.setDynamicAddedRoute(true))
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

export function useFormValid<T extends Object = any>(formRef: any) {
  async function validForm() {
    const form = formRef();
    if (!form) return;
    const data = await form.validate();
    return data as T;
  }

  return { validForm };
}


function createRule(message: string) {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ];
}


export function useFormRules(formData?: Recordable) {
  const getAccountFormRule = () => createRule('请输入账号');
  const getPasswordFormRule = () => createRule('请输入密码');
  const getSmsFormRule = () => createRule('请输入验证码');
  const getMobileFormRule = () => createRule('请输入手机号码');

  const userState = useStoreState('user');

  const validatePolicy = async (_: unknown, value: boolean) => {
    return !value ? Promise.reject('勾选后才能注册') : Promise.resolve();
  };

  const validateConfirmPassword = (password: string) => {
    return async (_: unknown, value: string) => {
      if (!value) {
        return Promise.reject('请输入密码');
      }
      if (value !== password) {
        return Promise.reject('两次输入密码不一致');
      }
      return Promise.resolve();
    };
  };

  const getFormRules = (): { [k: string]: unknown | unknown[] } => {
    const accountFormRule = getAccountFormRule();
    const passwordFormRule = getPasswordFormRule();
    const smsFormRule = getSmsFormRule();
    const mobileFormRule = getMobileFormRule();

    const mobileRule = {
      sms: smsFormRule,
      mobile: mobileFormRule,
    };
    switch (userState.loginState) {
      // register form rules
      case LoginStateEnum.REGISTER:
        return {
          account: accountFormRule,
          password: passwordFormRule,
          confirmPassword: [
            { validator: validateConfirmPassword(formData?.password), trigger: 'change' },
          ],
          policy: [{ validator: validatePolicy, trigger: 'change' }],
          ...mobileRule,
        };

      // reset password form rules
      case LoginStateEnum.RESET_PASSWORD:
        return {
          account: accountFormRule,
          ...mobileRule,
        };

      // mobile form rules
      case LoginStateEnum.MOBILE:
        return mobileRule;

      // login form rules
      default:
        return {
          account: accountFormRule,
          password: passwordFormRule,
        };
    }
  };
  return { getFormRules };
}
