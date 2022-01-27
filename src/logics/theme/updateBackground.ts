import { colorIsDark, lighten, darken } from '/@/utils/color';
import { actions, store, useStoreState } from '/@/store';
import { useDispatch } from 'react-redux'
import type { AppState } from '/@/store/app.store';
import { ThemeEnum } from '/@/enums/appEnum';
import { setCssVar } from './util';

const HEADER_BG_COLOR_VAR = '--header-bg-color';
const HEADER_BG_HOVER_COLOR_VAR = '--header-bg-hover-color';
const HEADER_MENU_ACTIVE_BG_COLOR_VAR = '--header-active-menu-bg-color';

const SIDER_DARK_BG_COLOR = '--sider-dark-bg-color';
const SIDER_DARK_DARKEN_BG_COLOR = '--sider-dark-darken-bg-color';
const SIDER_LIGHTEN_BG_COLOR = '--sider-dark-lighten-bg-color';

const appActions = actions.app;

/**
 * 改变顶部标题的背景颜色
 * @param color
 */
export function updateHeaderBgColor(color?: string) {
  const appState: AppState = store.getState().app;
  const darkMode = appState.darkMode === ThemeEnum.DARK;
  let newColor = color;
  if (!color) {
    if (darkMode) {
      newColor = '#151515';
    } else {
      newColor = appState.projectConfig?.headerSetting.bgColor;
    }
  }
  // bg color
  setCssVar(HEADER_BG_COLOR_VAR, newColor);

  // hover color
  const hoverColor = lighten(newColor!, 6);
  setCssVar(HEADER_BG_HOVER_COLOR_VAR, hoverColor);
  setCssVar(HEADER_MENU_ACTIVE_BG_COLOR_VAR, hoverColor);

  // Determine the depth of the color value and automatically switch the theme
  const isDark = colorIsDark(newColor!);
  store.dispatch(appActions.setProjectConfig({
    headerSetting: {
      theme: isDark || darkMode ? ThemeEnum.DARK : ThemeEnum.LIGHT,
    },
  }))
}

/**
 * Change the background color of the left menu
 * @param color  bg color
 */
export function updateSidebarBgColor(color?: string) {
  const appState: AppState = store.getState().app;
  let newColor = color;
  // if (!isHexColor(color)) return;
  const darkMode = appState.darkMode === ThemeEnum.DARK;
  if (!color) {
    if (darkMode) {
      newColor = '#212121';
    } else {
      newColor = appState.projectConfig?.menuSetting.bgColor;
    }
  }
  setCssVar(SIDER_DARK_BG_COLOR, newColor);
  setCssVar(SIDER_DARK_DARKEN_BG_COLOR, darken(newColor!, 6));
  setCssVar(SIDER_LIGHTEN_BG_COLOR, lighten(newColor!, 5));

  // only #ffffff is light
  // Only when the background color is #fff, the theme of the menu will be changed to light
  const isLight = ['#fff', '#ffffff'].includes(newColor!.toLowerCase());
  store.dispatch(appActions.setProjectConfig({
    menuSetting: {
      theme: isLight && !darkMode ? ThemeEnum.LIGHT : ThemeEnum.DARK,
    },
  }))
}
