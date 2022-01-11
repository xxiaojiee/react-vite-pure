import type { HeaderSetting } from '/#/config';

import { useDispatch } from 'react-redux'
import { actions, useStoreState } from '/@/store';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useFullContent } from '/@/hooks/web/useFullContent';

import { MenuModeEnum } from '/@/enums/menuEnum';

const appActions = actions.app;

export function useHeaderSetting() {
  const dispatch = useDispatch();
  const appState = useStoreState('app');
  const { getFullContent } = useFullContent();

  const getShowFullHeaderRef = () => {
    return (
      !getFullContent() &&
      getShowMixHeaderRef() &&
      getShowHeader() &&
      !getIsTopMenu() &&
      !getIsMixSidebar()
    );
  };

  const getUnFixedAndFull = () => !getFixed() && !getShowFullHeaderRef();

  const getShowInsetHeaderRef = () => {
    const need = !getFullContent() && getShowHeader();
    return (
      (need && !getShowMixHeaderRef()) ||
      (need && getIsTopMenu()) ||
      (need && getIsMixSidebar())
    );
  };

  const {
    getMenuMode,
    getSplit,
    getShowHeaderTrigger,
    getIsSidebarType,
    getIsMixSidebar,
    getIsTopMenu,
  } = useMenuSetting();
  const { getShowBreadCrumb, getShowLogo } = useRootSetting();

  const getShowMixHeaderRef = () => !getIsSidebarType() && getShowHeader();

  const getShowDoc = () => appState.projectConfig?.headerSetting.showDoc;

  const getHeaderTheme = () => appState.projectConfig?.headerSetting.theme;

  const getShowHeader = () => appState.projectConfig?.headerSetting.show;

  const getFixed = () => appState.projectConfig?.headerSetting.fixed;

  const getHeaderBgColor = () => appState.projectConfig?.headerSetting.bgColor;

  const getShowSearch = () => appState.projectConfig?.headerSetting.showSearch;

  const getUseLockPage = () => appState.projectConfig?.headerSetting.useLockPage;

  const getShowFullScreen = () => appState.projectConfig?.headerSetting.showFullScreen;

  const getShowNotice = () => appState.projectConfig?.headerSetting.showNotice;

  const getShowBread = () => {
    return (
      getMenuMode() !== MenuModeEnum.HORIZONTAL && getShowBreadCrumb() && !getSplit()
    );
  };

  const getShowHeaderLogo = () => {
    return getShowLogo() && !getIsSidebarType() && !getIsMixSidebar();
  };

  const getShowContent = () => {
    return getShowBread() || getShowHeaderTrigger();
  };

  // Set header configuration
  function setHeaderSetting(headerSetting: Partial<HeaderSetting>) {
    dispatch(appActions.setProjectConfig({ headerSetting }))
  }
  return {
    setHeaderSetting,

    getShowDoc,
    getShowSearch,
    getHeaderTheme,
    getUseLockPage,
    getShowFullScreen,
    getShowNotice,
    getShowBread,
    getShowContent,
    getShowHeaderLogo,
    getShowHeader,
    getFixed,
    getShowMixHeaderRef,
    getShowFullHeaderRef,
    getShowInsetHeaderRef,
    getUnFixedAndFull,
    getHeaderBgColor,
  };
}
