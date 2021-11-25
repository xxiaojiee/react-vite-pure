import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import LoginForm from './components/index';
import { useRequest } from 'ahooks';
import { getPageQuery } from '/@/utils/utils';
import { getMessage } from '/@/hooks/web/getMessage';
import { LoginParams } from './data';
import api from './api';

console.log('useMessage:', getMessage);

const { Tab, Password, Mobile, Submit } = LoginForm;
const { createErrorModal } = getMessage();

const Login = () => {
  const history = useHistory();
  const [type, setType] = useState('mobile');
  const { loading, run } = useRequest(api.login, {
    manual: true,
    onSuccess: (result) => {
      console.log('result:', result);
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
    onError(error){
      createErrorModal({
        title: '错误提示',
        content: (error as unknown as Error).message || '网络异常，请检查您的网络连接是否正常!',
      });
    }
  });

  const handleSubmit = (values: { [key: string]: any }) => {
    console.log('values:', values);
    run(
      {
        password: values.password,
        username: values.account,
      },
      'none', // 不要默认的错误提示
    );
  };

  return (
    <div
      style={{
        width: '368px',
        margin: ' 0 auto',
      }}
    >
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="password" tab="密码登录">
          <Mobile
            name="account"
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
