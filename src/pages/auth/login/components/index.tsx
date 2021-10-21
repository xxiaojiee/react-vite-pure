import { Tabs, Form } from 'antd';
import React from 'react';
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

type TabChildren = Array<React.ReactComponentElement<typeof LoginTab>>;
type OtherChildren = Array<React.ReactElement<unknown>>;
type Children = React.ReactComponentElement<typeof LoginTab> | React.ReactElement<unknown>;

interface InitProp {
  useTabs: boolean;
  tabChildren: TabChildren;
  otherChildren: OtherChildren;
}

const getInit = (children: Children[]) => {
  let useTabs = false;
  const tabChildren: TabChildren = [];
  const otherChildren: OtherChildren = [];
  React.Children.forEach(children, (child: Children) => {
    if (!child) {
      return;
    }
    if ((child.type as { typeName: string }).typeName === 'LoginTab') {
      useTabs = true;
      tabChildren.push(child as React.ReactComponentElement<typeof LoginTab>);
    } else {
      otherChildren.push(child);
    }
  });
  return {
    useTabs,
    tabChildren,
    otherChildren,
  };
};

const Login: LoginType = (props: LoginProps) => {
  const { activeKey: type, onTabChange: setType } = props;
  const { useTabs, tabChildren, otherChildren }: InitProp = getInit(props.children);

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
              {tabChildren}
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
