import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import { QrCode } from '/@/components/Qrcode';
import LoginFormTitle from '../LoginFormTitle';
import { LoginStateEnum } from '/@/enums/pageEnum';
import { useLoginState } from '../useLogin';

import login from '/@/assets/images/logo.png';

const QrCodeForm: React.FC = () => {
  const [qrCodeUrl] = useState<string>('https://vvbin.cn/next/login');
  const { handleBackLogin, getLoginState } = useLoginState();

  const getShow = getLoginState() === LoginStateEnum.QR_CODE;

  if (!getShow) {
    return null;
  }
  return (
    <>
      <LoginFormTitle />
      <div className="enter-x min-w-64 min-h-64">
        <QrCode
          value={qrCodeUrl}
          logo={login}
          className="enter-x flex justify-center xl:justify-start"
          width={280}
        />
        <Divider className="enter-x">扫码后点击“确认”，即可完成登录</Divider>
        <Button size="large" block className="mt-4 enter-x" onClick={handleBackLogin}>
          返回
        </Button>
      </div>
    </>
  );
};

export default QrCodeForm;
