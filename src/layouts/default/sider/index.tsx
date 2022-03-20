import React from 'react';

import Sider from './LayoutSider';
import MixSider from './MixSider';
import { Drawer } from 'antd';

import { useAppInject } from '/@/hooks/web/useAppInject';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useDesign } from '/@/hooks/web/useDesign';

const SiderMain: React.FC = () => {
  const { prefixCls } = useDesign('layout-sider-wrapper');
  const { isMobile } = useAppInject();
  const { setMenuSetting, collapsed, menuWidth, isMixSidebar } = useMenuSetting();

  const handleClose = () => {
    setMenuSetting({
      collapsed: true,
    });
  };
  if (isMobile) {
    return (
      <Drawer
        placement="left"
        className={prefixCls}
        width={menuWidth}
        getContainer={false}
        visible={!collapsed}
        onClose={handleClose}
      >
        <Sider />
      </Drawer>
    );
  }
  if (isMixSidebar) {
    return <MixSider />;
  }
  return <Sider />;
};

export default SiderMain;
