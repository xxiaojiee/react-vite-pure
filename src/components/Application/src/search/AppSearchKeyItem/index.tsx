import React from 'react';
import { Icon } from '/@/components/Icon';

interface AppSearchKeyItemProp {
  className?: string;
  icon: string;
}

const AppSearchKeyItem: React.FC<AppSearchKeyItemProp> = (props) => {
  const { className, icon } = props;
  return (
    <span className={className}>
      <Icon icon={icon} />
    </span>
  );
};

export default AppSearchKeyItem;
