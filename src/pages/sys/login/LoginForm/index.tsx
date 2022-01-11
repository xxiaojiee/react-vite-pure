import React, { useCallback, useState, useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import LoginFormTitle from '../LoginFormTitle';
import { LoginStateEnum } from '/@/enums/pageEnum';
import { getMessage } from '/@/hooks/web/getMessage';
import { Checkbox, Form, Input, Row, Col, Button, Divider } from 'antd';
import classNames from 'classnames';
import { useLoginState, useLogin } from '../useLogin';
import { useDesign } from '/@/hooks/web/useDesign';
import {
  GithubFilled,
  WechatFilled,
  AlipayCircleFilled,
  GoogleCircleFilled,
  TwitterCircleFilled,
} from '@ant-design/icons';

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance | null>(null);
  const { notification, createErrorModal } = getMessage();
  const { prefixCls } = useDesign('login');
  const { setLoginState, getLoginState } = useLoginState();
  const login = useLogin();

  const formData = {
    account: 'vben',
    password: '123456',
  };
  const getShow = getLoginState() === LoginStateEnum.LOGIN;
  const handleLogin = useCallback(async () => {
    const data = await formRef.current?.validateFields();
    if (!data) {
      return;
    }
    try {
      setLoading(true);

      const userInfo = await login({
        goHome: true,
        password: data.password,
        username: data.account,
        mode: 'none', // 不要默认的错误提示
      });
      if (userInfo) {
        notification.success({
          message: '登录成功',
          description: `欢迎回来: ${userInfo.realName}`,
          duration: 3,
        });
      }
    } catch (error) {
      setLoading(false);
      createErrorModal({
        title: '错误提示',
        content: (error as unknown as Error).message || '网络异常，请检查您的网络连接是否正常!',
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    }
  }, [createErrorModal, login, notification, prefixCls]);
  if (!getShow) {
    return null;
  }
  return (
    <>
      <LoginFormTitle />
      <Form
        name="login-form"
        className="p-4 enter-x"
        initialValues={formData}
        onKeyPress={handleLogin}
        autoComplete="off"
        ref={formRef}
      >
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
          <Input size="large" className="fix-auto-fill" placeholder="账号" />
        </Form.Item>
        <Form.Item
          name="password"
          className="enter-x"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password size="large" placeholder="密码" />
        </Form.Item>

        <Row className="enter-x">
          <Col span="12">
            <Form.Item>
              <Checkbox defaultChecked={false}>记住我</Checkbox>
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item style={{ textAlign: 'right' }}>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setLoginState(LoginStateEnum.RESET_PASSWORD);
                }}
              >
                忘记密码?
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="enter-x">
          <Button type="primary" size="large" block onClick={handleLogin} loading={loading}>
            登录
          </Button>
        </Form.Item>

        <Row className="enter-x">
          <Col md={8} xs={24}>
            <Button
              block
              onClick={() => {
                setLoginState(LoginStateEnum.MOBILE);
              }}
            >
              手机登录
            </Button>
          </Col>
          <Col md={8} xs={24} className="!my-2 !md:my-0 xs:mx-0 md:mx-2">
            <Button
              block
              onClick={() => {
                setLoginState(LoginStateEnum.QR_CODE);
              }}
            >
              二维码登录
            </Button>
          </Col>
          <Col md={7} xs={24}>
            <Button
              block
              onClick={() => {
                setLoginState(LoginStateEnum.REGISTER);
              }}
            >
              注册
            </Button>
          </Col>
        </Row>

        <Divider className="enter-x">其他登录方式</Divider>

        <div className={classNames('flex justify-evenly enter-x', `${prefixCls}-sign-in-way`)}>
          <GithubFilled />
          <WechatFilled />
          <AlipayCircleFilled />
          <GoogleCircleFilled />
          <TwitterCircleFilled />
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
