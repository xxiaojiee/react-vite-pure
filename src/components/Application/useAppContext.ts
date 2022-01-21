import { useImmer } from 'use-immer';
import { createContainer } from 'unstated-next';
import type { RouterRenderProp } from '/@/router/types';
import { prefixCls } from '/@/settings/designSetting';
import { createLoading } from '/@/components/Loading/src/createLoading';
import type { LoadProps } from '/@/components/Loading/src/createLoading';


export interface initAppContainerProp {
  prefixCls: string;
  isMobile: boolean;
  loading: LoadProps;
}
export type AppContainerProp = RouterRenderProp & initAppContainerProp;


export const useApp = () => {
  const [app, updateApp] = useImmer<AppContainerProp>({
    prefixCls,
    isMobile: false,
    loading: createLoading({
      loading: false,
    }),
  } as any);
  const saveApp = (apps: Partial<AppContainerProp>) => {
    console.log('设置了Container：', apps);
    updateApp((state) => {
      return {
        ...state,
        ...apps,
      }
    });
  };
  return { ...app, saveApp };
};

const App = createContainer(useApp);

export const AppProvider = App.Provider;

export const useAppContainer = () => App.useContainer();
