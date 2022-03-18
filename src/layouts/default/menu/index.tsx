import React from 'react';
import { BasicMenu } from '/@/components/Menu';
import { SimpleMenu } from '/@/components/SimpleMenu';
import { AppLogo } from '/@/components/Application';
import classNames from 'classnames';

import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

import { useHistory } from 'react-router-dom';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { ScrollContainer } from '/@/components/Container';

import { useSplitMenu } from './useLayoutMenu';
import { openWindow } from '/@/utils';
import { isUrl } from '/@/utils/is';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useAppInject } from '/@/hooks/web/useAppInject';
import { useDesign } from '/@/hooks/web/useDesign';

interface MenuProp {
  theme: 'light' | 'dark';

  splitType?: MenuSplitTyeEnum;

  isHorizontal: boolean;
  // menu Mode
  menuMode?: MenuModeEnum;
}

const Menu: React.FC<MenuProp> = (props) => {
  const { isHorizontal, theme, splitType = MenuSplitTyeEnum.NONE, menuMode = '' } = props;
  const { push } = useHistory();

  const {
    menuMode: menuModes,
    menuType,
    menuTheme,
    collapsed,
    collapsedShowTitle,
    accordion,
    isHorizontal: isHorizontals,
    isSidebarType,
    split,
  } = useMenuSetting();
  const { showLogo } = useRootSetting();

  const { prefixCls } = useDesign('layout-menu');

  const { menusRef } = useSplitMenu(splitType);

  const { isMobile } = useAppInject();

  const getComputedMenuMode = isMobile ? MenuModeEnum.INLINE : menuMode || menuModes;

  const getComputedMenuTheme = theme || menuTheme;

  const getIsShowLogo = showLogo && isSidebarType;

  const getUseScroll =
    !isHorizontals &&
    (isSidebarType || splitType === MenuSplitTyeEnum.LEFT || splitType === MenuSplitTyeEnum.NONE);

  const getWrapperStyle = {
    height: `calc(100% - ${getIsShowLogo ? '48px' : '0px'})`,
  };

  const getLogoClass = classNames(`${prefixCls}-logo`, getComputedMenuTheme, {
    [`${prefixCls}--mobile`]: isMobile,
  });

  /**
   * click menu
   * @param menu
   */

  const handleMenuClick = (path: string) => {
    push(path);
  };

  /**
   * before click menu
   * @param menu
   */
  const beforeMenuClickFn = (path: string) => {
    if (!isUrl(path)) {
      return true;
    }
    openWindow(path);
    return false;
  };

  const getCommonProps = {
    menus: menusRef,
    beforeClickFn: beforeMenuClickFn,
    items: menusRef,
    theme: getComputedMenuTheme,
    accordion,
    collapse: collapsed,
    collapsedShowTitle,
    onMenuClick: handleMenuClick,
  };

  const renderHeader = () => {
    if (!getIsShowLogo && !isMobile) return null;
    return <AppLogo showTitle={!collapsed} className={getLogoClass} theme={getComputedMenuTheme} />;
  };

  const renderMenu = () => {
    const { menus, ...menuProps } = getCommonProps;
    console.log('菜单：', menus, isHorizontal);
    if (!menus || !menus.length) return null;
    return !isHorizontal ? (
      <SimpleMenu {...menuProps} isSplitMenu={split} items={menus} />
    ) : (
      <BasicMenu
        {...(menuProps as any)}
        isHorizontal={isHorizontal}
        type={menuType}
        showLogo={getIsShowLogo}
        mode={getComputedMenuMode}
        items={menus}
      />
    );
  };
  console.log('getUseScroll:', getUseScroll);
  return (
    <>
      {renderHeader()}
      {getUseScroll ? (
        <ScrollContainer style={getWrapperStyle}>{renderMenu()}</ScrollContainer>
      ) : (
        renderMenu()
      )}
    </>
  );
};

export default Menu;
