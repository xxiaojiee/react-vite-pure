import type { TransitionSetting } from '/#/config';
import { useStoreState, actions } from '/@/store';
import { useDispatch } from 'react-redux';

const appActions = actions.app

export function useTransitionSetting() {
  const appState = useStoreState('app');
  const dispatch = useDispatch();
  const getEnableTransition = () => appState.projectConfig.transitionSetting?.enable;

  const getOpenNProgress = () => appState.projectConfig.transitionSetting?.openNProgress;

  const getOpenPageLoading = (): boolean => {
    return !!appState.projectConfig.transitionSetting?.openPageLoading;
  };
  const getBasicTransition = () => appState.projectConfig.transitionSetting?.basicTransition;

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    dispatch(appActions.setProjectConfig({ transitionSetting }))
  }
  return {
    setTransitionSetting,

    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading,
    getBasicTransition,
  };
}
