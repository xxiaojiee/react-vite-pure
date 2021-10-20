import { Tabs, Form } from 'antd';
import React, { useState } from 'react';
import { FormInstance } from 'antd/es/form';
// import LoginContext from './LoginContext';
import LoginItem, { LoginItemProps } from './LoginItem';

import LoginSubmit from './LoginSubmit';
import LoginTab from './LoginTab';

export interface LoginProps {
  activeKey: string;
  onTabChange: (key: string) => void;
  style?: React.CSSProperties;
  onSubmit?: (values: { [k: string]: string }) => void;
  className?: string;
  form?: FormInstance;
  children: Array<React.ReactElement<typeof LoginTab>>;
}

interface LoginType extends React.FC<LoginProps> {
  Tab: typeof LoginTab;
  Submit: typeof LoginSubmit;
  UserName: React.FunctionComponent<LoginItemProps>;
  Password: React.FunctionComponent<LoginItemProps>;
  Mobile: React.FunctionComponent<LoginItemProps>;
  Captcha: React.FunctionComponent<LoginItemProps>;
}

interface initProp {
  useTabs: boolean;
  TabChildren: Array<React.ReactComponentElement<typeof LoginTab>>;
  otherChildren: Array<React.ReactElement<unknown>>;
}

const getInit = (children) => {
  let useTabs = false;
  const TabChildren = [];
  const otherChildren = [];
  React.Children.forEach(
    children,
    (child: React.ReactComponentElement<typeof LoginTab> | React.ReactElement<unknown>) => {
      if (!child) {
        return;
      }
      if ((child.type as { typeName: string }).typeName === 'LoginTab') {
        useTabs = true;
        TabChildren.push(child as React.ReactComponentElement<typeof LoginTab>);
      } else {
        otherChildren.push(child);
      }
    },
  );
  console.log(444, {useTabs, TabChildren, otherChildren})
  return [useTabs, TabChildren, otherChildren];
};

const Login: LoginType = (props: LoginProps) => {
  const { activeKey: type, onTabChange: setType } = props;
  const [useTabs, TabChildren, otherChildren]: initProp = getInit(props.children);

  return (
    <div>
      <Form
        form={props.form}
        onFinish={(values) => {
          if (props.onSubmit) {
            props.onSubmit(values as { [k: string]: string });
          }
        }}
      >
        {useTabs ? (
          <React.Fragment>
            <Tabs
              animated={false}
              activeKey={type}
              onChange={(activeKey) => {
                setType(activeKey);
              }}
            >
              {TabChildren}
            </Tabs>
            {otherChildren}
          </React.Fragment>
        ) : (
          props.children
        )}
      </Form>
    </div>
    // </LoginContext.Provider>
  );
};

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;

Login.UserName = LoginItem.UserName;
Login.Password = LoginItem.Password;
Login.Mobile = LoginItem.Mobile;
Login.Captcha = LoginItem.Captcha;

export default Login;
