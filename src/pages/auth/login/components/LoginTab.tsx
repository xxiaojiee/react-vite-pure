import React from 'react';
import { TabPaneProps } from 'antd/es/tabs';
import { Tabs } from 'antd';
// import LoginContext, { LoginContextProps } from './LoginContext';

const { TabPane } = Tabs;

// const generateId = (() => {
//   let i = 0;
//   return (prefix = '') => {
//     i += 1;
//     return `${prefix}${i}`;
//   };
// })();

interface LoginTabProps extends TabPaneProps {
  // tabUtil: LoginContextProps['tabUtil'];
  active?: boolean;
}

const LoginTab: React.FC<LoginTabProps> = (props: any) => {
  // useEffect(() => {
  //   console.log(1111111111);
  //   const uniqueId = generateId('login-tab-');
  //   if (props.tabUtil) {
  //     props.tabUtil.addTab(uniqueId);
  //   }
  // }, []);

  const { children } = props;
  return <TabPane {...props}>{props.active && children}</TabPane>;
};

const WrapContext: React.FC<TabPaneProps> & {
  typeName: string;
} = (props) => <LoginTab {...props} />;

// 标志位 用来判断是不是自定义组件
WrapContext.typeName = 'LoginTab';

export default WrapContext;
