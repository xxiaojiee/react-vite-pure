import React, { ReactNode, useMemo } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';

import LayoutHeader from './header';
import LayoutContent from './content';
import LayoutSideBar from './sider';
import LayoutMultipleHeader from './header/MultipleHeader';

import { useMount } from 'ahooks';
import { useAppInject } from '/@/hooks/web/useAppInject';
import { useDesign } from '/@/hooks/web/useDesign';
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useLockPage } from '/@/hooks/web/useLockPage';
import { load } from '/@/router/constant';

import { BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout';

const LayoutFeatures = load(() => import('/@/layouts/default/feature'));
const LayoutFooter = load(() => import('/@/layouts/default/footer'));

export interface BasicLayoutProps extends ProLayoutProps {
  children: ReactNode;
}

const DefaultLayout = (props: BasicLayoutProps) => {
  const { children } = props;
  const { prefixCls } = useDesign('default-layout');
  const { getIsMobile } = useAppInject();
  const { getShowFullHeaderRef } = useHeaderSetting();
  const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();

  // 创建锁屏监视器
  const lockEvents = useLockPage();

  const layoutClass = useMemo(() => {
    const cls: string[] = ['ant-layout'];
    if (getIsMixSidebar() || getShowMenu()) {
      cls.push('ant-layout-has-sider');
    }
    return cls;
  }, [getIsMixSidebar, getShowMenu]);

  useMount(() => {
    console.log('我是Layout，我渲染了', props);
  });
  return (
    <Layout className={prefixCls} {...lockEvents}>
      <LayoutFeatures />
      {getShowFullHeaderRef() ? <LayoutHeader fixed /> : null}
      <Layout className={classNames(layoutClass)}>
        {getShowSidebar() || getIsMobile() ? <LayoutSideBar /> : null}
        <Layout className={classNames(`${prefixCls}-main`)}>
          <LayoutMultipleHeader />
          <LayoutContent>{children}</LayoutContent>
          <LayoutFooter />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
