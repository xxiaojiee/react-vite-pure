import React from 'react';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

const SiderTrigger: React.FC = () => {
  const { collapsed, toggleCollapsed } = useMenuSetting();
  const onToggleCollapsed = (e) => {
    e.stopPropagation();
    toggleCollapsed();
  };
  return (
    <div onClick={onToggleCollapsed}>
      {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
    </div>
  );
};

export default SiderTrigger;
