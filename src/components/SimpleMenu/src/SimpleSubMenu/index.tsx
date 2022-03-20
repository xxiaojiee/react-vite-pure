import React from 'react';
import type { Menu } from '/@/router/types';
import classNames from 'classnames';
import { useDesign } from '/@/hooks/web/useDesign';
import Icon from '/@/components/Icon/index';
import { omit } from 'lodash-es';
import MenuItem from '../components/MenuItem';
import SubMenu from '../components/SubMenuItem';
import { load } from '/@/router/constant';

const SimpleMenuTag = load(() => import('../SimpleMenuTag'));

interface SimpleSubMenuProp {
  className?: string;
  item: Menu;
  parent: boolean;
  collapsedShowTitle: boolean;
  collapse: boolean;
  theme: 'dark' | 'light';
}

const SimpleSubMenu: React.FC<SimpleSubMenuProp> = (props) => {
  const { className, item, parent, collapsedShowTitle, collapse, theme } = props;
  const { prefixCls } = useDesign('simple-menu');

  const getShowMenu = !item?.meta?.hideMenu;
  const getIcon = item?.icon;
  const getI18nName = item?.name;
  const getShowSubTitle = !collapse || !parent;
  const getIsCollapseParent = !!collapse && !!parent;
  const getLevelClass = classNames(className, {
    [`${prefixCls}__parent`]: parent,
    [`${prefixCls}__children`]: !parent,
  });

  const menuHasChildren = (menuTreeItem: Menu): boolean => {
    return (
      !menuTreeItem.meta?.hideChildrenInMenu &&
      Reflect.has(menuTreeItem, 'children') &&
      !!menuTreeItem.children &&
      menuTreeItem.children.length > 0
    );
  };
  if (!getShowMenu) {
    return null;
  }
  if (menuHasChildren(item)) {
    return (
      <SubMenu
        {...omit(props, ['className'])}
        className={classNames(getLevelClass, theme)}
        collapsedShowTitle={collapsedShowTitle}
        title={
          <>
            {getIcon ? <Icon icon={getIcon} size={16} /> : null}

            {collapsedShowTitle && getIsCollapseParent ? (
              <div className="mt-2 collapse-title">{getI18nName}</div>
            ) : null}
            {getShowSubTitle ? (
              <span className={classNames('ml-2', `${prefixCls}-sub-title`)}>{getI18nName}</span>
            ) : null}

            <SimpleMenuTag item={item} collapseParent={!!collapse && !!parent} />
          </>
        }
      >
        {item.children?.map((childrenItem) => (
          <SimpleSubMenu {...props} key={childrenItem.path} item={childrenItem} parent={false} />
        ))}
      </SubMenu>
    );
  }
  return (
    <MenuItem
      {...omit(props, ['className'])}
      className={getLevelClass}
      title={
        <>
          <span className={classNames('ml-2', `${prefixCls}-sub-title`)}>{getI18nName}</span>
          <SimpleMenuTag item={item} collapseParent={getIsCollapseParent} />
        </>
      }
    >
      {getIcon ? <Icon icon={getIcon} size={16} /> : null}
      {collapsedShowTitle && getIsCollapseParent ? (
        <div className="mt-1 collapse-title">{getI18nName}</div>
      ) : null}
    </MenuItem>
  );
};

export default SimpleSubMenu;
