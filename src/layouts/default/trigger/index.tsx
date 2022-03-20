import React from 'react';
import { load } from '/@/router/constant';
import HeaderTrigger from './HeaderTrigger';

const SiderTrigger = load(() => import('./SiderTrigger'));

interface LayoutTriggerProp {
  className?: string;
  sider?: boolean;
  theme?: 'light' | 'dark';
}

const LayoutTrigger: React.FC<LayoutTriggerProp> = (props) => {
  const { theme, sider, className } = props;
  return sider ? (
    <SiderTrigger className={className} />
  ) : (
    <HeaderTrigger theme={theme} className={className} />
  );
};

export default LayoutTrigger;
