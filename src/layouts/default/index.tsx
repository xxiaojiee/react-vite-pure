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
import type { RouterRenderProp } from '/@/router/types';

const LayoutFeatures = load(() => import('/@/layouts/default/feature'));
const LayoutFooter = load(() => import('/@/layouts/default/footer'));

export type BasicLayoutProps = ProLayoutProps &
  RouterRenderProp & {
    children: ReactNode;
  };

const DefaultLayout = (props: BasicLayoutProps) => {
  const { children } = props;
  const { prefixCls } = useDesign('default-layout');
  const { isMobile } = useAppInject();
  const { showFullHeaderRef } = useHeaderSetting();
  const { showSidebar, isMixSidebar, showMenu } = useMenuSetting();

  // 创建锁屏监视器
  const lockEvents = useLockPage();

  const layoutClass = useMemo(() => {
    const cls: string[] = ['ant-layout'];
    if (isMixSidebar || showMenu) {
      cls.push('ant-layout-has-sider');
    }
    return cls;
  }, [isMixSidebar, showMenu]);

  useMount(() => {
    console.log('我是Layout，我渲染了', showFullHeaderRef, props);
  });
  return (
    <Layout className={prefixCls} {...lockEvents}>
      <LayoutFeatures />
      <LayoutHeader fixed />
      {/* {showFullHeaderRef ? <LayoutHeader fixed /> : null} */}
      <Layout className={classNames(layoutClass)}>
        {showSidebar || isMobile ? <LayoutSideBar /> : null}
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
