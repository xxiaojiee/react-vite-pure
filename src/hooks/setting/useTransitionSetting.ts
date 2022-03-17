import type { TransitionSetting } from '/#/config';
import { useStoreState, actions } from '/@/store';
import { useDispatch } from 'react-redux';

const appActions = actions.app

export function useTransitionSetting() {
  const appState = useStoreState('app');
  const dispatch = useDispatch();
  const enableTransition = appState.projectConfig.transitionSetting?.enable;

  const openNProgress = appState.projectConfig.transitionSetting?.openNProgress;

  const openPageLoading = !!appState.projectConfig.transitionSetting?.openPageLoading;
  const basicTransition = appState.projectConfig.transitionSetting?.basicTransition;

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    dispatch(appActions.setProjectConfig({ transitionSetting }))
  }
  return {
    setTransitionSetting,

    enableTransition,
    openNProgress,
    openPageLoading,
    basicTransition,
  };
}
