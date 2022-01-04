import type { ProjectConfig } from '/#/config';
import { useDispatch } from 'react-redux'
import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';

import { useUpdateHeaderBgColor, useUpdateSidebarBgColor } from '/@/logics/theme/updateBackground';
import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
import { updateDarkTheme } from '/@/logics/theme/dark';
import { changeTheme } from '/@/logics/theme';

import { getCommonStoragePrefix, getStorageShortName } from '/@/utils/env';

import { primaryColor } from '../../build/config/themeConfig';
import { Persistent } from '/@/utils/cache/persistent';
import { deepMerge } from '/@/utils';
import { ThemeEnum } from '/@/enums/appEnum';

import { actions, useStoreState } from '/@/store';

const appActions = actions.app;
const localeActions = actions.locale;

// Initial project configuration
export function useInitAppConfigStore() {
  const appState = useStoreState('app');
  const dispatch = useDispatch();
  const updateHeaderBgColor = useUpdateHeaderBgColor();
  const updateSidebarBgColor = useUpdateSidebarBgColor();
  return function initAppConfig(){
    let projCfg: ProjectConfig = Persistent.getLocal(PROJ_CFG_KEY) as ProjectConfig;
    projCfg = deepMerge(projectSetting, projCfg || {});
    const { darkMode } = appState;
    const {
      colorWeak,
      grayMode,
      themeColor,

      headerSetting: { bgColor: headerBgColor } = {},
      menuSetting: { bgColor } = {},
    } = projCfg;
    try {
      if (themeColor && themeColor !== primaryColor) {
        changeTheme(themeColor);
      }

      grayMode && updateGrayMode(grayMode);
      colorWeak && updateColorWeak(colorWeak);
    } catch (error) {
      console.log(error);
    }
    dispatch(appActions.setProjectConfig(projCfg));
    // init dark mode
    updateDarkTheme(darkMode);
    updateHeaderBgColor(headerBgColor && darkMode !== ThemeEnum.DARK ? headerBgColor : undefined);
    updateSidebarBgColor(bgColor && darkMode !== ThemeEnum.DARK ? bgColor : undefined);
    // init store
    dispatch(localeActions.initLocale());
    setTimeout(() => {
      clearObsoleteStorage();
    }, 16);
  }
}

/**
  * 随着版本的不断迭代，localStorage中存储的缓存key会越来越多。
  * 此方法用于删除无用的key
 */
export function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix();
  const shortPrefix = getStorageShortName();

  [localStorage, sessionStorage].forEach((item: Storage) => {
    Object.keys(item).forEach((key) => {
      if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
        item.removeItem(key);
      }
    });
  });
}
