import type { MultiTabsSetting } from '/#/config';
import { useStoreState, actions } from '/@/store';
import { useDispatch } from 'react-redux';

const appActions = actions.app

export function useMultipleTabSetting() {
  const appState = useStoreState('app');
  const dispatch = useDispatch();
  const getShowMultipleTab = () => appState.multiTabsSetting.show;

  const getShowQuick = () => appState.multiTabsSetting.showQuick;

  const getShowRedo = () => appState.multiTabsSetting.showRedo;

  const getShowFold = () => appState.multiTabsSetting.showFold;

  function setMultipleTabSetting(multiTabsSetting: Partial<MultiTabsSetting>) {
    dispatch(appActions.setProjectConfig({ multiTabsSetting }))
  }
  return {
    setMultipleTabSetting,
    getShowMultipleTab,
    getShowQuick,
    getShowRedo,
    getShowFold,
  };
}
