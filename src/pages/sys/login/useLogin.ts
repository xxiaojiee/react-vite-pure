
import { LoginStateEnum } from '/@/enums/pageEnum'
import { actions, useStoreState } from '/@/store';
import { useDispatch } from 'react-redux'

const userActions = actions.user


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
