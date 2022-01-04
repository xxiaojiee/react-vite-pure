import React from 'react';
import classNames from 'classnames';
import { useDesign } from '/@/hooks/web/useDesign';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useUpdateHeaderBgColor, useUpdateSidebarBgColor } from '/@/logics/theme/updateBackground';
import { updateDarkTheme } from '/@/logics/theme/dark';
import { ThemeEnum } from '/@/enums/appEnum';
import moon from '/@/assets/icon/moon.svg';
import sun from '/@/assets/icon/sun.svg';

import './AppDarkModeToggle.less';

const AppLocalePicker: React.FC = () => {
  const { prefixCls } = useDesign('dark-switch');
  const updateHeaderBgColor = useUpdateHeaderBgColor();
  const updateSidebarBgColor = useUpdateSidebarBgColor();
  const { getDarkMode, setDarkMode, getShowDarkModeToggle } = useRootSetting();
  const isDark = getDarkMode() === ThemeEnum.DARK;
  const getClass = classNames(prefixCls, {
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
      <img src={sun} alt="sun" />
      <img src={moon} alt="moon" />
    </div>
  );
};

export default AppLocalePicker;
