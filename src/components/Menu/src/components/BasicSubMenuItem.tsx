import React from 'react';
import type { Menu as MenuType } from '/@/router/types';
import { Menu } from 'antd';
// import { useDesign } from '/@/hooks/web/useDesign';
import { ItemProps } from '../props';
import { omit } from 'lodash-es';
import BasicMenuItem from './BasicMenuItem';
import MenuItemContent from './MenuItemContent';

const { SubMenu } = Menu;

const BasicSubMenuItem: React.FC<ItemProps> = (props) => {
  const { item, theme } = props;
  // const { prefixCls } = useDesign('basic-menu-item');

  const getShowMenu = item?.meta?.hideMenu;
  const menuHasChildren = (menuTreeItem: MenuType): boolean => {
    return (
      !menuTreeItem.meta?.hideChildrenInMenu &&
      Reflect.has(menuTreeItem, 'children') &&
      !!menuTreeItem.children &&
      menuTreeItem.children.length > 0
    );
  };
  return (
    <>
      {!menuHasChildren(item) && getShowMenu ? <BasicMenuItem {...props} /> : null}
      {menuHasChildren(item) && getShowMenu ? (
        <SubMenu
          className={theme}
          popupClassName="app-top-menu-popup"
          title={<MenuItemContent item={item} />}
        >
          {item.children?.map((childrenItem) => (
            <BasicSubMenuItem {...omit(props, 'item')} item={childrenItem} />
          ))}
        </SubMenu>
      ) : null}
    </>
  );
};

export default BasicSubMenuItem;
