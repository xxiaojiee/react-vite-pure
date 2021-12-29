import { useImmer } from 'use-immer';
import { createContainer } from 'unstated-next';
import { prefixCls } from '/@/settings/designSetting';

export interface ICurrentApp {
  prefixCls: string;
  isMobile: boolean;
}

export const useApp = (initialState = { prefixCls, isMobile: false }) => {
  const [app, updateApp] = useImmer<ICurrentApp>(initialState);
  const saveApp = (apps: ICurrentApp) => {
    updateApp(() => apps);
  };
  return { app, saveApp };
};

const App = createContainer(useApp);

export const AppProvider = App.Provider;

export const useAppContainer = () => App.useContainer();
