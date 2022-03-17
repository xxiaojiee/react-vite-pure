import type { HeaderSetting } from '/#/config';

import { useDispatch } from 'react-redux'
import { actions, useStoreState } from '/@/store';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useFullContent } from '/@/hooks/web/useFullContent';

import { MenuModeEnum } from '/@/enums/menuEnum';
import { useMemo } from 'react';

const appActions = actions.app;

export function useHeaderSetting() {
  const dispatch = useDispatch();
  const appState = useStoreState('app');
  const fullContent = useFullContent();


  const {
    menuMode,
    split,
    showHeaderTrigger,
    isSidebarType,
    isMixSidebar,
    isTopMenu,
  } = useMenuSetting();
  const { showBreadCrumb, showLogo } = useRootSetting();

  const showHeader = appState.projectConfig?.headerSetting.show;

  const showMixHeaderRef = !isSidebarType && showHeader;

  const showDoc = appState.projectConfig?.headerSetting.showDoc;

  const headerTheme = appState.projectConfig?.headerSetting.theme;


  const fixed = appState.projectConfig?.headerSetting.fixed;

  const headerBgColor = appState.projectConfig?.headerSetting.bgColor;

  const showSearch = appState.projectConfig?.headerSetting.showSearch;

  const useLockPage = appState.projectConfig?.headerSetting.useLockPage;

  const showFullScreen = appState.projectConfig?.headerSetting.showFullScreen;

  const showNotice = appState.projectConfig?.headerSetting.showNotice;

  const showBread = menuMode !== MenuModeEnum.HORIZONTAL && showBreadCrumb && !split;

  const showHeaderLogo = showLogo && !isSidebarType && !isMixSidebar;

  const showContent = showBread || showHeaderTrigger

  // Set header configuration
  function setHeaderSetting(headerSetting: Partial<HeaderSetting>) {
    dispatch(appActions.setProjectConfig({ headerSetting }))
  }

  const showFullHeaderRef = (
    !fullContent &&
    showMixHeaderRef &&
    showHeader &&
    !isTopMenu &&
    !isMixSidebar
  );

  const unFixedAndFull = !fixed && !showFullHeaderRef;

  const showInsetHeaderRef = useMemo(() => {
    const need = !fullContent && showHeader;
    return (
      (need && !showMixHeaderRef) ||
      (need && isTopMenu) ||
      (need && isMixSidebar)
    );
  }, [fullContent, isMixSidebar, isTopMenu, showHeader, showMixHeaderRef]);

  return {
    setHeaderSetting,

    showDoc,
    showSearch,
    headerTheme,
    useLockPage,
    showFullScreen,
    showNotice,
    showBread,
    showContent,
    showHeaderLogo,
    showHeader,
    fixed,
    showMixHeaderRef,
    showFullHeaderRef,
    showInsetHeaderRef,
    unFixedAndFull,
    headerBgColor,
  };
}
