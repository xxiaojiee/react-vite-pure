import React from 'react';
import Icon from '/@/components/Icon';
import SettingDrawer from './SettingDrawer';
import { useDrawer } from '/@/components/Drawer';

interface SettingProp {
  className: string;
}

const Setting: React.FC<SettingProp> = (props) => {
  const { className } = props;
  const [register, { openDrawer }] = useDrawer();
  return (
    <div className={className} onClick={() => openDrawer()}>
      <Icon icon="ion:settings-outline" />
      <SettingDrawer onRegister={register} />
    </div>
  );
};

export default Setting;
