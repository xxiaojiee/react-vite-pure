import { BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout';
import React, { ReactNode } from 'react';

export interface BasicLayoutProps extends ProLayoutProps {
  children: ReactNode;
}

const Layout = (props: BasicLayoutProps) => {
  const { children } = props;
  return (
    <div>
      Layout
      {children}
    </div>
  );
};

export default Layout;
