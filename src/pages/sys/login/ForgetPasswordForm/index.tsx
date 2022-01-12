import React, { useCallback, useState, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { CountdownInput } from '/@/components/CountDown';
import type { FormInstance } from 'antd/lib/form';

import { LoginStateEnum } from '/@/enums/pageEnum';
import { useLoginState } from '../useLogin';

import LoginFormTitle from '../LoginFormTitle';

const ForgetPasswordForm: React.FC = () => {
  const [loading] = useState(false);
  const formRef = useRef<FormInstance | null>(null);
  const { handleBackLogin, getLoginState } = useLoginState();
  const formData = {
    account: '',
    mobile: '',
    sms: '',
  };
  const getShow = getLoginState() === LoginStateEnum.RESET_PASSWORD;
  const handleReset = useCallback(async () => {
    if (!formRef.current) return;
    await formRef.current.resetFields();
  }, []);
  if (!getShow) {
    return null;
  }
  return (
    <>
      <LoginFormTitle />
      <Form className="p-4 enter-x" initialValues={formData} ref={formRef}>
        <Form.Item
          name="account"
          className="enter-x"
          rules={[
            {
              required: true,
              message: '请输入账号',
            },
          ]}
        >
          <Input size="large" placeholder="账号" />
        </Form.Item>
        <Form.Item
          name="mobile"
          className="enter-x"
          rules={[
            {
              required: true,
              message: '请输入手机号码',
            },
          ]}
        >
          <Input size="large" placeholder="手机号码" />
        </Form.Item>
        <Form.Item
          name="sms"
          className="enter-x"
          rules={[
            {
              required: true,
              message: '请输入验证码',
            },
          ]}
        >
          <CountdownInput size="large" placeholder="短信验证码" />
        </Form.Item>
        <Form.Item className="enter-x">
          <Button type="primary" size="large" block onClick={handleReset} loading={loading}>
            重置
          </Button>
          <Button size="large" block className="mt-4" onClick={handleBackLogin}>
            返回
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ForgetPasswordForm;
