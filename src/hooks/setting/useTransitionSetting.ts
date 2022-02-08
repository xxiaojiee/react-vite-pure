import type { TransitionSetting } from '/#/config';
import { useStoreState, actions } from '/@/store';
import { useDispatch } from 'react-redux';

const appActions = actions.app

export function useTransitionSetting() {
  const appState = useStoreState('app');
  const dispatch = useDispatch();
  const getEnableTransition = () => appState.transitionSetting?.enable;

  const getOpenNProgress = () => appState.transitionSetting?.openNProgress;

  const getOpenPageLoading = (): boolean => {
    return !!appState.transitionSetting?.openPageLoading;
  };

  const getBasicTransition = () => appState.transitionSetting?.basicTransition;

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
