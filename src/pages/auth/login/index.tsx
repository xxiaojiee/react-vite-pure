import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { login } from '/@/services/auth';
import LoginForm from './components/index';
import { useRequest } from '/@/services/useRequest';
import { getPageQuery } from '/@/utils/utils';
import { LoginParams } from '/@/pages/auth/data';

const { Tab, Password, Mobile, Submit } = LoginForm;

const Login = () => {
  const history = useHistory();
  const [type, setType] = useState('mobile');
  const { loading, run } = useRequest(login, {
    manual: true,
    onSuccess: (result) => {
      if (result && result.access_token) {
        localStorage.setItem('x-token', result.access_token);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect as string);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = (redirect as string).substr(urlParams.origin.length);
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect as string);
      }
    },
  });

  const handleSubmit = (values: { [key: string]: any }) => {
    run(values as LoginParams);
  };

  return (
    <div
      style={{
        width: '368px',
        margin: ' 0 auto',
      }}
    >
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="mobile" tab="手机号登录">
          <Mobile
            name="phone"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Tab key="password" tab="密码登录">
          <Mobile
            name="acction"
            placeholder="账号"
            rules={[
              {
                required: true,
                message: '请输入账号！',
              },
              // {
              //   pattern: /^1\d{10}$/,
              //   message: '账号格式错误！',
              // },
            ]}
          />
          <Password
            name="password1"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Submit loading={loading}>登录</Submit>
        <div
          style={{
            marginTop: '24px',
            lineHeight: '22px',
            textAlign: 'left',
          }}
        >
          <a>忘记密码</a>
          <Link
            style={{
              float: 'right',
            }}
            to="/auth/register"
          >
            注册账户
          </Link>
        </div>
      </LoginForm>
    </div>
  );
};

export default Login;
