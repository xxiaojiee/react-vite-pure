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

  const { pageLoading } = appState;

  const openKeepAlive = appState.projectConfig?.openKeepAlive;

  const settingButtonPosition = appState.projectConfig?.settingButtonPosition;

  const canEmbedIFramePage = appState.projectConfig?.canEmbedIFramePage;

  const permissionMode = appState.projectConfig?.permissionMode;

  const showLogo = appState.projectConfig?.showLogo;

  const contentMode = appState.projectConfig?.contentMode;

  const useOpenBackTop = appState.projectConfig?.useOpenBackTop;

  const showSettingButton = appState.projectConfig?.showSettingButton;

  const useErrorHandle = appState.projectConfig?.useErrorHandle;

  const showFooter = appState.projectConfig?.showFooter;

  const showBreadCrumb = appState.projectConfig?.showBreadCrumb;

  const themeColor = appState.projectConfig?.themeColor;

  const showBreadCrumbIcon = appState.projectConfig?.showBreadCrumbIcon;

  const fullContent = appState.projectConfig?.fullContent;

  const colorWeak = appState.projectConfig?.colorWeak;

  const grayMode = appState.projectConfig?.grayMode;

  const lockTime = appState.projectConfig?.lockTime;

  const showDarkModeToggle = appState.projectConfig?.showDarkModeToggle;

  const { darkMode } = appState;

  const layoutContentMode = appState.projectConfig?.contentMode === ContentEnum.FULL
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

    settingButtonPosition,
    fullContent,
    colorWeak,
    grayMode,
    layoutContentMode,
    pageLoading,
    openKeepAlive,
    canEmbedIFramePage,
    permissionMode,
    showLogo,
    useErrorHandle,
    showBreadCrumb,
    showBreadCrumbIcon,
    useOpenBackTop,
    showSettingButton,
    showFooter,
    contentMode,
    lockTime,
    themeColor,
    darkMode,
    setDarkMode,
    showDarkModeToggle,
  };
}
