import type { MultiTabsSetting } from '/#/config';
import { useStoreState, actions } from '/@/store';
import { useDispatch } from 'react-redux';

const appActions = actions.app

export function useMultipleTabSetting() {
  const appState = useStoreState('app');
  const dispatch = useDispatch();
  const showMultipleTab = appState.multiTabsSetting?.show;

  const showQuick = appState.multiTabsSetting?.showQuick;

  const showRedo = appState.multiTabsSetting?.showRedo;

  const showFold = appState.multiTabsSetting?.showFold;

  function setMultipleTabSetting(multiTabsSetting: Partial<MultiTabsSetting>) {
    dispatch(appActions.setProjectConfig({ multiTabsSetting }))
  }
  return {
    setMultipleTabSetting,
    showMultipleTab,
    showQuick,
    showRedo,
    showFold,
  };
}
