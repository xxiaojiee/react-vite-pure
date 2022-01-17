import { useImmer } from 'use-immer';
import { createContainer } from 'unstated-next';
import type { RouterRenderProp } from '/@/router/types';
import type { LoadProps } from '/@/components/Loading/src/createLoading';

export interface AppContainerProp extends RouterRenderProp {
  prefixCls: string;
  isMobile: boolean;
  loading: LoadProps;
}

export const useApp = (initialState) => {
  const [app, updateApp] = useImmer<AppContainerProp>(initialState);
  const saveApp = (apps: Partial<AppContainerProp>) => {
    updateApp((state) => {
      return {
        ...state,
        ...apps,
      }
    });
  };
  return { app, saveApp };
};

const App = createContainer(useApp);

export const AppProvider = App.Provider;

export const useAppContainer = () => App.useContainer();
