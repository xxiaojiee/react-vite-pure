import React from 'react';
import { Menu } from 'antd';
import Icon from '/@/components/Icon/index';

const MenuItem = Menu.Item;

interface DropMenuItemProp {
  text: string;
  icon: string;
  eventKey: string;
}

const DropMenuItem: React.FC<DropMenuItemProp> = (props) => {
  const { text, icon, eventKey } = props;
  return (
    <MenuItem eventKey={eventKey}>
      <span className="flex items-center">
        <Icon icon={icon} className="mr-1" />
        <span>{text}</span>
      </span>
    </MenuItem>
  );
};

export default DropMenuItem;
