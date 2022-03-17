import React from 'react';
import classNames from 'classnames';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useDesign } from '/@/hooks/web/useDesign';

interface HeaderTriggerProp {
  theme: 'light' | 'dark';
}

const HeaderTrigger: React.FC<HeaderTriggerProp> = (props) => {
  const { theme } = props;
  const { collapsed, toggleCollapsed } = useMenuSetting();
  const { prefixCls } = useDesign('layout-header-trigger');
  return (
    <span className={classNames(prefixCls, theme)} onClick={toggleCollapsed}>
      {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </span>
  );
};

export default HeaderTrigger;
