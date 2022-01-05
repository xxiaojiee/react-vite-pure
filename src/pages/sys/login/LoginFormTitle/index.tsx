import React from 'react';
import { useLoginState } from '../useLogin';
import { LoginStateEnum } from '/@/enums/pageEnum';

const LoginFormTitle: React.FC = () => {
  const { getLoginState } = useLoginState();

  const getFormTitle = () => {
    const titleObj = {
      [LoginStateEnum.RESET_PASSWORD]: '重置密码',
      [LoginStateEnum.LOGIN]: '登录',
      [LoginStateEnum.REGISTER]: '注册',
      [LoginStateEnum.MOBILE]: '手机登录',
      [LoginStateEnum.QR_CODE]: '二维码登录',
    };
    return titleObj[getLoginState()];
  };
  return (
    <h2 className="mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">
      {getFormTitle()}
    </h2>
  );
};

export default LoginFormTitle;
