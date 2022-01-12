import React, { useCallback, useState, useRef } from 'react';
import LoginFormTitle from '../LoginFormTitle';
import { Form, Input, Button, Checkbox } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { StrengthMeter } from '/@/components/StrengthMeter';
import { CountdownInput } from '/@/components/CountDown';
import { LoginStateEnum } from '/@/enums/pageEnum';
import { useLoginState, useFormValid } from '../useLogin';

const FormItem = Form.Item;
const InputPassword = Input.Password;

const ForgetPasswordForm: React.FC = () => {
  const [loading] = useState(false);
  const { handleBackLogin, getLoginState } = useLoginState();
  const formRef = useRef<FormInstance | null>(null);
  const getShow = getLoginState() === LoginStateEnum.REGISTER;
  const { validForm } = useFormValid(formRef);
  const formData = {
    account: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    sms: '',
    policy: false,
  };
  const handleRegister = useCallback(async () => {
    const data = await validForm();
    if (!data) {
      return;
    }
  }, [validForm]);
  if (!getShow) {
    return null;
  }
  return (
    <>
      <LoginFormTitle />
      <Form className="p-4 enter-x" initialValues={formData} ref={formRef}>
        <FormItem
          name="account"
          className="enter-x"
          rules={[
            {
              required: true,
              message: '请输入账号',
            },
          ]}
        >
          <Input className="fix-auto-fill" size="large" placeholder="账号" />
        </FormItem>
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
        <FormItem name="password" className="enter-x">
          <StrengthMeter size="large" placeholder="密码" />
        </FormItem>
        <FormItem name="confirmPassword" className="enter-x">
          <InputPassword size="large" visibilityToggle placeholder="确认密码" />
        </FormItem>

        <FormItem className="enter-x" name="policy">
          {/* 没有逻辑，需要自己处理 */}
          <Checkbox v-model:checked="formData.policy">我同意xxx隐私政策</Checkbox>
        </FormItem>

        <Button
          type="primary"
          className="enter-x"
          size="large"
          block
          onClick={handleRegister}
          loading={loading}
        >
          注册
        </Button>
        <Button size="large" block className="mt-4 enter-x" onClick={handleBackLogin}>
          返回
        </Button>
      </Form>
    </>
  );
};

export default ForgetPasswordForm;
