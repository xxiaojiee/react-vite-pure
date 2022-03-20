import React from 'react';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

interface SiderTriggerProp {
  className?: string;
}

const SiderTrigger: React.FC<SiderTriggerProp> = (props) => {
  const { className } = props;
  const { collapsed, toggleCollapsed } = useMenuSetting();
  const onToggleCollapsed = (e) => {
    e.stopPropagation();
    toggleCollapsed();
  };
  return (
    <div onClick={onToggleCollapsed} className={className}>
      {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
    </div>
  );
};

export default SiderTrigger;
