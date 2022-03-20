import React from 'react';
import { Menu } from 'antd';
import { ItemProps } from '../props';
import MenuItemContent from './MenuItemContent';

const MenuItem = Menu.Item;

const BasicMenuItem: React.FC<ItemProps> = (props) => {
  const { item, isHorizontal, ...otherProps } = props;
  return (
    <MenuItem {...otherProps}>
      <MenuItemContent item={item} />
    </MenuItem>
  );
};

export default BasicMenuItem;
