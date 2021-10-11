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

const Login: LoginType = (props: LoginProps) => {
  const { activeKey: type, onTabChange: setType } = props;
  const [tabs, setTabs] = useState<boolean>(false);
  // const [active, setActive] = useState<{ [k: string]: Array<{ [key: string]: string } | string> }>(
  //   {},
  // );
  const TabChildren: Array<React.ReactComponentElement<typeof LoginTab>> = [];
  const otherChildren: Array<React.ReactElement<unknown>> = [];
  React.Children.forEach(
    props.children,
    (child: React.ReactComponentElement<typeof LoginTab> | React.ReactElement<unknown>) => {
      if (!child) {
        return;
      }
      if ((child.type as { typeName: string }).typeName === 'LoginTab') {
        setTabs(true);
        TabChildren.push(child as React.ReactComponentElement<typeof LoginTab>);
      } else {
        otherChildren.push(child);
      }
    },
  );
  return (
    // <LoginContext.Provider
    //   value={{
    //     tabUtil: {
    //       addTab: (id) => {
    //         setTabs((preTabs) => [...preTabs, id]);
    //       },
    //       removeTab: (id) => {
    //         setTabs((preTabs) => preTabs.filter((currentId) => currentId !== id));
    //       },
    //     },
    //     updateActive: (activeItem) => {
    //       if (active && active[type]) {
    //         active[type].push(activeItem);
    //       } else if (active) {
    //         active[type] = [activeItem];
    //       }
    //       setActive(active);
    //     },
    //   }}
    // >
    <div>
      <Form
        form={props.form}
        onFinish={(values) => {
          if (props.onSubmit) {
            props.onSubmit(values as { [k: string]: string });
          }
        }}
      >
        {tabs ? (
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
