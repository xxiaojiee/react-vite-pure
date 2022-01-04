import type { ProjectConfig } from '/#/config';
import { useStoreState, actions } from '/@/store';
import { useDispatch } from 'react-redux';
import { ContentEnum, ThemeEnum } from '/@/enums/appEnum';

type RootSetting = Omit<
  ProjectConfig,
  'locale' | 'headerSetting' | 'menuSetting' | 'multiTabsSetting'
>;

const appActions = actions.app;

export function useRootSetting() {
  const appState = useStoreState('app');
  const disPatch = useDispatch();
  const getPageLoading = () => appState.pageLoading;

  const getOpenKeepAlive = () => appState.projectConfig?.openKeepAlive;

  const getSettingButtonPosition = () => appState.projectConfig?.settingButtonPosition;

  const getCanEmbedIFramePage = () => appState.projectConfig?.canEmbedIFramePage;

  const getPermissionMode = () => appState.projectConfig?.permissionMode;

  const getShowLogo = () => appState.projectConfig?.showLogo;

  const getContentMode = () => appState.projectConfig?.contentMode;

  const getUseOpenBackTop = () => appState.projectConfig?.useOpenBackTop;

  const getShowSettingButton = () => appState.projectConfig?.showSettingButton;

  const getUseErrorHandle = () => appState.projectConfig?.useErrorHandle;

  const getShowFooter = () => appState.projectConfig?.showFooter;

  const getShowBreadCrumb = () => appState.projectConfig?.showBreadCrumb;

  const getThemeColor = () => appState.projectConfig?.themeColor;

  const getShowBreadCrumbIcon = () => appState.projectConfig?.showBreadCrumbIcon;

  const getFullContent = () => appState.projectConfig?.fullContent;

  const getColorWeak = () => appState.projectConfig?.colorWeak;

  const getGrayMode = () => appState.projectConfig?.grayMode;

  const getLockTime = () => appState.projectConfig?.lockTime;

  const getShowDarkModeToggle = () => appState.projectConfig?.showDarkModeToggle;

  const getDarkMode = () => appState.darkMode;

  const getLayoutContentMode = () =>
    appState.projectConfig?.contentMode === ContentEnum.FULL
      ? ContentEnum.FULL
      : ContentEnum.FIXED;

  function setRootSetting(setting: Partial<RootSetting>) {
    disPatch(appActions.setProjectConfig(setting))
  }

  function setDarkMode(mode: ThemeEnum) {
    disPatch(appActions.setDarkMode(mode))
  }
  return {
    setRootSetting,

    getSettingButtonPosition,
    getFullContent,
    getColorWeak,
    getGrayMode,
    getLayoutContentMode,
    getPageLoading,
    getOpenKeepAlive,
    getCanEmbedIFramePage,
    getPermissionMode,
    getShowLogo,
    getUseErrorHandle,
    getShowBreadCrumb,
    getShowBreadCrumbIcon,
    getUseOpenBackTop,
    getShowSettingButton,
    getShowFooter,
    getContentMode,
    getLockTime,
    getThemeColor,
    getDarkMode,
    setDarkMode,
    getShowDarkModeToggle,
  };
}
