import React, { useCallback, useRef, useState } from 'react';
import { Form, Input, Button } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { CountdownInput } from '/@/components/CountDown';
import LoginFormTitle from '../LoginFormTitle';
import { LoginStateEnum } from '/@/enums/pageEnum';
import { useLoginState, useFormValid } from '../useLogin';

const FormItem = Form.Item;

const MobileForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { handleBackLogin, getLoginState } = useLoginState();
  const formRef = useRef<FormInstance | null>(null);

  const formData = {
    mobile: '',
    sms: '',
  };

  const { validForm } = useFormValid(formRef);

  const getShow = getLoginState() === LoginStateEnum.MOBILE;


  const handleLogin = useCallback(async () =>  {
    const data = await validForm();
    if (!data) {
      return;
    }
  },[validForm])
  if (!getShow) {
    return null;
  }
  return (
    <>
      <LoginFormTitle />
      <Form className="p-4 enter-x" initialValues={formData} ref={formRef}>
        <FormItem
          name="mobile"
          className="enter-x"
          rules={[
            {
              required: true,
              message: '请输入手机号码',
            },
          ]}
        >
          <Input size="large" placeholder="手机号码" className="fix-auto-fill" />
        </FormItem>
        <FormItem
          name="sms"
          className="enter-x"
          rules={[
            {
              required: true,
              message: '请输入验证码',
            },
          ]}
        >
          <CountdownInput size="large" className="fix-auto-fill" placeholder="短信验证码" />
        </FormItem>

        <FormItem className="enter-x">
          <Button type="primary" size="large" block onClick={handleLogin} loading={loading}>
            登录
          </Button>
          <Button size="large" block className="mt-4" onClick={handleBackLogin}>
            返回
          </Button>
        </FormItem>
      </Form>
    </>
  );
};

export default MobileForm;
