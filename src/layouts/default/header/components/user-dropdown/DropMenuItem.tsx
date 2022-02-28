import React from 'react';
import { Menu } from 'antd';
import Icon from '/@/components/Icon/index';

const MenuItem = Menu.Item;

interface DropMenuItemProp {
  text: string;
  icon: string;
  key: string;
}

const DropMenuItem: React.FC<DropMenuItemProp> = (props) => {
  const { text, icon, key } = props;
  return (
    <MenuItem key={key}>
      <span className="flex items-center">
        <Icon icon={icon} className="mr-1" />
        <span>{text}</span>
      </span>
    </MenuItem>
  );
};

export default DropMenuItem;
