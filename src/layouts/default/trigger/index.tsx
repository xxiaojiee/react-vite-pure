import React from 'react';
import { load } from '/@/router/constant';
import HeaderTrigger from './HeaderTrigger';

const SiderTrigger= load(() => import('./SiderTrigger'));

interface LayoutTriggerProp{
  sider: boolean;
  theme: 'light'| 'dark';
}

const LayoutTrigger:React.FC<LayoutTriggerProp> = (props) => {
  const { theme, sider } = props;
  return sider ? <SiderTrigger /> : <HeaderTrigger theme={theme} />;
};

export default LayoutTrigger;
