import React, { useMemo } from 'react';
import { Menu } from 'antd';
// import { useDesign } from '/@/hooks/web/useDesign';
import { ItemProps } from '../props';
import BasicMenuItem from './BasicMenuItem';
import MenuItemContent from './MenuItemContent';

const { SubMenu } = Menu;

const BasicSubMenuItem: React.FC<ItemProps> = (props) => {
  const { item, theme, isHorizontal, ...eventKeyProp } = props;
  // const { prefixCls } = useDesign('basic-menu-item');

  const getShowMenu = !item?.meta?.hideMenu;
  const isMenuHasChildren = useMemo((): boolean => {
    return (
      !item.meta?.hideChildrenInMenu &&
      Reflect.has(item, 'children') &&
      !!item.children &&
      item.children.length > 0
    );
  }, [item]);
  if (!getShowMenu) {
    return null;
  }
  if (isMenuHasChildren) {
    return (
      <SubMenu
        {...eventKeyProp}
        className={theme}
        popupClassName="app-top-menu-popup"
        title={<MenuItemContent item={item} />}
      >
        {item.children?.map((childrenItem) => {
          return (
            <BasicSubMenuItem
              key={childrenItem.path}
              theme={theme}
              isHorizontal={isHorizontal}
              item={childrenItem}
            />
          );
        })}
      </SubMenu>
    );
  }
  return <BasicMenuItem {...props} />;
};

export default BasicSubMenuItem;
