import React from 'react';
import classNames from 'classnames';
import { useDesign } from '/@/hooks/web/useDesign';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground';
import { updateDarkTheme } from '/@/logics/theme/dark';
import { SvgIcon } from '/@/components/Icon';
import { ThemeEnum } from '/@/enums/appEnum';
import moon from '/@/assets/icons/moon.svg';
import sun from '/@/assets/icons/sun.svg';

import './index.less';

interface AppLocalePickerProp {
  className?: string;
}

const AppLocalePicker: React.FC<AppLocalePickerProp> = (props) => {
  const { className } = props;
  const { prefixCls } = useDesign('dark-switch');
  const { getDarkMode, setDarkMode, getShowDarkModeToggle } = useRootSetting();
  const isDark = getDarkMode() === ThemeEnum.DARK;
  const getClass = classNames(className, prefixCls, {
    [`${prefixCls}--dark`]: isDark,
  });

  const toggleDarkMode = () => {
    const darkMode = getDarkMode() === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
    setDarkMode(darkMode);
    updateDarkTheme(darkMode);
    updateHeaderBgColor();
    updateSidebarBgColor();
  };
  if (!getShowDarkModeToggle()) {
    return null;
  }

  return (
    <div className={getClass} onClick={toggleDarkMode}>
      <div className={`${prefixCls}-inner`} />
      <SvgIcon size={14} name="sun" />
      <SvgIcon size={14} name="moon" />
    </div>
  );
};

export default AppLocalePicker;
