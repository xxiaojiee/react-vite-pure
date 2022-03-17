import React from 'react';
import classNames from 'classnames';
import { useDesign } from '/@/hooks/web/useDesign';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground';
import { updateDarkTheme } from '/@/logics/theme/dark';
import { SvgIcon } from '/@/components/Icon';
import { ThemeEnum } from '/@/enums/appEnum';

import './index.less';

interface AppLocalePickerProp {
  className?: string;
}

const AppLocalePicker: React.FC<AppLocalePickerProp> = (props) => {
  const { className } = props;
  const { prefixCls } = useDesign('dark-switch');
  const { darkMode, setDarkMode, showDarkModeToggle } = useRootSetting();
  const isDark = darkMode === ThemeEnum.DARK;
  const getClass = classNames(className, prefixCls, {
    [`${prefixCls}--dark`]: isDark,
  });

  const toggleDarkMode = () => {
    const darkModes = darkMode === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
    setDarkMode(darkModes);
    updateDarkTheme(darkModes);
    updateHeaderBgColor();
    updateSidebarBgColor();
  };
  if (!showDarkModeToggle) {
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
