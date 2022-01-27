import React from 'react';
import Icon from '/@/components/Icon';

interface SettingProp {
  className: string;
}

const Setting: React.FC<SettingProp> = (props) => {
  const { className } = props;
  return (
    <div className={className}>
      <Icon icon="ion:settings-outline" />
    </div>
  );
};

export default Setting;
