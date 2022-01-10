import { useImmer } from 'use-immer';
import { createContainer } from 'unstated-next';

export interface AppContainerProp {
  prefixCls: string;
  isMobile: boolean;
}

export const useApp = (initialState) => {
  const [app, updateApp] = useImmer<AppContainerProp>(initialState);
  const saveApp = (apps: AppContainerProp) => {
    updateApp((state) => {
      console.log('state:', state, app)
      return apps
    });
  };
  return { app, saveApp };
};

const App = createContainer(useApp);

export const AppProvider = App.Provider;

export const useAppContainer = () => App.useContainer();
