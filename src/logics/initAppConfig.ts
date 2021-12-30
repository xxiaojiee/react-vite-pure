import type { ProjectConfig } from '/#/config';

import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';

import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground';
import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
import { updateDarkTheme } from '/@/logics/theme/dark';
import { changeTheme } from '/@/logics/theme';

import { getCommonStoragePrefix, getStorageShortName } from '/@/utils/env';

import { primaryColor } from '../../build/config/themeConfig';
import { Persistent } from '/@/utils/cache/persistent';
import { deepMerge } from '/@/utils';
import { ThemeEnum } from '/@/enums/appEnum';

import { actions, store } from '/@/store';

const appActions = actions.app;
const localeActions = actions.locale;

// Initial project configuration
export function initAppConfigStore() {
  const appState = store.getState().app;
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
  appActions.setProjectConfig(projCfg);

  // init dark mode
  updateDarkTheme(darkMode);
  if (darkMode === ThemeEnum.DARK) {
    updateHeaderBgColor();
    updateSidebarBgColor();
  } else {
    headerBgColor && updateHeaderBgColor(headerBgColor);
    bgColor && updateSidebarBgColor(bgColor);
  }
  // init store
  localeActions.initLocale();

  setTimeout(() => {
    clearObsoleteStorage();
  }, 16);
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
